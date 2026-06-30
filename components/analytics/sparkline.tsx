"use client";

import { useMemo, useState } from "react";
import type { DayPoint } from "@/lib/data/analytics";

interface Props {
  data: DayPoint[];
  color?: string;
  width?: number;
  height?: number;
  window: 7 | 30 | 90;
}

export function Sparkline({ data, color = "#c96a3a", width = 120, height = 36, window }: Props) {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; val: number; date: string } | null>(null);

  const slice = useMemo(() => data.slice(data.length - window), [data, window]);

  const { path, areaPath, points } = useMemo(() => {
    const vals = slice.map((p) => p.value);
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const range = max - min || 1;
    const pad = 3;
    const W = width - pad * 2;
    const H = height - pad * 2;

    const pts = vals.map((v, i) => ({
      x: pad + (i / (vals.length - 1)) * W,
      y: pad + H - ((v - min) / range) * H,
      val: v,
      date: slice[i].date,
    }));

    const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
    const area =
      linePath +
      ` L${pts[pts.length - 1].x.toFixed(1)},${height} L${pts[0].x.toFixed(1)},${height} Z`;

    return { path: linePath, areaPath: area, points: pts };
  }, [slice, width, height]);

  return (
    <div className="relative" style={{ width, height }}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="overflow-visible"
        onMouseLeave={() => setTooltip(null)}
      >
        <defs>
          <linearGradient id={`grad-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Area fill */}
        <path d={areaPath} fill={`url(#grad-${color.replace("#", "")})`} />

        {/* Line */}
        <path d={path} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Hover zones */}
        {points.map((p, i) => (
          <rect
            key={i}
            x={p.x - (120 / points.length) / 2}
            y={0}
            width={120 / points.length}
            height={height}
            fill="transparent"
            onMouseEnter={() => setTooltip({ x: p.x, y: p.y, val: p.val, date: p.date })}
          />
        ))}

        {/* Dot on hover */}
        {tooltip && (
          <>
            <line
              x1={tooltip.x} y1={0} x2={tooltip.x} y2={height}
              stroke={color} strokeWidth="1" strokeDasharray="2,2" strokeOpacity="0.5"
            />
            <circle cx={tooltip.x} cy={tooltip.y} r={3} fill={color} />
          </>
        )}
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute z-10 px-2 py-1 rounded text-xs whitespace-nowrap pointer-events-none shadow-lg border"
          style={{
            background: "var(--card)",
            borderColor: "var(--border)",
            color: "var(--foreground)",
            left: tooltip.x > 80 ? tooltip.x - 90 : tooltip.x + 8,
            top: tooltip.y - 24,
          }}
        >
          <span style={{ color: "var(--muted-foreground)" }}>
            {tooltip.date.slice(5).split("-").reverse().join("/")}
          </span>
          {" · "}
          <span className="font-medium">{tooltip.val.toLocaleString("pt-BR")}</span>
        </div>
      )}
    </div>
  );
}
