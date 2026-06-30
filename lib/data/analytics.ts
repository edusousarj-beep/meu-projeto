export type MetricKey = "views" | "saves" | "follows" | "dms";

export interface DayPoint {
  date: string; // "YYYY-MM-DD"
  value: number;
}

export interface Reel {
  id: string;
  title: string;
  publishedAt: string;
  views: number;
  saves: number;
  follows: number;
  dms: number;
  thumbnail: string; // emoji placeholder
  heaterNote: string;
}

// ── helpers ─────────────────────────────────────────────────────────────────

function dateStr(daysAgo: number): string {
  const d = new Date("2026-06-30");
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

/** seeded pseudo-random so the build is deterministic */
function seeded(seed: number, min: number, max: number) {
  const x = Math.sin(seed) * 10000;
  return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min;
}

// ── 90-day time series ───────────────────────────────────────────────────────

function buildSeries(
  base: number,
  variance: number,
  spikes: number[] = []
): DayPoint[] {
  return Array.from({ length: 90 }, (_, i) => {
    const daysAgo = 89 - i;
    const trend = 1 + i * 0.004; // slight upward trend
    const noise = seeded(i * 7 + base, -variance, variance);
    const spike = spikes.includes(daysAgo) ? base * seeded(daysAgo, 2, 4) : 0;
    return {
      date: dateStr(daysAgo),
      value: Math.max(0, Math.round(base * trend + noise + spike)),
    };
  });
}

export const series: Record<MetricKey, DayPoint[]> = {
  views:   buildSeries(18_000, 5_000, [3, 12, 27, 41, 68]),
  saves:   buildSeries(420,    120,   [3, 12, 27]),
  follows: buildSeries(85,     30,    [3, 12, 41]),
  dms:     buildSeries(22,     10,    [3, 27]),
};

// ── summary cards ────────────────────────────────────────────────────────────

export interface MetricCard {
  key: MetricKey;
  label: string;
  icon: string;
  color: string;
  total7: number;
  total30: number;
  delta7: number;   // % vs previous 7
  delta30: number;  // % vs previous 30
}

function sum(pts: DayPoint[], from: number, to: number) {
  return pts.slice(from, to).reduce((a, p) => a + p.value, 0);
}

function deltaPct(curr: number, prev: number) {
  if (prev === 0) return 0;
  return Math.round(((curr - prev) / prev) * 100);
}

function buildCard(key: MetricKey, label: string, icon: string, color: string): MetricCard {
  const pts = series[key];
  const t7  = sum(pts, 83, 90);
  const p7  = sum(pts, 76, 83);
  const t30 = sum(pts, 60, 90);
  const p30 = sum(pts, 30, 60);
  return { key, label, icon, color, total7: t7, total30: t30, delta7: deltaPct(t7, p7), delta30: deltaPct(t30, p30) };
}

export const metricCards: MetricCard[] = [
  buildCard("views",   "Views",     "👁",  "#c96a3a"),
  buildCard("saves",   "Saves",     "🔖",  "#7b6ce0"),
  buildCard("follows", "Seguidores","➕",  "#5b9de0"),
  buildCard("dms",     "DMs",       "💬",  "#e05b7a"),
];

// ── reels mock ───────────────────────────────────────────────────────────────

export const reels: Reel[] = [
  {
    id: "r1",
    title: "3 hábitos que mudaram meu negócio em 30 dias",
    publishedAt: dateStr(3),
    views: 94_200, saves: 1_100, follows: 380, dms: 142,
    thumbnail: "🔥",
    heaterNote: "Hook de número + benefício imediato; postado às 19h terça — audiência estava no pico.",
  },
  {
    id: "r2",
    title: "Por que 99% dos criadores falham na monetização",
    publishedAt: dateStr(12),
    views: 71_500, saves: 820, follows: 290, dms: 98,
    thumbnail: "💸",
    heaterNote: "Palavra '99%' cria curiosidade involuntária; CTA de save explícito no segundo 8.",
  },
  {
    id: "r3",
    title: "O segredo do algoritmo que ninguém te conta",
    publishedAt: dateStr(27),
    views: 56_800, saves: 610, follows: 210, dms: 74,
    thumbnail: "🤫",
    heaterNote: "Thumbnail com texto 'PROIBIDO' gerou 3x mais cliques que a média do canal.",
  },
  {
    id: "r4",
    title: "Como eu cresci 10K seguidores em uma semana",
    publishedAt: dateStr(41),
    views: 48_300, saves: 540, follows: 185, dms: 61,
    thumbnail: "📈",
    heaterNote: "Prova social + número específico (10K) no título aumentou retenção nos primeiros 3s.",
  },
  {
    id: "r5",
    title: "Erro que faz você perder seguidores todo dia",
    publishedAt: dateStr(68),
    views: 39_700, saves: 470, follows: 160, dms: 53,
    thumbnail: "⚠️",
    heaterNote: "Gatilho de medo + problema cotidiano; share orgânico veio de grupos de criadores.",
  },
  // remaining reels (below median — not heaters)
  {
    id: "r6",
    title: "Minha rotina de criação de conteúdo",
    publishedAt: dateStr(8),
    views: 12_400, saves: 180, follows: 62, dms: 18,
    thumbnail: "📅",
    heaterNote: "",
  },
  {
    id: "r7",
    title: "Ferramentas que uso para editar no celular",
    publishedAt: dateStr(18),
    views: 9_800, saves: 140, follows: 48, dms: 12,
    thumbnail: "🎬",
    heaterNote: "",
  },
  {
    id: "r8",
    title: "Como organizo minhas ideias de conteúdo",
    publishedAt: dateStr(33),
    views: 14_200, saves: 210, follows: 71, dms: 22,
    thumbnail: "🗂",
    heaterNote: "",
  },
  {
    id: "r9",
    title: "Minha câmera favorita para reels",
    publishedAt: dateStr(50),
    views: 8_600, saves: 95, follows: 35, dms: 9,
    thumbnail: "📷",
    heaterNote: "",
  },
  {
    id: "r10",
    title: "Por que eu parei de usar o Reels scheduler",
    publishedAt: dateStr(60),
    views: 16_300, saves: 230, follows: 82, dms: 28,
    thumbnail: "🚫",
    heaterNote: "",
  },
];

// ── heater logic ─────────────────────────────────────────────────────────────

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

const last30Views = series.views.slice(60).map((p) => p.value);
export const medianViews30 = median(last30Views);

export const heaters = reels
  .filter((r) => r.views >= medianViews30 * 2)
  .sort((a, b) => b.views - a.views)
  .slice(0, 5);

// ── formatters ───────────────────────────────────────────────────────────────

export function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n);
}

export function fmtDate(iso: string): string {
  const [, m, d] = iso.split("-");
  return `${d}/${m}`;
}
