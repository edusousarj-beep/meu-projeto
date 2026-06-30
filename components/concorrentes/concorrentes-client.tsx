"use client";

import { useState, useMemo } from "react";
import {
  Clock, RefreshCw, CheckCircle, ChevronDown, ChevronUp,
  Eye, Heart, Bookmark, MessageSquare, Users, Search, X, BookMarked,
} from "lucide-react";
import {
  reels as allReels, creators, scrapeJob, fmt, fmtDate, fmtFollowers,
  type CompetitorReel,
} from "@/lib/data/concorrentes";

// ── Job status bar ───────────────────────────────────────────────────────────

function JobStatusBar() {
  const nextRun = new Date(scrapeJob.scheduledAt);
  const lastRun = new Date(scrapeJob.lastRun);

  const fmtTime = (d: Date) =>
    d.toLocaleString("pt-BR", { weekday: "short", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });

  return (
    <div
      className="rounded-xl border px-5 py-3.5 flex flex-wrap items-center gap-x-6 gap-y-2"
      style={{ background: "var(--card)", borderColor: "var(--border)" }}
    >
      {/* Status */}
      <div className="flex items-center gap-2">
        <CheckCircle size={14} style={{ color: "#4ade80" }} />
        <span className="text-xs font-medium" style={{ color: "#4ade80" }}>Job idle</span>
        <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>·</span>
        <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
          Última raspagem: <span style={{ color: "var(--foreground)" }}>{fmtTime(lastRun)}</span>
        </span>
      </div>

      <div className="h-3 w-px" style={{ background: "var(--border)" }} />

      {/* Next run */}
      <div className="flex items-center gap-1.5">
        <Clock size={13} style={{ color: "var(--muted-foreground)" }} />
        <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
          Próxima: <span style={{ color: "var(--foreground)" }}>{fmtTime(nextRun)}</span>
          <span className="ml-1" style={{ color: "var(--primary)" }}>(dom 06:00)</span>
        </span>
      </div>

      <div className="h-3 w-px" style={{ background: "var(--border)" }} />

      {/* Stats */}
      <div className="flex items-center gap-1.5">
        <RefreshCw size={13} style={{ color: "var(--muted-foreground)" }} />
        <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
          <span style={{ color: "var(--foreground)" }}>{scrapeJob.reelsScraped} reels</span>
          {" de "}
          <span style={{ color: "var(--foreground)" }}>{scrapeJob.accountsScraped} contas</span>
          {" raspados"}
        </span>
      </div>
    </div>
  );
}

// ── Expanded row ─────────────────────────────────────────────────────────────

function ExpandedRow({ reel }: { reel: CompetitorReel }) {
  return (
    <div className="px-5 pb-5 space-y-3">
      {/* Hook */}
      <div
        className="rounded-xl p-4 border-l-2 space-y-1"
        style={{ background: "var(--muted)", borderLeftColor: "var(--primary)" }}
      >
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--primary)" }}>
          Hook (primeiros 3s)
        </p>
        <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
          &ldquo;{reel.hook}&rdquo;
        </p>
      </div>

      {/* Screen text */}
      <div
        className="rounded-xl p-4 space-y-1"
        style={{ background: "var(--muted)" }}
      >
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
          Texto na tela
        </p>
        <p className="text-sm font-mono leading-relaxed" style={{ color: "var(--foreground)" }}>
          {reel.screenText}
        </p>
      </div>

      {/* Transcript */}
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
          Transcrição (~20s)
        </p>
        <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
          {reel.transcript}
        </p>
      </div>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export function ConcorrentesClient() {
  const [search, setSearch] = useState("");
  const [selectedCreator, setSelectedCreator] = useState<string>("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return allReels
      .filter((r) => {
        const matchCreator = !selectedCreator || r.handle === selectedCreator;
        const matchSearch =
          !q ||
          r.title.toLowerCase().includes(q) ||
          r.hook.toLowerCase().includes(q) ||
          r.creator.toLowerCase().includes(q);
        return matchCreator && matchSearch;
      })
      .sort((a, b) => b.views - a.views);
  }, [search, selectedCreator]);

  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  function saveToVault(id: string) {
    setSavedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }

  const hasFilters = search || selectedCreator;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>Concorrentes</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--muted-foreground)" }}>
          Top 5 reels por conta · raspado todo domingo às 06:00 · {allReels.length} reels indexados
        </p>
      </div>

      {/* Job status */}
      <JobStatusBar />

      {/* Filters */}
      <div
        className="rounded-xl border p-4 flex flex-wrap items-center gap-3"
        style={{ background: "var(--card)", borderColor: "var(--border)" }}
      >
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted-foreground)" }} />
          <input
            type="text"
            placeholder="Buscar reel ou criador..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded-lg text-sm border outline-none transition-colors"
            style={{ background: "var(--muted)", borderColor: "var(--border)", color: "var(--foreground)" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
          />
        </div>

        {/* Creator filter */}
        <select
          value={selectedCreator}
          onChange={(e) => setSelectedCreator(e.target.value)}
          className="px-3 py-2 rounded-lg text-sm border outline-none min-w-44"
          style={{
            background: "var(--muted)",
            borderColor: selectedCreator ? "var(--primary)" : "var(--border)",
            color: selectedCreator ? "var(--foreground)" : "var(--muted-foreground)",
          }}
        >
          <option value="">Todos os criadores</option>
          {creators.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Clear */}
        {hasFilters && (
          <button
            onClick={() => { setSearch(""); setSelectedCreator(""); }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs border transition-colors hover:bg-white/5"
            style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}
          >
            <X size={12} /> Limpar
          </button>
        )}

        <span className="text-xs ml-auto" style={{ color: "var(--muted-foreground)" }}>
          {filtered.length} reels
        </span>
      </div>

      {/* Creator pills */}
      <div className="flex gap-2 flex-wrap">
        {creators.map((c) => {
          const meta = allReels.find((r) => r.handle === c);
          return (
            <button
              key={c}
              onClick={() => setSelectedCreator(selectedCreator === c ? "" : c)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border transition-all"
              style={
                selectedCreator === c
                  ? { background: "var(--primary)", color: "#fff", borderColor: "var(--primary)" }
                  : { background: "transparent", color: "var(--muted-foreground)", borderColor: "var(--border)" }
              }
            >
              <span>{meta?.avatar}</span>
              {c}
              <span
                className="px-1.5 py-0.5 rounded-full text-xs"
                style={
                  selectedCreator === c
                    ? { background: "rgba(255,255,255,0.2)", color: "#fff" }
                    : { background: "var(--muted)", color: "var(--muted-foreground)" }
                }
              >
                {fmtFollowers(meta?.followers ?? 0)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-2">
          <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Nenhum reel encontrado</p>
          <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>Ajusta os filtros</p>
        </div>
      ) : (
        <div
          className="rounded-xl border overflow-hidden"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}
        >
          {/* Header row */}
          <div
            className="grid px-5 py-3 border-b text-xs font-medium"
            style={{
              gridTemplateColumns: "2rem 1fr 9rem 6rem 6rem 6rem 6rem 9rem 2.5rem",
              color: "var(--muted-foreground)",
              borderColor: "var(--border)",
            }}
          >
            <span>#</span>
            <span>Reel</span>
            <span>Criador</span>
            <span className="text-right">Views</span>
            <span className="text-right">Likes</span>
            <span className="text-right">Saves</span>
            <span className="text-right">Coments.</span>
            <span className="text-center">Hook Vault</span>
            <span />
          </div>

          {filtered.map((r, i) => {
            const saved = savedIds.has(r.id);
            const expanded = expandedId === r.id;

            return (
              <div key={r.id} className="border-b last:border-b-0" style={{ borderColor: "var(--border)" }}>
                {/* Main row */}
                <div
                  className="grid items-center px-5 py-4 gap-x-3 transition-colors hover:bg-white/[0.02]"
                  style={{ gridTemplateColumns: "2rem 1fr 9rem 6rem 6rem 6rem 6rem 9rem 2.5rem" }}
                >
                  {/* Rank */}
                  <span className="text-xs tabular-nums" style={{ color: "var(--muted-foreground)" }}>
                    {i + 1}
                  </span>

                  {/* Title */}
                  <div className="min-w-0">
                    <p className="text-sm font-medium leading-snug truncate" style={{ color: "var(--foreground)" }}>
                      {r.title}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                      {fmtDate(r.publishedAt)}
                    </p>
                  </div>

                  {/* Creator */}
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-base leading-none shrink-0">{r.avatar}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-medium truncate" style={{ color: "var(--foreground)" }}>
                        {r.handle}
                      </p>
                      <div className="flex items-center gap-1">
                        <Users size={9} style={{ color: "var(--muted-foreground)" }} />
                        <span className="text-xs tabular-nums" style={{ color: "var(--muted-foreground)" }}>
                          {fmtFollowers(r.followers)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <StatCell icon={<Eye size={10} />} value={fmt(r.views)} />
                  <StatCell icon={<Heart size={10} />} value={fmt(r.likes)} />
                  <StatCell icon={<Bookmark size={10} />} value={fmt(r.saves)} />
                  <StatCell icon={<MessageSquare size={10} />} value={fmt(r.comments)} />

                  {/* Save to Vault */}
                  <div className="flex justify-center">
                    <button
                      onClick={() => saveToVault(r.id)}
                      disabled={saved}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                      style={
                        saved
                          ? { background: "var(--muted)", color: "var(--muted-foreground)", cursor: "default" }
                          : { background: "var(--primary)", color: "#fff" }
                      }
                    >
                      <BookMarked size={11} />
                      {saved ? "Salvo" : "Salvar"}
                    </button>
                  </div>

                  {/* Expand toggle */}
                  <button
                    onClick={() => toggleExpand(r.id)}
                    className="flex justify-center p-1 rounded-lg transition-colors hover:bg-white/5"
                    style={{ color: expanded ? "var(--primary)" : "var(--muted-foreground)" }}
                    title={expanded ? "Recolher" : "Ver hook, texto e transcrição"}
                  >
                    {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                  </button>
                </div>

                {/* Expanded detail */}
                {expanded && <ExpandedRow reel={r} />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StatCell({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <div className="flex items-center justify-end gap-1">
      <span style={{ color: "var(--muted-foreground)" }}>{icon}</span>
      <span className="text-xs tabular-nums font-medium" style={{ color: "var(--foreground)" }}>{value}</span>
    </div>
  );
}
