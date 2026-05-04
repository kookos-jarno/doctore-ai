import type { ReactNode } from "react";

export function MetricCard({ label, value, helper, icon }: { label: string; value: string; helper?: string; icon?: ReactNode }) {
  return (
    <div className="terminal-card rounded-2xl p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="metric-label">{label}</span>
        {icon ? <div className="text-terminal-accent">{icon}</div> : null}
      </div>
      <div className="text-3xl font-semibold tracking-tight text-white">{value}</div>
      {helper ? <p className="mt-2 text-sm leading-6 text-white/55">{helper}</p> : null}
    </div>
  );
}
