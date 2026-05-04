import { Activity, Gauge, ShieldCheck, Zap } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { SignalFeed } from "@/components/SignalFeed";

export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="metric-label">Terminal</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-white">Edge discovery dashboard</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/56">Positive EV signals are ranked by expected value, edge, confidence and stake recommendation.</p>
        </div>
        <div className="rounded-full border border-terminal-accent/30 bg-terminal-accent/10 px-4 py-2 text-sm font-semibold text-terminal-accent">LIVE SIGNALS</div>
      </div>
      <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Engine" value="Online" helper="Kelly + EV calculation API" icon={<Activity size={18} />} />
        <MetricCard label="Latency target" value="<50ms" helper="Edge runtime for pure calculations" icon={<Zap size={18} />} />
        <MetricCard label="Risk mode" value="0.25 Kelly" helper="Default fractional stake sizing" icon={<ShieldCheck size={18} />} />
        <MetricCard label="Threshold" value="+3% EV" helper="Default ACT signal cutoff" icon={<Gauge size={18} />} />
      </div>
      <SignalFeed />
    </main>
  );
}
