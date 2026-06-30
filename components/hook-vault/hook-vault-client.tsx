"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, Bookmark, Eye, ArrowUpDown, X } from "lucide-react";
import { hooks, hookTypes, nichos, formatViews } from "@/lib/data/hooks";
import type { Hook, HookType, Nicho } from "@/lib/data/hooks";
import { TypeBadge } from "./type-badge";
import { UseHookModal } from "./use-hook-modal";

type SortKey = "views" | "saves" | "savedAt";

export function HookVaultClient() {
  const [query, setQuery] = useState("");
  const [selectedType, setSelectedType] = useState<HookType | "">("");
  const [selectedNicho, setSelectedNicho] = useState<Nicho | "">("");
  const [minViews, setMinViews] = useState<number>(0);
  const [sortBy, setSortBy] = useState<SortKey>("views");
  const [activeHook, setActiveHook] = useState<Hook | null>(null);
  const [expandedTemplate, setExpandedTemplate] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return hooks
      .filter((h) => {
        const q = query.toLowerCase();
        const matchQuery =
          !q ||
          h.hook.toLowerCase().includes(q) ||
          h.creator.toLowerCase().includes(q) ||
          h.template.toLowerCase().includes(q);
        const matchType = !selectedType || h.type === selectedType;
        const matchNicho = !selectedNicho || h.nicho === selectedNicho;
        const matchViews = h.views >= minViews;
        return matchQuery && matchType && matchNicho && matchViews;
      })
      .sort((a, b) => {
        if (sortBy === "savedAt") return b.savedAt.localeCompare(a.savedAt);
        return b[sortBy] - a[sortBy];
      });
  }, [query, selectedType, selectedNicho, minViews, sortBy]);

  const hasFilters = query || selectedType || selectedNicho || minViews > 0;

  function clearFilters() {
    setQuery("");
    setSelectedType("");
    setSelectedNicho("");
    setMinViews(0);
  }

  return (
    <>
      <div className="p-6 max-w-6xl mx-auto space-y-6">

        {/* Page header */}
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
              Hook Vault
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "var(--muted-foreground)" }}>
              {hooks.length} hooks salvos · {filtered.length} exibidos
            </p>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <ArrowUpDown size={13} style={{ color: "var(--muted-foreground)" }} />
            <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>Ordenar por</span>
            {(["views", "saves", "savedAt"] as SortKey[]).map((k) => (
              <button
                key={k}
                onClick={() => setSortBy(k)}
                className="px-3 py-1.5 rounded-lg text-xs border transition-colors"
                style={
                  sortBy === k
                    ? { background: "var(--primary)", color: "#fff", borderColor: "var(--primary)" }
                    : { background: "transparent", color: "var(--muted-foreground)", borderColor: "var(--border)" }
                }
              >
                {k === "savedAt" ? "Recentes" : k === "views" ? "Views" : "Saves"}
              </button>
            ))}
          </div>
        </div>

        {/* Filters bar */}
        <div
          className="rounded-xl border p-4 space-y-4"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}
        >
          <div className="flex items-center gap-3 flex-wrap">
            <SlidersHorizontal size={14} style={{ color: "var(--primary)" }} />
            <span className="text-xs font-medium" style={{ color: "var(--foreground)" }}>Filtros</span>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full transition-colors hover:bg-white/5"
                style={{ color: "var(--muted-foreground)" }}
              >
                <X size={11} /> Limpar
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {/* Search */}
            <div className="relative col-span-1 sm:col-span-2 lg:col-span-1">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted-foreground)" }} />
              <input
                type="text"
                placeholder="Buscar hook ou criador..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-lg text-sm border outline-none transition-colors"
                style={{
                  background: "var(--muted)",
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
              />
            </div>

            {/* Tipo */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as HookType | "")}
              className="px-3 py-2 rounded-lg text-sm border outline-none"
              style={{
                background: "var(--muted)",
                borderColor: selectedType ? "var(--primary)" : "var(--border)",
                color: selectedType ? "var(--foreground)" : "var(--muted-foreground)",
              }}
            >
              <option value="">Tipo de hook</option>
              {hookTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            {/* Nicho */}
            <select
              value={selectedNicho}
              onChange={(e) => setSelectedNicho(e.target.value as Nicho | "")}
              className="px-3 py-2 rounded-lg text-sm border outline-none"
              style={{
                background: "var(--muted)",
                borderColor: selectedNicho ? "var(--primary)" : "var(--border)",
                color: selectedNicho ? "var(--foreground)" : "var(--muted-foreground)",
              }}
            >
              <option value="">Nicho</option>
              {nichos.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>

            {/* Views mínimas */}
            <select
              value={minViews}
              onChange={(e) => setMinViews(Number(e.target.value))}
              className="px-3 py-2 rounded-lg text-sm border outline-none"
              style={{
                background: "var(--muted)",
                borderColor: minViews > 0 ? "var(--primary)" : "var(--border)",
                color: minViews > 0 ? "var(--foreground)" : "var(--muted-foreground)",
              }}
            >
              <option value={0}>Mín. views</option>
              <option value={1_000_000}>1M+</option>
              <option value={3_000_000}>3M+</option>
              <option value={5_000_000}>5M+</option>
              <option value={7_000_000}>7M+</option>
            </select>
          </div>
        </div>

        {/* Type pills quick filter */}
        <div className="flex gap-2 flex-wrap">
          {hookTypes.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(selectedType === t ? "" : t)}
              className="px-3 py-1 rounded-full text-xs border transition-all"
              style={
                selectedType === t
                  ? { background: "var(--primary)", color: "#fff", borderColor: "var(--primary)" }
                  : { background: "transparent", color: "var(--muted-foreground)", borderColor: "var(--border)" }
              }
            >
              {t}
            </button>
          ))}
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-2">
            <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Nenhum hook encontrado</p>
            <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>Tenta ajustar os filtros</p>
          </div>
        ) : (
          <div
            className="rounded-xl border overflow-hidden"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}
          >
            {filtered.map((h, i) => (
              <div
                key={h.id}
                className="border-b last:border-b-0 px-5 py-4 transition-colors hover:bg-white/[0.02]"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="flex items-start gap-4">

                  {/* Index */}
                  <span
                    className="mt-0.5 text-xs tabular-nums w-5 shrink-0 text-right"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {i + 1}
                  </span>

                  {/* Main content */}
                  <div className="flex-1 min-w-0 space-y-2">
                    {/* Hook text */}
                    <p className="text-sm font-medium leading-snug" style={{ color: "var(--foreground)" }}>
                      &ldquo;{h.hook}&rdquo;
                    </p>

                    {/* Template (expandable) */}
                    <div>
                      <button
                        onClick={() => setExpandedTemplate(expandedTemplate === h.id ? null : h.id)}
                        className="text-xs transition-colors hover:opacity-80"
                        style={{ color: "var(--primary)" }}
                      >
                        {expandedTemplate === h.id ? "▲ ocultar template" : "▼ ver template"}
                      </button>
                      {expandedTemplate === h.id && (
                        <div
                          className="mt-2 rounded-lg px-3 py-2 font-mono text-xs leading-relaxed border-l-2"
                          style={{
                            background: "var(--muted)",
                            borderLeftColor: "var(--primary)",
                            color: "var(--muted-foreground)",
                          }}
                        >
                          {h.template}
                        </div>
                      )}
                    </div>

                    {/* Meta row */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <TypeBadge type={h.type} />
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}
                      >
                        {h.nicho}
                      </span>
                      <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                        {h.creator}
                      </span>
                      <span className="text-xs font-mono" style={{ color: "var(--muted-foreground)" }}>
                        {h.handle}
                      </span>
                    </div>
                  </div>

                  {/* Stats + action */}
                  <div className="flex flex-col items-end gap-3 shrink-0">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Eye size={11} style={{ color: "var(--muted-foreground)" }} />
                        <span className="text-xs tabular-nums font-medium" style={{ color: "var(--foreground)" }}>
                          {formatViews(h.views)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bookmark size={11} style={{ color: "var(--muted-foreground)" }} />
                        <span className="text-xs tabular-nums font-medium" style={{ color: "var(--foreground)" }}>
                          {formatViews(h.saves)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveHook(h)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium transition-opacity hover:opacity-90 whitespace-nowrap"
                      style={{ background: "var(--primary)", color: "#fff" }}
                    >
                      Usar este →
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      <UseHookModal hook={activeHook} onClose={() => setActiveHook(null)} />
    </>
  );
}
