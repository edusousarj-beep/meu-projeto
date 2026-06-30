"use client";

import { useState, useMemo } from "react";
import {
  Sparkles, Send, Clock, CheckCircle2, XCircle, FileText,
  Copy, Check, ChevronDown, ChevronUp, Plug, Info,
} from "lucide-react";
import {
  platforms, savedHooks, angles, ctas, queue as initialQueue,
  generateCaption, fmtSchedule, platformMeta,
  type Platform, type ScheduledPost, type PostStatus,
} from "@/lib/data/agendador";
import { PlatformChip } from "./platform-chip";

// ── Status badge ─────────────────────────────────────────────────────────────

const statusStyle: Record<PostStatus, { bg: string; text: string; icon: React.ReactNode }> = {
  agendado:  { bg: "#c96a3a22", text: "#c96a3a",  icon: <Clock size={11} /> },
  publicado: { bg: "#4ade8022", text: "#4ade80",  icon: <CheckCircle2 size={11} /> },
  falhou:    { bg: "#f8717122", text: "#f87171",  icon: <XCircle size={11} /> },
  rascunho:  { bg: "#8a8a8222", text: "#8a8a82",  icon: <FileText size={11} /> },
};

function StatusBadge({ status }: { status: PostStatus }) {
  const s = statusStyle[status];
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ background: s.bg, color: s.text }}
    >
      {s.icon}{status}
    </span>
  );
}

// ── MCP integration info panel ────────────────────────────────────────────────

function McpPanel() {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{ background: "var(--card)", borderColor: "var(--border)" }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors hover:bg-white/[0.02]"
      >
        <div className="flex items-center gap-2.5">
          <Plug size={15} style={{ color: "var(--primary)" }} />
          <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
            Pontos de integração MCP
          </span>
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: "var(--primary)" + "22", color: "var(--primary)" }}
          >
            3 conectados · 1 pendente
          </span>
        </div>
        {open ? <ChevronUp size={15} style={{ color: "var(--muted-foreground)" }} />
               : <ChevronDown size={15} style={{ color: "var(--muted-foreground)" }} />}
      </button>

      {open && (
        <div className="border-t" style={{ borderColor: "var(--border)" }}>
          <div className="px-5 py-3 flex items-start gap-2 text-xs border-b"
            style={{ background: "var(--muted)", borderColor: "var(--border)", color: "var(--muted-foreground)" }}>
            <Info size={12} className="mt-0.5 shrink-0" style={{ color: "var(--primary)" }} />
            Para publicação real, instale o MCP server correspondente e configure o token de acesso
            nas variáveis de ambiente. O dashboard chamará automaticamente o método listado abaixo.
          </div>
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {platforms.map((p) => (
              <div key={p.id} className="grid px-5 py-4 gap-x-4 items-center"
                style={{ gridTemplateColumns: "9rem 1fr 1fr auto" }}>
                <PlatformChip platform={p.id} selected={p.connected} size="sm" />
                <div>
                  <p className="text-xs font-mono font-medium" style={{ color: "var(--foreground)" }}>
                    {p.mcp}
                  </p>
                  <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>MCP server</p>
                </div>
                <div>
                  <p className="text-xs font-mono" style={{ color: "var(--muted-foreground)" }}>
                    .{p.mcpMethod}
                  </p>
                  <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>método</p>
                </div>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={
                    p.connected
                      ? { background: "#4ade8022", color: "#4ade80" }
                      : { background: "#f8717122", color: "#f87171" }
                  }
                >
                  {p.connected ? "conectado" : "pendente"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Queue item ────────────────────────────────────────────────────────────────

function QueueItem({ post, onRetry }: { post: ScheduledPost; onRetry?: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(post.caption).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="border-b last:border-b-0" style={{ borderColor: "var(--border)" }}>
      <div
        className="px-5 py-4 flex items-start gap-4 transition-colors hover:bg-white/[0.02]"
      >
        {/* Date/time column */}
        <div className="shrink-0 text-center w-16">
          <p className="text-xs font-mono leading-tight" style={{ color: "var(--foreground)" }}>
            {fmtSchedule(post.scheduledAt).split(",")[0]}
          </p>
          <p className="text-xs font-mono mt-0.5" style={{ color: "var(--primary)" }}>
            {fmtSchedule(post.scheduledAt).split(" ").pop()}
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-2">
          <p className="text-sm leading-snug line-clamp-2" style={{ color: "var(--foreground)" }}>
            {post.hook}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge status={post.status} />
            {post.platforms.map((pl) => (
              <PlatformChip key={pl} platform={pl} selected size="sm" />
            ))}
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}
            >
              {post.angle}
            </span>
          </div>

          {/* Via MCP */}
          <div className="flex flex-wrap gap-x-3 gap-y-0.5">
            {post.platforms.map((pl) => post.via[pl] && (
              <span key={pl} className="text-xs font-mono" style={{ color: "var(--muted-foreground)" }}>
                {post.via[pl]}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {post.status === "falhou" && onRetry && (
            <button
              onClick={() => onRetry(post.id)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-opacity hover:opacity-80"
              style={{ background: "#f87171" + "22", color: "#f87171" }}
            >
              Retentar
            </button>
          )}
          <button
            onClick={() => setExpanded((v) => !v)}
            className="p-1.5 rounded-lg transition-colors hover:bg-white/5"
            style={{ color: expanded ? "var(--primary)" : "var(--muted-foreground)" }}
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* Expanded: full caption */}
      {expanded && (
        <div className="px-5 pb-5">
          <div
            className="rounded-xl p-4 space-y-3 border"
            style={{ background: "var(--muted)", borderColor: "var(--border)" }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: "var(--muted-foreground)" }}>Legenda gerada</span>
              <button
                onClick={copy}
                className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border transition-colors hover:bg-white/5"
                style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}
              >
                {copied ? <Check size={11} /> : <Copy size={11} />}
                {copied ? "Copiado" : "Copiar"}
              </button>
            </div>
            <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "var(--foreground)" }}>
              {post.caption}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Scheduling form ───────────────────────────────────────────────────────────

export function AgendadorClient() {
  // Form state
  const [hook, setHook] = useState("");
  const [customHook, setCustomHook] = useState("");
  const [angle, setAngle] = useState("");
  const [cta, setCta] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<Platform>>(new Set(["instagram"]));
  const [schedDate, setSchedDate] = useState("");
  const [schedTime, setSchedTime] = useState("19:00");
  const [caption, setCaption] = useState("");
  const [captionGenerated, setCaptionGenerated] = useState(false);

  // Queue state
  const [queue, setQueue] = useState(initialQueue);
  const [queueFilter, setQueueFilter] = useState<PostStatus | "todos">("todos");
  const [scheduled, setScheduled] = useState(false);

  const effectiveHook = hook === "[Escrever hook manualmente...]" ? customHook : hook;

  // Auto-generate caption
  function handleGenerate() {
    const gen = generateCaption(effectiveHook, angle, cta);
    setCaption(gen);
    setCaptionGenerated(true);
  }

  const canGenerate = effectiveHook && angle && cta;
  const canSchedule = canGenerate && selectedPlatforms.size > 0 && schedDate && caption;

  function togglePlatform(id: Platform) {
    const meta = platformMeta[id];
    if (!meta.connected) return;
    setSelectedPlatforms((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function handleSchedule() {
    if (!canSchedule) return;
    const isoAt = new Date(`${schedDate}T${schedTime}:00`).toISOString();
    const viaRecord = Object.fromEntries(
      platforms.map((p) => [
        p.id,
        selectedPlatforms.has(p.id) ? `${p.mcp} → ${p.mcpMethod}` : "",
      ])
    ) as Record<Platform, string>;

    const newPost: ScheduledPost = {
      id: `p${Date.now()}`,
      hook: effectiveHook,
      angle,
      cta,
      caption,
      platforms: [...selectedPlatforms],
      scheduledAt: isoAt,
      status: "agendado",
      via: viaRecord,
    };

    setQueue((prev) => [newPost, ...prev]);
    setScheduled(true);
    setTimeout(() => {
      setScheduled(false);
      setHook(""); setCustomHook(""); setAngle(""); setCta("");
      setCaption(""); setCaptionGenerated(false);
      setSelectedPlatforms(new Set(["instagram"]));
      setSchedDate(""); setSchedTime("19:00");
    }, 2500);
  }

  function handleRetry(id: string) {
    setQueue((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "agendado" } : p))
    );
  }

  const filteredQueue = useMemo(() =>
    queue.filter((p) => queueFilter === "todos" || p.status === queueFilter)
      .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()),
    [queue, queueFilter]
  );

  const counts = useMemo(() => ({
    agendado:  queue.filter((p) => p.status === "agendado").length,
    publicado: queue.filter((p) => p.status === "publicado").length,
    falhou:    queue.filter((p) => p.status === "falhou").length,
    rascunho:  queue.filter((p) => p.status === "rascunho").length,
  }), [queue]);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>Agendador</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--muted-foreground)" }}>
          Agende reels em múltiplas plataformas com 1 clique · legenda auto-gerada
        </p>
      </div>

      {/* MCP panel */}
      <McpPanel />

      {/* Two-col layout: form + queue */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">

        {/* ── Scheduling form (2/5) ── */}
        <div
          className="lg:col-span-2 rounded-2xl border p-5 space-y-5 self-start"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}
        >
          <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
            Novo agendamento
          </h2>

          {/* Hook select */}
          <Field label="Hook">
            <select
              value={hook}
              onChange={(e) => { setHook(e.target.value); setCaptionGenerated(false); }}
              className="w-full px-3 py-2 rounded-lg text-sm border outline-none"
              style={{ background: "var(--muted)", borderColor: hook ? "var(--primary)" : "var(--border)", color: hook ? "var(--foreground)" : "var(--muted-foreground)" }}
            >
              <option value="">Selecionar hook salvo...</option>
              {savedHooks.map((h) => <option key={h} value={h}>{h}</option>)}
            </select>
            {hook === "[Escrever hook manualmente...]" && (
              <textarea
                rows={2}
                value={customHook}
                onChange={(e) => { setCustomHook(e.target.value); setCaptionGenerated(false); }}
                placeholder="Escreva o hook aqui..."
                className="w-full px-3 py-2 rounded-lg text-sm border outline-none resize-none mt-2"
                style={{ background: "var(--muted)", borderColor: "var(--border)", color: "var(--foreground)" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
              />
            )}
          </Field>

          {/* Angle */}
          <Field label="Ângulo">
            <select
              value={angle}
              onChange={(e) => { setAngle(e.target.value); setCaptionGenerated(false); }}
              className="w-full px-3 py-2 rounded-lg text-sm border outline-none"
              style={{ background: "var(--muted)", borderColor: angle ? "var(--primary)" : "var(--border)", color: angle ? "var(--foreground)" : "var(--muted-foreground)" }}
            >
              <option value="">Selecionar ângulo...</option>
              {angles.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </Field>

          {/* CTA */}
          <Field label="CTA">
            <select
              value={cta}
              onChange={(e) => { setCta(e.target.value); setCaptionGenerated(false); }}
              className="w-full px-3 py-2 rounded-lg text-sm border outline-none"
              style={{ background: "var(--muted)", borderColor: cta ? "var(--primary)" : "var(--border)", color: cta ? "var(--foreground)" : "var(--muted-foreground)" }}
            >
              <option value="">Selecionar CTA...</option>
              {ctas.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>

          {/* Generate caption button */}
          <button
            onClick={handleGenerate}
            disabled={!canGenerate}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all border"
            style={
              canGenerate
                ? { background: "var(--primary)" + "22", borderColor: "var(--primary)", color: "var(--primary)" }
                : { background: "var(--muted)", borderColor: "var(--border)", color: "var(--muted-foreground)", opacity: 0.5 }
            }
          >
            <Sparkles size={14} />
            {captionGenerated ? "Gerar novamente" : "Auto-gerar legenda"}
          </button>

          {/* Caption preview / edit */}
          {caption && (
            <Field label="Legenda gerada">
              <textarea
                rows={5}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm border outline-none resize-none leading-relaxed"
                style={{ background: "var(--muted)", borderColor: "var(--border)", color: "var(--foreground)" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
              />
              <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
                {caption.length} caracteres · editável
              </p>
            </Field>
          )}

          {/* Platforms */}
          <Field label="Plataformas">
            <div className="flex flex-wrap gap-2">
              {platforms.map((p) => (
                <PlatformChip
                  key={p.id}
                  platform={p.id}
                  selected={selectedPlatforms.has(p.id)}
                  onClick={() => togglePlatform(p.id)}
                  disabled={!p.connected}
                />
              ))}
            </div>
            {!platformMeta.youtube.connected && (
              <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
                YouTube marcado como OFF — configure o token para ativar.
              </p>
            )}
          </Field>

          {/* Date + time */}
          <Field label="Data e hora">
            <div className="flex gap-2">
              <input
                type="date"
                value={schedDate}
                onChange={(e) => setSchedDate(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg text-sm border outline-none"
                style={{ background: "var(--muted)", borderColor: schedDate ? "var(--primary)" : "var(--border)", color: "var(--foreground)" }}
              />
              <input
                type="time"
                value={schedTime}
                onChange={(e) => setSchedTime(e.target.value)}
                className="w-28 px-3 py-2 rounded-lg text-sm border outline-none"
                style={{ background: "var(--muted)", borderColor: "var(--border)", color: "var(--foreground)" }}
              />
            </div>
          </Field>

          {/* Via preview */}
          {selectedPlatforms.size > 0 && (
            <div
              className="rounded-xl p-3 space-y-1 border"
              style={{ background: "var(--muted)", borderColor: "var(--border)" }}
            >
              <p className="text-xs font-medium mb-2" style={{ color: "var(--muted-foreground)" }}>
                Publicará via
              </p>
              {[...selectedPlatforms].map((id) => {
                const meta = platformMeta[id];
                return (
                  <div key={id} className="flex items-center gap-2">
                    <span>{meta.icon}</span>
                    <span className="text-xs font-mono" style={{ color: "var(--foreground)" }}>
                      {meta.mcp}
                    </span>
                    <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                      → {meta.mcpMethod}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Schedule button */}
          <button
            onClick={handleSchedule}
            disabled={!canSchedule || scheduled}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all"
            style={
              scheduled
                ? { background: "#4ade80", color: "#0d0d0d" }
                : canSchedule
                ? { background: "var(--primary)", color: "#fff" }
                : { background: "var(--muted)", color: "var(--muted-foreground)", opacity: 0.5 }
            }
          >
            {scheduled
              ? <><CheckCircle2 size={15} /> Agendado!</>
              : <><Send size={14} /> Agendar em 1 clique</>
            }
          </button>
        </div>

        {/* ── Queue (3/5) ── */}
        <div className="lg:col-span-3 space-y-4">
          {/* Filter tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            {(["todos", "agendado", "publicado", "falhou", "rascunho"] as const).map((f) => {
              const count = f === "todos" ? queue.length : counts[f];
              return (
                <button
                  key={f}
                  onClick={() => setQueueFilter(f)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-all"
                  style={
                    queueFilter === f
                      ? { background: "var(--primary)", color: "#fff", borderColor: "var(--primary)" }
                      : { background: "transparent", color: "var(--muted-foreground)", borderColor: "var(--border)" }
                  }
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                  <span
                    className="px-1.5 py-0.5 rounded-full text-xs"
                    style={
                      queueFilter === f
                        ? { background: "rgba(255,255,255,0.25)", color: "#fff" }
                        : { background: "var(--muted)", color: "var(--muted-foreground)" }
                    }
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Queue list */}
          <div
            className="rounded-2xl border overflow-hidden"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}
          >
            {filteredQueue.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-2">
                <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                  Nenhum post nesta categoria
                </p>
              </div>
            ) : (
              filteredQueue.map((post) => (
                <QueueItem key={post.id} post={post} onRetry={handleRetry} />
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

// ── Helper ────────────────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider"
        style={{ color: "var(--muted-foreground)" }}>
        {label}
      </label>
      {children}
    </div>
  );
}
