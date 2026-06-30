"use client";

import { useState, useEffect } from "react";
import { X, Copy, Check } from "lucide-react";
import type { Hook } from "@/lib/data/hooks";
import { TypeBadge } from "./type-badge";

interface Props {
  hook: Hook | null;
  onClose: () => void;
}

export function UseHookModal({ hook, onClose }: Props) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!hook) return;
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [hook, onClose]);

  if (!hook) return null;

  function copyTemplate() {
    navigator.clipboard.writeText(hook!.template).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-lg rounded-2xl border p-6 shadow-2xl space-y-5"
        style={{ background: "var(--card)", borderColor: "var(--border)" }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>Usar este hook</p>
            <TypeBadge type={hook.type} />
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg transition-colors hover:bg-white/5"
            style={{ color: "var(--muted-foreground)" }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Hook original */}
        <div className="rounded-xl p-4 space-y-1" style={{ background: "var(--muted)" }}>
          <p className="text-xs font-medium mb-2" style={{ color: "var(--muted-foreground)" }}>
            Hook original · {hook.handle}
          </p>
          <p className="text-sm leading-relaxed font-medium" style={{ color: "var(--foreground)" }}>
            &ldquo;{hook.hook}&rdquo;
          </p>
        </div>

        {/* Template */}
        <div className="space-y-2">
          <p className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>
            Template para adaptar
          </p>
          <div
            className="rounded-xl p-4 border font-mono text-sm leading-relaxed"
            style={{ background: "var(--background)", borderColor: "var(--primary)", color: "var(--foreground)" }}
          >
            {hook.template}
          </div>
        </div>

        {/* Draft area */}
        <div className="space-y-2">
          <p className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>
            Seu rascunho
          </p>
          <textarea
            rows={3}
            placeholder="Adapte o template para o seu nicho aqui..."
            className="w-full rounded-xl p-4 text-sm resize-none outline-none border transition-colors"
            style={{
              background: "var(--muted)",
              borderColor: "var(--border)",
              color: "var(--foreground)",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <button
            onClick={copyTemplate}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm border transition-colors hover:bg-white/5"
            style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copiado!" : "Copiar template"}
          </button>
          <button
            className="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-90"
            style={{ background: "var(--primary)", color: "#fff" }}
            onClick={onClose}
          >
            Salvar no /script →
          </button>
        </div>
      </div>
    </div>
  );
}
