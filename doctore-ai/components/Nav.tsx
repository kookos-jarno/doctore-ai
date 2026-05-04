import Link from "next/link";
import { Activity, BarChart3, DatabaseZap, Gauge, ShieldCheck } from "lucide-react";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/kelly", label: "Kelly" },
  { href: "/bankroll", label: "Bankroll" },
  { href: "/pricing", label: "Pricing" },
  { href: "/api-docs", label: "API" }
];

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-terminal-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-terminal-accent/40 bg-terminal-accent/10 text-terminal-accent shadow-glow">
            <Activity size={20} />
          </div>
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.28em] text-white">Doctore AI</div>
            <div className="text-xs text-white/50">Quant terminal</div>
          </div>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm text-white/62 transition hover:text-terminal-accent">
              {link.label}
            </Link>
          ))}
        </nav>
        <Link href="/dashboard" className="rounded-full border border-terminal-accent/40 px-4 py-2 text-sm font-medium text-terminal-accent transition hover:bg-terminal-accent/10">
          Launch terminal
        </Link>
      </div>
    </header>
  );
}

export const ProductIcons = { Gauge, DatabaseZap, ShieldCheck, BarChart3 };
