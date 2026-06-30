import { cn } from "@/lib/utils";
import { platformMeta, type Platform } from "@/lib/data/agendador";

interface Props {
  platform: Platform;
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  size?: "sm" | "md";
}

export function PlatformChip({ platform, selected, onClick, disabled, size = "md" }: Props) {
  const meta = platformMeta[platform];
  const isSmall = size === "sm";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex items-center gap-1.5 rounded-lg border transition-all",
        isSmall ? "px-2 py-1 text-xs" : "px-3 py-2 text-sm",
        !onClick && "cursor-default",
        disabled && "opacity-40 cursor-not-allowed"
      )}
      style={
        selected
          ? { background: meta.color + "22", borderColor: meta.color, color: meta.color }
          : { background: "var(--muted)", borderColor: "var(--border)", color: "var(--muted-foreground)" }
      }
    >
      <span className={isSmall ? "text-sm" : "text-base"} style={{ lineHeight: 1 }}>
        {meta.icon}
      </span>
      <span className="font-medium">{meta.label}</span>
      {!meta.connected && (
        <span
          className="text-xs px-1 rounded"
          style={{ background: "var(--muted)", color: "var(--muted-foreground)", fontSize: "0.6rem" }}
        >
          OFF
        </span>
      )}
    </button>
  );
}
