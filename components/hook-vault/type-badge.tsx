import { cn } from "@/lib/utils";
import type { HookType } from "@/lib/data/hooks";

const palette: Record<HookType, { bg: string; text: string }> = {
  Contraste:   { bg: "#c96a3a22", text: "#c96a3a" },
  Lista:       { bg: "#5b9de022", text: "#5b9de0" },
  Imperativo:  { bg: "#e05b7a22", text: "#e05b7a" },
  Curiosidade: { bg: "#e0c45b22", text: "#c9a83a" },
  Número:      { bg: "#7b6ce022", text: "#a08de0" },
  Identidade:  { bg: "#4ade8022", text: "#4ade80" },
  Medo:        { bg: "#e07b5b22", text: "#e09a5b" },
};

export function TypeBadge({ type, className }: { type: HookType; className?: string }) {
  const { bg, text } = palette[type];
  return (
    <span
      className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap", className)}
      style={{ background: bg, color: text }}
    >
      {type}
    </span>
  );
}
