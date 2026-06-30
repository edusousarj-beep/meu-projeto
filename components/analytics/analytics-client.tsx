"use client";

import { useState } from "react";
import { Flame, TrendingUp, TrendingDown, Eye, Bookmark, UserPlus, MessageCircle } from "lucide-react";
import {
  metricCards, series, heaters, reels, medianViews30,
  fmt, fmtDate,
  type MetricKey,
} from "@/lib/data/analytics";
import { Sparkline } from "./sparkline";

type Window = 7 | 30 | 90;

const metricIcon: Record<MetricKey, React.ReactNode> = {
  views:   <Eye size={14} />,
  saves:   <Bookmark size={14} />,
  follows: <UserPlus size={14} />,
  dms:     <MessageCircle size={14} />,
};

export function AnalyticsClient() {
  const [win, setWin] = useState<Window>(30);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>Analytics</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--muted-foreground)" }}>
            Instagram · dados mockados · mediana 30 dias:{" "}
            <span className="font-medium" style={{ color: "var(--foreground)" }}>{fmt(medianViews30)} views</span>
            {" "}· heater = 2×
          </p>
        </div>

        {/* Window toggle */}
        <div
          className="flex items-center gap-1 p-1 rounded-xl border"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}
        >
          {([7, 30, 90] as Window[]).map((w) => (
            <button
              key={w}
              onClick={() => setWin(w)}
              className="px-4 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={
                win === w
                  ? { background: "var(--primary)", color: "#fff" }
                  : { color: "var(--muted-foreground)" }
              }
            >
              {w}d
            </button>
          ))}
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {metricCards.map((card) => {
          const total = win === 7 ? card.total7 : card.total30;
          const delta = win === 7 ? card.delta7 : card.delta30;
          const positive = delta >= 0;
          return (
            <div
              key={card.key}
              className="rounded-xl border p-5 space-y-4"
              style={{ background: "var(--card)", borderColor: "var(--border)" }}
            >
              {/* Top row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span style={{ color: card.color }}>{metricIcon[card.key]}</span>
                  <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>{card.label}</span>
                </div>
                <span
                  className="flex items-center gap-0.5 text-xs font-medium"
                  style={{ color: positive ? "#4ade80" : "#f87171" }}
                >
                  {positive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                  {positive ? "+" : ""}{delta}%
                </span>
              </div>

              {/* Value */}
              <div>
                <p className="text-3xl font-bold tabular-nums" style={{ color: "var(--foreground)" }}>
                  {fmt(total)}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                  últimos {win} dias
                </p>
              </div>

              {/* Sparkline */}
              <Sparkline
                data={series[card.key]}
                color={card.color}
                width={160}
                height={40}
                window={win === 90 ? 90 : win}
              />
            </div>
          );
        })}
      </div>

      {/* Top 5 Heaters */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Flame size={16} style={{ color: "var(--primary)" }} />
          <h2 className="text-base font-semibold" style={{ color: "var(--foreground)" }}>
            Top 5 Heaters
          </h2>
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: "var(--primary)" + "22", color: "var(--primary)" }}
          >
            &gt; 2× mediana
          </span>
        </div>

        <div
          className="rounded-xl border overflow-hidden"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}
        >
          {/* Table header */}
          <div
            className="grid text-xs font-medium px-5 py-3 border-b"
            style={{
              gridTemplateColumns: "2rem 1fr 7rem 6rem 6rem 6rem",
              color: "var(--muted-foreground)",
              borderColor: "var(--border)",
            }}
          >
            <span>#</span>
            <span>Reel</span>
            <span className="text-right">Views</span>
            <span className="text-right">Saves</span>
            <span className="text-right">Follows</span>
            <span className="text-right">DMs</span>
          </div>

          {heaters.map((r, i) => (
            <div
              key={r.id}
              className="grid items-start px-5 py-4 border-b last:border-b-0 gap-x-3"
              style={{
                gridTemplateColumns: "2rem 1fr 7rem 6rem 6rem 6rem",
                borderColor: "var(--border)",
              }}
            >
              {/* Rank */}
              <div className="flex items-center justify-start pt-0.5">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: "var(--primary)", color: "#fff" }}
                >
                  {i + 1}
                </span>
              </div>

              {/* Title + meta + note */}
              <div className="min-w-0 space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-lg leading-none">{r.thumbnail}</span>
                  <p className="text-sm font-medium leading-snug" style={{ color: "var(--foreground)" }}>
                    {r.title}
                  </p>
                </div>
                <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                  Postado em {fmtDate(r.publishedAt)}
                </p>
                {r.heaterNote && (
                  <div
                    className="flex items-start gap-1.5 rounded-lg px-3 py-2 text-xs leading-relaxed"
                    style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}
                  >
                    <Flame size={11} className="mt-0.5 shrink-0" style={{ color: "var(--primary)" }} />
                    {r.heaterNote}
                  </div>
                )}
              </div>

              {/* Stats */}
              <Stat value={r.views} />
              <Stat value={r.saves} />
              <Stat value={r.follows} />
              <Stat value={r.dms} />
            </div>
          ))}
        </div>
      </section>

      {/* All reels table */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold" style={{ color: "var(--foreground)" }}>
          Todos os Reels
        </h2>

        <div
          className="rounded-xl border overflow-hidden"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}
        >
          <div
            className="grid text-xs font-medium px-5 py-3 border-b"
            style={{
              gridTemplateColumns: "1fr 7rem 6rem 6rem 6rem 5rem",
              color: "var(--muted-foreground)",
              borderColor: "var(--border)",
            }}
          >
            <span>Reel</span>
            <span className="text-right">Views</span>
            <span className="text-right">Saves</span>
            <span className="text-right">Follows</span>
            <span className="text-right">DMs</span>
            <span className="text-right">Status</span>
          </div>

          {[...reels].sort((a, b) => b.views - a.views).map((r) => {
            const isHeater = r.views >= medianViews30 * 2;
            return (
              <div
                key={r.id}
                className="grid items-center px-5 py-3.5 border-b last:border-b-0 gap-x-3"
                style={{
                  gridTemplateColumns: "1fr 7rem 6rem 6rem 6rem 5rem",
                  borderColor: "var(--border)",
                }}
              >
                <div className="min-w-0 flex items-center gap-2">
                  <span className="text-base leading-none">{r.thumbnail}</span>
                  <div className="min-w-0">
                    <p className="text-sm truncate" style={{ color: "var(--foreground)" }}>{r.title}</p>
                    <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                      {fmtDate(r.publishedAt)}
                    </p>
                  </div>
                </div>
                <Stat value={r.views} />
                <Stat value={r.saves} />
                <Stat value={r.follows} />
                <Stat value={r.dms} />
                <div className="flex justify-end">
                  {isHeater ? (
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                      style={{ background: "var(--primary)" + "22", color: "var(--primary)" }}
                    >
                      <Flame size={10} /> heater
                    </span>
                  ) : (
                    <span
                      className="px-2 py-0.5 rounded-full text-xs"
                      style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}
                    >
                      normal
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}

function Stat({ value }: { value: number }) {
  return (
    <p className="text-sm tabular-nums font-medium text-right self-center" style={{ color: "var(--foreground)" }}>
      {fmt(value)}
    </p>
  );
}
