"use client";

import { useEffect, useRef } from "react";
import { X, Copy, Check, Clock, FileText } from "lucide-react";
import { useState } from "react";
import { PlatformChip } from "@/components/agendador/platform-chip";
import {
  fmtFullDate, fmtTime, STATUS_STYLE,
  type CalendarPost,
} from "@/lib/data/calendario";

interface Props {
  post: CalendarPost | null;
  onClose: () => void;
}

export function SidePanel({ post, onClose }: Props) {
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [tab, setTab] = useState<"roteiro" | "legenda">("roteiro");
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Scroll to top on new post
  useEffect(() => {
    if (post && panelRef.current) panelRef.current.scrollTop = 0;
    setTab("roteiro");
  }, [post?.id]);

  function copy(text: string, which: "caption" | "script") {
    navigator.clipboard.writeText(text);
    if (which === "caption") {
      setCopiedCaption(true);
      setTimeout(() => setCopiedCaption(false), 2000);
    } else {
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2000);
    }
  }

  // Slide-in animation via inline style
  const visible = !!post;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-30 transition-opacity duration-200"
        style={{
          background: "rgba(0,0,0,0.5)",
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? "auto" : "none",
        }}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className="fixed top-0 right-0 z-40 h-full w-full max-w-md overflow-y-auto flex flex-col border-l shadow-2xl transition-transform duration-300"
        style={{
          background: "var(--card)",
          borderColor: "var(--border)",
          transform: visible ? "translateX(0)" : "translateX(100%)",
        }}
      >
        {post && (
          <>
            {/* Header */}
            <div
              className="sticky top-0 z-10 px-5 py-4 border-b flex items-start justify-between gap-4"
              style={{ background: "var(--card)", borderColor: "var(--border)" }}
            >
              <div className="min-w-0 space-y-2">
                {/* Status + time */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                    style={{
                      background: STATUS_STYLE[post.status].bg,
                      color: STATUS_STYLE[post.status].dot,
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: STATUS_STYLE[post.status].dot }}
                    />
                    {post.status}
                  </span>
                  <span className="flex items-center gap-1 text-xs" style={{ color: "var(--muted-foreground)" }}>
                    <Clock size={11} />
                    {fmtTime(post.scheduledAt)}
                  </span>
                </div>

                {/* Full date */}
                <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                  {fmtFullDate(post.scheduledAt)}
                </p>

                {/* Platforms */}
                <div className="flex flex-wrap gap-1.5">
                  {post.platforms.map((p) => (
                    <PlatformChip key={p} platform={p} selected size="sm" />
                  ))}
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg shrink-0 transition-colors hover:bg-white/5"
                style={{ color: "var(--muted-foreground)" }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Hook */}
            <div className="px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2"
                style={{ color: "var(--muted-foreground)" }}>
                Hook
              </p>
              <p
                className="text-sm font-medium leading-relaxed border-l-2 pl-3"
                style={{ color: "var(--foreground)", borderLeftColor: "var(--primary)" }}
              >
                &ldquo;{post.hook}&rdquo;
              </p>
            </div>

            {/* Angle + CTA */}
            <div className="px-5 py-3 border-b flex gap-4" style={{ borderColor: "var(--border)" }}>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-1"
                  style={{ color: "var(--muted-foreground)" }}>Ângulo</p>
                <p className="text-xs" style={{ color: "var(--foreground)" }}>{post.angle}</p>
              </div>
              <div className="w-px" style={{ background: "var(--border)" }} />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-1"
                  style={{ color: "var(--muted-foreground)" }}>CTA</p>
                <p className="text-xs" style={{ color: "var(--foreground)" }}>{post.cta}</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="px-5 pt-4 flex gap-1">
              {(["roteiro", "legenda"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-all"
                  style={
                    tab === t
                      ? { background: "var(--primary)", color: "#fff" }
                      : { background: "var(--muted)", color: "var(--muted-foreground)" }
                  }
                >
                  <FileText size={12} />
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="flex-1 px-5 py-4">
              {tab === "roteiro" ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "var(--muted-foreground)" }}>
                      Roteiro completo
                    </p>
                    <button
                      onClick={() => copy(post.script, "script")}
                      className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border transition-colors hover:bg-white/5"
                      style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}
                    >
                      {copiedScript ? <Check size={11} /> : <Copy size={11} />}
                      {copiedScript ? "Copiado" : "Copiar"}
                    </button>
                  </div>
                  <pre
                    className="text-xs leading-relaxed whitespace-pre-wrap rounded-xl p-4 border"
                    style={{
                      background: "var(--muted)",
                      borderColor: "var(--border)",
                      color: "var(--foreground)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {post.script}
                  </pre>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "var(--muted-foreground)" }}>
                      Legenda · {post.caption.length} chars
                    </p>
                    <button
                      onClick={() => copy(post.caption, "caption")}
                      className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border transition-colors hover:bg-white/5"
                      style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}
                    >
                      {copiedCaption ? <Check size={11} /> : <Copy size={11} />}
                      {copiedCaption ? "Copiado" : "Copiar"}
                    </button>
                  </div>
                  <p
                    className="text-sm leading-relaxed whitespace-pre-line rounded-xl p-4 border"
                    style={{
                      background: "var(--muted)",
                      borderColor: "var(--border)",
                      color: "var(--foreground)",
                    }}
                  >
                    {post.caption}
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
