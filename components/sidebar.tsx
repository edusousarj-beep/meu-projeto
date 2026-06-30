"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookMarked,
  BarChart2,
  Users,
  CalendarCheck,
  CalendarDays,
  TrendingUp,
  LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/hook-vault", label: "Hook Vault", icon: BookMarked },
  { href: "/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/concorrentes", label: "Concorrentes", icon: Users },
  { href: "/agendador", label: "Agendador", icon: CalendarCheck },
  { href: "/calendario", label: "Calendário", icon: CalendarDays },
  { href: "/em-alta", label: "Em Alta", icon: TrendingUp },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col w-56 shrink-0 h-screen sticky top-0 border-r"
      style={{ background: "var(--sidebar-bg)", borderColor: "var(--sidebar-border)" }}>
      {/* Profile */}
      <div className="px-4 py-5 border-b" style={{ borderColor: "var(--sidebar-border)" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
            style={{ background: "var(--primary)", color: "#fff" }}>
            @
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: "var(--foreground)" }}>
              @seucreator
            </p>
            <p className="text-xs truncate" style={{ color: "var(--muted-foreground)" }}>
              Content Dashboard
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors",
                active
                  ? "font-medium"
                  : "hover:bg-white/5"
              )}
              style={
                active
                  ? { background: "var(--primary)", color: "#fff" }
                  : { color: "var(--muted-foreground)" }
              }
            >
              <Icon size={15} strokeWidth={1.8} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t text-xs" style={{ borderColor: "var(--sidebar-border)", color: "var(--muted-foreground)" }}>
        v0.1 · dados mockados
      </div>
    </aside>
  );
}
