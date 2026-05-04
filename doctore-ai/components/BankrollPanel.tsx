"use client";

import { useEffect, useState } from "react";
import { Landmark } from "lucide-react";

type Bankroll = {
  id: string;
  name: string;
  currency: string;
  startingAmount: number;
  currentAmount: number;
  kellyFraction: number;
  maxStakePct: number;
  totalStaked: number;
  settledPnL: number;
  pendingExposure: number;
  betCount: number;
};

export function BankrollPanel() {
  const [bankroll, setBankroll] = useState<Bankroll | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      const response = await fetch("/api/bankroll", { cache: "no-store" });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error ?? "Failed to load bankroll");
      setBankroll(json.bankroll);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load bankroll");
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (error) {
    return <div className="rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">{error}</div>;
  }

  if (!bankroll) {
    return <div className="terminal-card rounded-3xl p-8 text-white/52">Loading bankroll...</div>;
  }

  const roi = bankroll.totalStaked > 0 ? (bankroll.settledPnL / bankroll.totalStaked) * 100 : 0;
  const drawdown = ((bankroll.startingAmount - bankroll.currentAmount) / bankroll.startingAmount) * 100;

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="terminal-card rounded-3xl p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl border border-terminal-accent/30 bg-terminal-accent/10 p-3 text-terminal-accent"><Landmark size={20} /></div>
          <div>
            <h2 className="text-xl font-semibold text-white">{bankroll.name}</h2>
            <p className="text-sm text-white/52">Risk-controlled bankroll allocation.</p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Stat label="Current bankroll" value={`€${bankroll.currentAmount.toFixed(2)}`} />
          <Stat label="Starting bankroll" value={`€${bankroll.startingAmount.toFixed(2)}`} />
          <Stat label="Kelly fraction" value={`${(bankroll.kellyFraction * 100).toFixed(0)}%`} />
          <Stat label="Max stake cap" value={`${bankroll.maxStakePct.toFixed(2)}%`} />
          <Stat label="Pending exposure" value={`€${bankroll.pendingExposure.toFixed(2)}`} />
          <Stat label="Bets logged" value={String(bankroll.betCount)} />
        </div>
      </div>
      <div className="terminal-card rounded-3xl p-6">
        <h2 className="text-xl font-semibold text-white">Performance controls</h2>
        <p className="mt-2 text-sm text-white/52">The objective is controlled exposure, not maximum theoretical aggression.</p>
        <div className="mt-6 space-y-5">
          <Bar label="ROI on settled stake" value={roi} suffix="%" max={25} />
          <Bar label="Drawdown from start" value={Math.max(0, drawdown)} suffix="%" max={40} />
          <Bar label="Pending exposure ratio" value={(bankroll.pendingExposure / bankroll.currentAmount) * 100} suffix="%" max={25} />
        </div>
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm leading-6 text-white/62">
          Hard cap prevents a mathematically positive signal from becoming an oversized position. Fractional Kelly protects against model error and variance clustering.
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/15 p-4">
      <div className="metric-label">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-white">{value}</div>
    </div>
  );
}

function Bar({ label, value, suffix, max }: { label: string; value: number; suffix: string; max: number }) {
  const width = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-white/64">{label}</span>
        <span className="font-semibold text-white">{value.toFixed(2)}{suffix}</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-terminal-accent" style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}
