"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, LayoutGrid } from "lucide-react";
import {
  posts, getPostsByDay, getPostsForMonth,
  fmtTime, STATUS_STYLE, platformMeta,
  type CalendarPost, type Platform,
} from "@/lib/data/calendario";
import { SidePanel } from "./side-panel";

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTH_NAMES = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro",
];

const PLATFORM_ORDER: Platform[] = ["instagram", "tiktok", "youtube", "linkedin"];

// ── Summary bar ──────────────────────────────────────────────────────────────

function SummaryBar({ monthPosts }: { monthPosts: CalendarPost[] }) {
  const platformCounts = useMemo(() => {
    const counts: Partial<Record<Platform, number>> = {};
    monthPosts.forEach((p) => p.platforms.forEach((pl) => {
      counts[pl] = (counts[pl] ?? 0) + 1;
    }));
    return counts;
  }, [monthPosts]);

  const statusCounts = useMemo(() => ({
    agendado:  monthPosts.filter((p) => p.status === "agendado").length,
    publicado: monthPosts.filter((p) => p.status === "publicado").length,
    rascunho:  monthPosts.filter((p) => p.status === "rascunho").length,
    falhou:    monthPosts.filter((p) => p.status === "falhou").length,
  }), [monthPosts]);

  return (
    <div
      className="rounded-xl border px-5 py-4 flex flex-wrap items-center gap-x-8 gap-y-3"
      style={{ background: "var(--card)", borderColor: "var(--border)" }}
    >
      {/* Total */}
      <div>
        <p className="text-2xl font-bold tabular-nums" style={{ color: "var(--foreground)" }}>
          {monthPosts.length}
        </p>
        <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>posts no mês</p>
      </div>

      <div className="w-px h-8 self-center" style={{ background: "var(--border)" }} />

      {/* By status */}
      <div className="flex items-center gap-4">
        {(["agendado", "publicado", "rascunho", "falhou"] as const).map((s) => (
          statusCounts[s] > 0 && (
            <div key={s} className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: STATUS_STYLE[s].dot }}
              />
              <span className="text-xs tabular-nums font-medium" style={{ color: "var(--foreground)" }}>
                {statusCounts[s]}
              </span>
              <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>{s}</span>
            </div>
          )
        ))}
      </div>

      <div className="w-px h-8 self-center" style={{ background: "var(--border)" }} />

      {/* By platform */}
      <div className="flex items-center gap-3">
        {PLATFORM_ORDER.map((pl) => {
          const count = platformCounts[pl];
          if (!count) return null;
          const meta = platformMeta[pl];
          return (
            <div key={pl} className="flex items-center gap-1.5">
              <span style={{ fontSize: "1rem", lineHeight: 1 }}>{meta.icon}</span>
              <span className="text-xs tabular-nums font-medium" style={{ color: "var(--foreground)" }}>
                {count}
              </span>
            </div>
          );
        })}
      </div>

      <div className="ml-auto">
        <LayoutGrid size={14} style={{ color: "var(--muted-foreground)" }} />
      </div>
    </div>
  );
}

// ── Calendar slot ────────────────────────────────────────────────────────────

function CalSlot({
  post,
  onClick,
  selected,
}: {
  post: CalendarPost;
  onClick: () => void;
  selected: boolean;
}) {
  const platColors = post.platforms.map((p) => platformMeta[p].color);

  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-lg px-2 py-1.5 text-xs transition-all border"
      style={
        selected
          ? { background: "var(--primary)" + "33", borderColor: "var(--primary)", color: "var(--foreground)" }
          : { background: STATUS_STYLE[post.status].bg, borderColor: "transparent", color: "var(--foreground)" }
      }
    >
      {/* Time + platform dots */}
      <div className="flex items-center gap-1 mb-0.5">
        <span className="font-mono text-xs" style={{ color: selected ? "var(--primary)" : STATUS_STYLE[post.status].dot }}>
          {fmtTime(post.scheduledAt)}
        </span>
        <div className="flex gap-0.5 ml-auto">
          {platColors.map((c, i) => (
            <span key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: c }} />
          ))}
        </div>
      </div>
      {/* Hook truncated */}
      <p className="leading-tight line-clamp-2" style={{ fontSize: "0.68rem", color: "var(--muted-foreground)" }}>
        {post.hook}
      </p>
    </button>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────

export function CalendarioClient() {
  const today = new Date("2026-06-30");
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(7); // July 2026
  const [selectedPost, setSelectedPost] = useState<CalendarPost | null>(null);

  function prevMonth() {
    if (month === 1) { setYear((y) => y - 1); setMonth(12); }
    else setMonth((m) => m - 1);
  }
  function nextMonth() {
    if (month === 12) { setYear((y) => y + 1); setMonth(1); }
    else setMonth((m) => m + 1);
  }

  const monthPosts = useMemo(() => getPostsForMonth(year, month), [year, month]);
  const postsByDay = useMemo(() => getPostsByDay(year, month), [year, month]);

  // Build grid: weeks × 7 days
  const firstDow = new Date(year, month - 1, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month, 0).getDate();
  const prevMonthDays = new Date(year, month - 1, 0).getDate();

  // cells: null = padding, number = day
  const cells: (number | null)[] = [
    ...Array.from({ length: firstDow }, (_, i) => null as null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // pad end to complete last week
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Page header */}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>Calendário</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--muted-foreground)" }}>
            Visão mensal de agendamentos · clique num slot para ver o roteiro
          </p>
        </div>

        {/* Month nav */}
        <div
          className="flex items-center gap-2 p-1 rounded-xl border"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}
        >
          <button
            onClick={prevMonth}
            className="p-1.5 rounded-lg transition-colors hover:bg-white/5"
            style={{ color: "var(--muted-foreground)" }}
          >
            <ChevronLeft size={16} />
          </button>
          <span className="px-3 text-sm font-semibold min-w-36 text-center" style={{ color: "var(--foreground)" }}>
            {MONTH_NAMES[month - 1]} {year}
          </span>
          <button
            onClick={nextMonth}
            className="p-1.5 rounded-lg transition-colors hover:bg-white/5"
            style={{ color: "var(--muted-foreground)" }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Summary bar */}
      <SummaryBar monthPosts={monthPosts} />

      {/* Calendar grid */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ background: "var(--card)", borderColor: "var(--border)" }}
      >
        {/* Weekday headers */}
        <div className="grid grid-cols-7 border-b" style={{ borderColor: "var(--border)" }}>
          {WEEKDAYS.map((d) => (
            <div
              key={d}
              className="py-2.5 text-center text-xs font-semibold uppercase tracking-wide"
              style={{ color: "var(--muted-foreground)" }}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Weeks */}
        <div>
          {Array.from({ length: cells.length / 7 }, (_, week) => (
            <div
              key={week}
              className="grid grid-cols-7 border-b last:border-b-0"
              style={{ borderColor: "var(--border)" }}
            >
              {cells.slice(week * 7, week * 7 + 7).map((day, col) => {
                const isToday =
                  day !== null &&
                  today.getFullYear() === year &&
                  today.getMonth() + 1 === month &&
                  today.getDate() === day;
                const dayPosts = day ? (postsByDay.get(day) ?? []) : [];
                const isPadding = day === null;

                return (
                  <div
                    key={col}
                    className="border-r last:border-r-0 min-h-28 p-2"
                    style={{
                      borderColor: "var(--border)",
                      background: isPadding ? "var(--sidebar-bg)" : undefined,
                    }}
                  >
                    {/* Day number */}
                    {day !== null && (
                      <div className="flex items-center justify-between mb-1.5">
                        <span
                          className="text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full"
                          style={
                            isToday
                              ? { background: "var(--primary)", color: "#fff" }
                              : { color: "var(--muted-foreground)" }
                          }
                        >
                          {day}
                        </span>
                        {dayPosts.length > 0 && (
                          <span
                            className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                            style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}
                          >
                            {dayPosts.length}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Posts for this day */}
                    <div className="space-y-1">
                      {dayPosts
                        .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
                        .map((post) => (
                          <CalSlot
                            key={post.id}
                            post={post}
                            onClick={() => setSelectedPost(post)}
                            selected={selectedPost?.id === post.id}
                          />
                        ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Platform legend */}
      <div className="flex items-center gap-1 flex-wrap">
        <span className="text-xs mr-2" style={{ color: "var(--muted-foreground)" }}>Plataformas:</span>
        {PLATFORM_ORDER.map((pl) => {
          const meta = platformMeta[pl];
          return (
            <span key={pl} className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border"
              style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}>
              <span>{meta.icon}</span> {meta.label}
              <span className="w-2 h-2 rounded-full" style={{ background: meta.color }} />
            </span>
          );
        })}
        <span className="text-xs ml-4 mr-2" style={{ color: "var(--muted-foreground)" }}>Status:</span>
        {(["agendado", "publicado", "rascunho"] as const).map((s) => (
          <span key={s} className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border"
            style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}>
            <span className="w-2 h-2 rounded-full" style={{ background: STATUS_STYLE[s].dot }} />
            {s}
          </span>
        ))}
      </div>

      {/* Side panel */}
      <SidePanel post={selectedPost} onClose={() => setSelectedPost(null)} />
    </div>
  );
}
