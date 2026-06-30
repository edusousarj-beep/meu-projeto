"use client";

import { useState, useMemo } from "react";
import {
  Zap, BookOpen, SkipForward, RefreshCw, Send, Check,
  Bell, ChevronDown, ChevronUp, ExternalLink, Flame,
  Filter, Clock, Rss,
} from "lucide-react";
import {
  items, sources, sourceMap, topHooks, digestJob,
  TAG_STYLE, fmtAgo,
  type TrendItem, type HookPotential, type SourceType,
} from "@/lib/data/em-alta";

// ── Tag badge ─────────────────────────────────────────────────────────────────

const TAG_ICON: Record<HookPotential, React.ReactNode> = {
  "potencial de hook": <Zap size={10} />,
  "explicar":          <BookOpen size={10} />,
  "pular":             <SkipForward size={10} />,
};

function TagBadge({ tag, showIcon = true }: { tag: HookPotential; showIcon?: boolean }) {
  const s = TAG_STYLE[tag];
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap"
      style={{ background: s.bg, color: s.text, borderColor: s.border }}
    >
      {showIcon && TAG_ICON[tag]}
      {tag}
    </span>
  );
}

// ── Source badge ──────────────────────────────────────────────────────────────

function SourceBadge({ sourceId }: { sourceId: SourceType }) {
  const s = sourceMap[sourceId];
  return (
    <span className="inline-flex items-center gap-1 text-xs" style={{ color: "var(--muted-foreground)" }}>
      <span style={{ fontSize: "0.75rem" }}>{s.icon}</span>
      {s.label}
    </span>
  );
}

// ── Digest panel ──────────────────────────────────────────────────────────────

function DigestPanel() {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [channels, setChannels] = useState(digestJob.channels);

  function toggleChannel(id: string) {
    setChannels((prev) => prev.map((c) => c.id === id ? { ...c, enabled: !c.enabled } : c));
  }

  function sendNow() {
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  }

  const enabledCount = channels.filter((c) => c.enabled).length;

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{ background: "var(--card)", borderColor: "var(--border)" }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 transition-colors hover:bg-white/[0.02]"
      >
        <div className="flex items-center gap-3">
          <Bell size={15} style={{ color: "var(--primary)" }} />
          <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
            Digest matinal
          </span>
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: "var(--primary)" + "22", color: "var(--primary)" }}
          >
            07:00 · {enabledCount} canal{enabledCount !== 1 ? "is" : ""}
          </span>
          <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
            Próximo: {new Date(digestJob.nextSend).toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "2-digit" })} às 07:00
          </span>
        </div>
        {open
          ? <ChevronUp size={14} style={{ color: "var(--muted-foreground)" }} />
          : <ChevronDown size={14} style={{ color: "var(--muted-foreground)" }} />
        }
      </button>

      {open && (
        <div className="border-t" style={{ borderColor: "var(--border)" }}>
          {/* What gets sent */}
          <div
            className="px-5 py-3 text-xs border-b flex items-center gap-2"
            style={{ background: "var(--muted)", borderColor: "var(--border)", color: "var(--muted-foreground)" }}
          >
            <Flame size={11} style={{ color: "var(--primary)" }} />
            Envia os <strong style={{ color: "var(--foreground)" }}>top 5 "potencial de hook"</strong> do dia,
            ordenados por recência, com hook sugerido e fonte.
          </div>

          {/* Channels */}
          <div className="px-5 py-4 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: "var(--muted-foreground)" }}>Canais</p>
            {channels.map((ch) => (
              <label key={ch.id} className="flex items-center gap-3 cursor-pointer group">
                <div
                  onClick={() => toggleChannel(ch.id)}
                  className="w-9 h-5 rounded-full relative transition-colors cursor-pointer flex-shrink-0"
                  style={{ background: ch.enabled ? "var(--primary)" : "var(--muted)" }}
                >
                  <span
                    className="absolute top-0.5 w-4 h-4 rounded-full transition-transform"
                    style={{
                      background: "#fff",
                      left: ch.enabled ? "calc(100% - 1.125rem)" : "0.125rem",
                    }}
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-sm" style={{ color: ch.enabled ? "var(--foreground)" : "var(--muted-foreground)" }}>
                    {ch.label}
                  </p>
                  <p className="text-xs font-mono" style={{ color: "var(--muted-foreground)" }}>
                    {ch.destination}
                  </p>
                </div>
                <span
                  className="ml-auto text-xs px-2 py-0.5 rounded-full"
                  style={
                    ch.type === "slack"
                      ? { background: "#7b6ce022", color: "#a08de0" }
                      : { background: "#5b9de022", color: "#5b9de0" }
                  }
                >
                  {ch.type}
                </span>
              </label>
            ))}
          </div>

          {/* Send now */}
          <div className="px-5 pb-4 flex items-center gap-3">
            <button
              onClick={sendNow}
              disabled={sent || enabledCount === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={
                sent
                  ? { background: "#4ade8022", color: "#4ade80", border: "1px solid #4ade8044" }
                  : enabledCount === 0
                  ? { background: "var(--muted)", color: "var(--muted-foreground)", opacity: 0.5 }
                  : { background: "var(--primary)", color: "#fff" }
              }
            >
              {sent ? <><Check size={14} /> Enviado!</> : <><Send size={14} /> Enviar agora</>}
            </button>
            {digestJob.lastSent && (
              <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                Último envio: {new Date(digestJob.lastSent).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })} às 07:00
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Sources status row ────────────────────────────────────────────────────────

function SourcesRow() {
  const [expanded, setExpanded] = useState(false);
  const totalItems = sources.reduce((a, s) => a + s.itemsFetched, 0);

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{ background: "var(--card)", borderColor: "var(--border)" }}
    >
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-white/[0.02]"
      >
        <Rss size={14} style={{ color: "var(--primary)" }} />
        <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
          Fontes
        </span>
        <span
          className="text-xs px-2 py-0.5 rounded-full"
          style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}
        >
          {sources.length} fontes · {totalItems} itens hoje
        </span>
        <span className="ml-auto" style={{ color: "var(--muted-foreground)" }}>
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </span>
      </button>

      {expanded && (
        <div className="border-t" style={{ borderColor: "var(--border)" }}>
          <div className="grid grid-cols-2 gap-px sm:grid-cols-3 lg:grid-cols-4"
            style={{ background: "var(--border)" }}>
            {sources.map((s) => (
              <div
                key={s.id}
                className="px-4 py-3 space-y-1"
                style={{ background: "var(--card)" }}
              >
                <div className="flex items-center gap-1.5">
                  <span style={{ fontSize: "1rem" }}>{s.icon}</span>
                  <span className="text-xs font-medium truncate" style={{ color: "var(--foreground)" }}>
                    {s.label}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                    {s.itemsFetched} itens
                  </span>
                  <span
                    className="text-xs px-1.5 py-0.5 rounded"
                    style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}
                  >
                    {s.fetchInterval}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={9} style={{ color: "var(--muted-foreground)" }} />
                  <span className="text-xs font-mono" style={{ color: "var(--muted-foreground)" }}>
                    {fmtAgo(s.lastFetched)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Feed item ─────────────────────────────────────────────────────────────────

function FeedItem({
  item,
  rank,
  isTop,
}: {
  item: TrendItem;
  rank?: number;
  isTop?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const [tagOverride, setTagOverride] = useState<HookPotential>(item.tag);

  return (
    <div
      className="rounded-xl border transition-all overflow-hidden"
      style={{
        background: "var(--card)",
        borderColor: tagOverride === "potencial de hook"
          ? "var(--primary)" + "44"
          : tagOverride === "pular"
          ? "var(--border)"
          : "var(--border)",
        opacity: tagOverride === "pular" ? 0.65 : 1,
      }}
    >
      {/* Top accent bar for hooks */}
      {tagOverride === "potencial de hook" && (
        <div className="h-0.5 w-full" style={{ background: "var(--primary)" }} />
      )}

      <div className="p-4 space-y-3">
        {/* Header row */}
        <div className="flex items-start gap-3">
          {/* Rank */}
          {rank !== undefined && (
            <span
              className="mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
              style={{ background: "var(--primary)", color: "#fff" }}
            >
              {rank}
            </span>
          )}

          <div className="flex-1 min-w-0 space-y-1.5">
            {/* Source + time */}
            <div className="flex items-center gap-2 flex-wrap">
              <SourceBadge sourceId={item.source} />
              <span className="text-xs" style={{ color: "var(--border)" }}>·</span>
              <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                {fmtAgo(item.publishedAt)}
              </span>
              {item.engagementSignal && (
                <>
                  <span className="text-xs" style={{ color: "var(--border)" }}>·</span>
                  <span className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>
                    {item.engagementSignal}
                  </span>
                </>
              )}
            </div>

            {/* Title */}
            <p className="text-sm font-semibold leading-snug" style={{ color: "var(--foreground)" }}>
              {item.title}
            </p>

            {/* Summary */}
            <p className="text-xs leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
              {item.summary}
            </p>
          </div>

          {/* Tag badge */}
          <TagBadge tag={tagOverride} />
        </div>

        {/* Hook suggestion (only if potencial de hook) */}
        {tagOverride === "potencial de hook" && item.hookSuggestion && (
          <div
            className="rounded-lg p-3 border-l-2 space-y-1"
            style={{ background: "var(--muted)", borderLeftColor: "var(--primary)" }}
          >
            <p className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "var(--primary)" }}>
              Hook sugerido
            </p>
            <p className="text-sm leading-relaxed italic" style={{ color: "var(--foreground)" }}>
              &ldquo;{item.hookSuggestion}&rdquo;
            </p>
          </div>
        )}

        {/* Nicho tags + actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {item.nicho.map((n) => (
            <span
              key={n}
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}
            >
              {n}
            </span>
          ))}

          <div className="flex items-center gap-1.5 ml-auto">
            {/* Tag override buttons */}
            {(["potencial de hook", "explicar", "pular"] as HookPotential[])
              .filter((t) => t !== tagOverride)
              .map((t) => (
                <button
                  key={t}
                  onClick={() => setTagOverride(t)}
                  className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg border transition-colors hover:bg-white/5"
                  style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}
                  title={`Marcar como "${t}"`}
                >
                  {TAG_ICON[t]}
                </button>
              ))
            }

            {/* Expand */}
            <button
              onClick={() => setExpanded((v) => !v)}
              className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg border transition-colors hover:bg-white/5"
              style={{
                borderColor: expanded ? "var(--primary)" : "var(--border)",
                color: expanded ? "var(--primary)" : "var(--muted-foreground)",
              }}
            >
              {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              {expanded ? "menos" : "por quê"}
            </button>

            {/* External link */}
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg border transition-colors hover:bg-white/5"
              style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}
            >
              <ExternalLink size={11} />
            </a>
          </div>
        </div>

        {/* Expanded: tag reason */}
        {expanded && (
          <div
            className="rounded-lg px-3 py-2.5 text-xs leading-relaxed border"
            style={{ background: "var(--muted)", borderColor: "var(--border)", color: "var(--muted-foreground)" }}
          >
            <span className="font-semibold" style={{ color: "var(--foreground)" }}>
              Por que "{tagOverride}": {" "}
            </span>
            {item.tagReason}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export function EmAltaClient() {
  const [activeTag, setActiveTag] = useState<HookPotential | "todos">("todos");
  const [activeSource, setActiveSource] = useState<SourceType | "todos">("todos");
  const [showTop5Only, setShowTop5Only] = useState(false);

  const filtered = useMemo(() => {
    return items
      .filter((i) => {
        const matchTag = activeTag === "todos" || i.tag === activeTag;
        const matchSource = activeSource === "todos" || i.source === activeSource;
        return matchTag && matchSource;
      })
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }, [activeTag, activeSource]);

  const displayItems = showTop5Only ? topHooks.slice(0, 5) : filtered;

  const counts = useMemo(() => ({
    "potencial de hook": items.filter((i) => i.tag === "potencial de hook").length,
    "explicar":          items.filter((i) => i.tag === "explicar").length,
    "pular":             items.filter((i) => i.tag === "pular").length,
  }), []);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>Em Alta</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--muted-foreground)" }}>
            {sources.length} fontes · {items.length} itens hoje ·{" "}
            <span style={{ color: "var(--primary)" }}>
              {counts["potencial de hook"]} com potencial de hook
            </span>
          </p>
        </div>
        <button
          onClick={() => {}}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs border transition-colors hover:bg-white/5"
          style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}
        >
          <RefreshCw size={13} />
          Atualizar fontes
        </button>
      </div>

      {/* Digest panel */}
      <DigestPanel />

      {/* Sources row */}
      <SourcesRow />

      {/* Top 5 hooks highlight */}
      <div
        className="rounded-xl border px-5 py-4 flex items-center justify-between gap-4"
        style={{ background: "var(--card)", borderColor: "var(--primary)" + "44" }}
      >
        <div className="flex items-center gap-3">
          <Flame size={16} style={{ color: "var(--primary)" }} />
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
              Top 5 potencial de hook
            </p>
            <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
              Os itens com maior potencial de viralizar hoje
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowTop5Only((v) => !v)}
          className="px-4 py-2 rounded-lg text-xs font-medium transition-all border"
          style={
            showTop5Only
              ? { background: "var(--primary)", color: "#fff", borderColor: "var(--primary)" }
              : { background: "transparent", borderColor: "var(--primary)", color: "var(--primary)" }
          }
        >
          {showTop5Only ? "Ver todos" : "Ver só estes"}
        </button>
      </div>

      {/* Filters */}
      {!showTop5Only && (
        <div className="space-y-3">
          {/* Tag filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={13} style={{ color: "var(--muted-foreground)" }} />
            {(["todos", "potencial de hook", "explicar", "pular"] as const).map((t) => {
              const count = t === "todos" ? items.length : counts[t];
              return (
                <button
                  key={t}
                  onClick={() => setActiveTag(t)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-all"
                  style={
                    activeTag === t
                      ? t === "todos"
                        ? { background: "var(--primary)", color: "#fff", borderColor: "var(--primary)" }
                        : { background: TAG_STYLE[t as HookPotential].bg, color: TAG_STYLE[t as HookPotential].text, borderColor: TAG_STYLE[t as HookPotential].border }
                      : { background: "transparent", color: "var(--muted-foreground)", borderColor: "var(--border)" }
                  }
                >
                  {t !== "todos" && TAG_ICON[t as HookPotential]}
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                  <span
                    className="ml-0.5 px-1.5 py-0.5 rounded-full"
                    style={{ background: "rgba(255,255,255,0.1)", fontSize: "0.65rem" }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Source filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={activeSource}
              onChange={(e) => setActiveSource(e.target.value as SourceType | "todos")}
              className="px-3 py-2 rounded-lg text-xs border outline-none"
              style={{
                background: "var(--muted)",
                borderColor: activeSource !== "todos" ? "var(--primary)" : "var(--border)",
                color: activeSource !== "todos" ? "var(--foreground)" : "var(--muted-foreground)",
              }}
            >
              <option value="todos">Todas as fontes</option>
              {sources.map((s) => (
                <option key={s.id} value={s.id}>{s.icon} {s.label}</option>
              ))}
            </select>
            <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
              {filtered.length} item{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      )}

      {/* Feed */}
      <div className="space-y-3">
        {showTop5Only
          ? topHooks.slice(0, 5).map((item, i) => (
              <FeedItem key={item.id} item={item} rank={i + 1} isTop />
            ))
          : displayItems.map((item) => (
              <FeedItem key={item.id} item={item} />
            ))
        }

        {displayItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 space-y-2">
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
              Nenhum item nesta combinação de filtros
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
