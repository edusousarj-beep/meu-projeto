import { Eye, Heart, UserPlus, Bookmark, TrendingUp, Flame } from "lucide-react";

const stats = [
  { label: "Views esta semana", value: "284K", delta: "+12%", icon: Eye, color: "#c96a3a" },
  { label: "Likes totais", value: "18.4K", delta: "+8%", icon: Heart, color: "#e05b7a" },
  { label: "Novos seguidores", value: "1.2K", delta: "+23%", icon: UserPlus, color: "#5b9de0" },
  { label: "Saves (IG)", value: "3.7K", delta: "+31%", icon: Bookmark, color: "#7b6ce0" },
];

const heaters = [
  { title: "3 hábitos que mudaram meu negócio em 30 dias", views: "94K", saves: "1.1K", follows: "380", plat: "IG Reels" },
  { title: "Por que 99% dos criadores falham na monetização", views: "71K", saves: "820", follows: "290", plat: "IG Reels" },
  { title: "O segredo do algoritmo que ninguém te conta", views: "56K", saves: "610", follows: "210", plat: "IG Reels" },
  { title: "Como eu cresci 10K seguidores em uma semana", views: "48K", saves: "540", follows: "185", plat: "TikTok" },
];

const upcoming = [
  { date: "Ter 02/07", title: "Hook: dor do criador iniciante", status: "rascunho" },
  { date: "Qui 04/07", title: "Reel: comparação de nichos", status: "agendado" },
  { date: "Sáb 06/07", title: "Carrossel: monetização no IG", status: "ideia" },
];

const statusColor: Record<string, string> = {
  rascunho: "#c96a3a",
  agendado: "#4ade80",
  ideia: "#8a8a82",
};

export default function OverviewPage() {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
          Overview
        </h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--muted-foreground)" }}>
          Semana de 24–30 jun 2026 · dados mockados
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(({ label, value, delta, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-xl p-4 border"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>{label}</span>
              <Icon size={15} style={{ color }} />
            </div>
            <p className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>{value}</p>
            <p className="text-xs mt-1 font-medium" style={{ color: "#4ade80" }}>{delta} vs semana ant.</p>
          </div>
        ))}
      </div>

      {/* Heaters + upcoming */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* Heaters table */}
        <div className="lg:col-span-2 rounded-xl border overflow-hidden"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <div className="flex items-center gap-2 px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
            <Flame size={15} style={{ color: "var(--primary)" }} />
            <h2 className="text-sm font-semibold">Heaters da semana</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ color: "var(--muted-foreground)" }}>
                <th className="px-5 py-3 text-left font-medium text-xs">Conteúdo</th>
                <th className="px-3 py-3 text-right font-medium text-xs">Views</th>
                <th className="px-3 py-3 text-right font-medium text-xs">Saves</th>
                <th className="px-5 py-3 text-right font-medium text-xs">Follows</th>
              </tr>
            </thead>
            <tbody>
              {heaters.map((h, i) => (
                <tr key={i} className="border-t" style={{ borderColor: "var(--border)" }}>
                  <td className="px-5 py-3">
                    <p className="font-medium leading-snug" style={{ color: "var(--foreground)" }}>{h.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>{h.plat}</p>
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums" style={{ color: "var(--foreground)" }}>{h.views}</td>
                  <td className="px-3 py-3 text-right tabular-nums" style={{ color: "var(--foreground)" }}>{h.saves}</td>
                  <td className="px-5 py-3 text-right tabular-nums" style={{ color: "var(--foreground)" }}>{h.follows}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Upcoming */}
        <div className="rounded-xl border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <div className="flex items-center gap-2 px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
            <TrendingUp size={15} style={{ color: "var(--primary)" }} />
            <h2 className="text-sm font-semibold">Próximos posts</h2>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {upcoming.map((u, i) => (
              <div key={i} className="px-5 py-3.5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono" style={{ color: "var(--muted-foreground)" }}>{u.date}</span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: statusColor[u.status] + "22", color: statusColor[u.status] }}
                  >
                    {u.status}
                  </span>
                </div>
                <p className="text-sm leading-snug" style={{ color: "var(--foreground)" }}>{u.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
