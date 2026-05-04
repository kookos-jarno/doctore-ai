"use client";

import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import type { SignalDTO } from "@/lib/types";

type State = {
  loading: boolean;
  error: string | null;
  signals: SignalDTO[];
};

export function SignalFeed() {
  const [state, setState] = useState<State>({ loading: true, error: null, signals: [] });

  async function load() {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await fetch("/api/signals?limit=30", { cache: "no-store" });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error ?? "Failed to load signals");
      setState({ loading: false, error: null, signals: json.signals });
    } catch (error) {
      setState({ loading: false, error: error instanceof Error ? error.message : "Failed to load signals", signals: [] });
    }
  }

  useEffect(() => {
    load();
    const interval = window.setInterval(load, 8000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="terminal-card rounded-3xl p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Real-time edge feed</h2>
          <p className="text-sm text-white/52">Polls every 8 seconds. Replace with Supabase Realtime when auth is connected.</p>
        </div>
        <button onClick={load} className="rounded-full border border-white/10 p-3 text-white/60 transition hover:border-terminal-accent/40 hover:text-terminal-accent">
          <RefreshCw size={16} className={state.loading ? "animate-spin" : ""} />
        </button>
      </div>

      {state.error ? <div className="rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">{state.error}</div> : null}

      <div className="overflow-hidden rounded-2xl border border-white/10">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.18em] text-white/48">
            <tr>
              <th className="px-4 py-3">Event</th>
              <th className="px-4 py-3">Selection</th>
              <th className="px-4 py-3">Book</th>
              <th className="px-4 py-3">Odds</th>
              <th className="px-4 py-3">EV</th>
              <th className="px-4 py-3">Edge</th>
              <th className="px-4 py-3">Stake</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {state.loading && state.signals.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-10 text-center text-white/42">Loading signals...</td></tr>
            ) : state.signals.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-10 text-center text-white/42">No signals yet. Run seed or ingest odds via API.</td></tr>
            ) : (
              state.signals.map((signal) => (
                <tr key={signal.id} className="transition hover:bg-white/[0.03]">
                  <td className="px-4 py-4"><div className="font-semibold text-white">{signal.eventName}</div><div className="text-xs text-white/42">{signal.sport} · {signal.league}</div></td>
                  <td className="px-4 py-4 text-white/72">{signal.selection}</td>
                  <td className="px-4 py-4 text-white/72">{signal.book}</td>
                  <td className="px-4 py-4 text-white/72">{signal.oddsDecimal.toFixed(2)}</td>
                  <td className="px-4 py-4 font-semibold text-terminal-accent">{signal.expectedValuePct.toFixed(2)}%</td>
                  <td className="px-4 py-4 text-terminal-cyan">{signal.edgePct.toFixed(2)}%</td>
                  <td className="px-4 py-4 text-white">€{signal.recommendedStake.toFixed(2)}</td>
                  <td className="px-4 py-4"><span className={badgeClass(signal.status)}>{signal.status}</span></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function badgeClass(status: string) {
  const base = "rounded-full px-3 py-1 text-xs font-bold";
  if (status === "ACT") return `${base} bg-terminal-accent/15 text-terminal-accent`;
  if (status === "WATCH") return `${base} bg-terminal-cyan/15 text-terminal-cyan`;
  return `${base} bg-white/10 text-white/42`;
}
