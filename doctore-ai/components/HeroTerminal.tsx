import Link from "next/link";
import { ArrowRight, Radar, ShieldCheck, Zap } from "lucide-react";

export function HeroTerminal() {
  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
      <div className="flex flex-col justify-center">
        <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-terminal-accent/30 bg-terminal-accent/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-terminal-accent">
          <span className="h-2 w-2 rounded-full bg-terminal-accent" /> System initialized
        </div>
        <h1 className="max-w-4xl text-5xl font-black tracking-tight text-white md:text-7xl">
          Stop guessing. <span className="gradient-text">Start scaling.</span>
        </h1>
        <p className="mt-7 max-w-2xl text-lg leading-8 text-white/66">
          Institutional-grade positive EV discovery, fractional Kelly staking, and real-time market monitoring for disciplined sports betting execution.
        </p>
        <p className="mt-5 font-mono text-base font-semibold text-white">We find the edge. You execute the strategy.</p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 rounded-full bg-terminal-accent px-6 py-3 text-sm font-bold text-terminal-950 transition hover:bg-terminal-cyan">
            Open dashboard <ArrowRight size={16} />
          </Link>
          <Link href="/api-docs" className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white/78 transition hover:border-terminal-accent/50 hover:text-terminal-accent">
            View API docs
          </Link>
        </div>
      </div>
      <div className="terminal-card rounded-3xl p-5 shadow-glow">
        <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <div className="text-sm font-semibold text-white">Live edge feed</div>
            <div className="text-xs text-white/45">Model probability vs market-implied probability</div>
          </div>
          <div className="rounded-full border border-terminal-accent/30 bg-terminal-accent/10 px-3 py-1 text-xs font-semibold text-terminal-accent">LIVE</div>
        </div>
        <div className="space-y-3">
          {[
            ["MLB", "NYY moneyline", "+4.8% EV", "ACT"],
            ["NBA", "DAL spread -2.5", "+2.1% EV", "WATCH"],
            ["NHL", "TOR total over", "-0.6% EV", "PASS"]
          ].map(([league, market, ev, status]) => (
            <div key={market} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.2em] text-terminal-cyan">{league}</div>
                  <div className="mt-1 text-lg font-semibold text-white">{market}</div>
                </div>
                <div className={status === "ACT" ? "text-terminal-accent" : status === "WATCH" ? "text-terminal-cyan" : "text-white/35"}>{status}</div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                <div className="rounded-xl bg-black/20 p-3"><div className="text-white/45">EV</div><div className="font-semibold text-white">{ev}</div></div>
                <div className="rounded-xl bg-black/20 p-3"><div className="text-white/45">Kelly</div><div className="font-semibold text-white">0.74%</div></div>
                <div className="rounded-xl bg-black/20 p-3"><div className="text-white/45">Stake</div><div className="font-semibold text-white">€74</div></div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 grid grid-cols-3 gap-3 text-xs text-white/52">
          <div className="flex items-center gap-2"><Radar size={14} className="text-terminal-accent" /> EV scan</div>
          <div className="flex items-center gap-2"><ShieldCheck size={14} className="text-terminal-accent" /> Risk cap</div>
          <div className="flex items-center gap-2"><Zap size={14} className="text-terminal-accent" /> Real-time</div>
        </div>
      </div>
    </section>
  );
}
