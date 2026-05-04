"use client";

import { useMemo, useState } from "react";
import { Calculator, Shield } from "lucide-react";

type Result = {
  impliedProbability: number;
  modelProbability: number;
  edgePct: number;
  expectedValuePct: number;
  fullKellyPct: number;
  fractionalKellyPct: number;
  recommendedStake: number;
  cappedStake: number;
  status: "ACT" | "WATCH" | "PASS";
  reason: string;
};

export function KellyCalculator() {
  const [bankroll, setBankroll] = useState(10000);
  const [oddsDecimal, setOddsDecimal] = useState(2.05);
  const [modelProbability, setModelProbability] = useState(0.51);
  const [kellyFraction, setKellyFraction] = useState(0.25);
  const [maxStakePct, setMaxStakePct] = useState(5);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const payload = useMemo(() => ({ bankroll, oddsDecimal, modelProbability, kellyFraction, maxStakePct }), [bankroll, oddsDecimal, modelProbability, kellyFraction, maxStakePct]);

  async function calculate() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/kelly", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const json = await response.json();
      if (!response.ok) throw new Error(json.error ?? "Calculation failed");
      setResult(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Calculation failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="terminal-card rounded-3xl p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl border border-terminal-accent/30 bg-terminal-accent/10 p-3 text-terminal-accent"><Calculator size={20} /></div>
          <div>
            <h2 className="text-xl font-semibold text-white">Fractional Kelly calculator</h2>
            <p className="text-sm text-white/52">Convert edge into disciplined stake size.</p>
          </div>
        </div>
        <div className="space-y-4">
          <NumberField label="Bankroll (€)" value={bankroll} onChange={setBankroll} step={100} />
          <NumberField label="Decimal odds" value={oddsDecimal} onChange={setOddsDecimal} step={0.01} />
          <NumberField label="Model probability" value={modelProbability} onChange={setModelProbability} step={0.01} />
          <NumberField label="Kelly fraction" value={kellyFraction} onChange={setKellyFraction} step={0.05} />
          <NumberField label="Max stake cap (%)" value={maxStakePct} onChange={setMaxStakePct} step={0.25} />
        </div>
        <button onClick={calculate} disabled={loading} className="mt-6 w-full rounded-full bg-terminal-accent px-5 py-3 text-sm font-bold text-terminal-950 transition hover:bg-terminal-cyan disabled:cursor-not-allowed disabled:opacity-60">
          {loading ? "Calculating..." : "Calculate stake"}
        </button>
        {error ? <p className="mt-4 rounded-xl border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200">{error}</p> : null}
      </div>

      <div className="terminal-card rounded-3xl p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl border border-terminal-cyan/30 bg-terminal-cyan/10 p-3 text-terminal-cyan"><Shield size={20} /></div>
          <div>
            <h2 className="text-xl font-semibold text-white">Execution output</h2>
            <p className="text-sm text-white/52">Positive EV does not eliminate variance. It controls exposure.</p>
          </div>
        </div>
        {result ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-center justify-between">
                <span className="metric-label">Signal</span>
                <span className={result.status === "ACT" ? "text-terminal-accent" : result.status === "WATCH" ? "text-terminal-cyan" : "text-white/40"}>{result.status}</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-white/62">{result.reason}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Output label="Implied probability" value={`${(result.impliedProbability * 100).toFixed(2)}%`} />
              <Output label="Model probability" value={`${(result.modelProbability * 100).toFixed(2)}%`} />
              <Output label="Edge" value={`${result.edgePct.toFixed(2)}%`} />
              <Output label="Expected value" value={`${result.expectedValuePct.toFixed(2)}%`} />
              <Output label="Full Kelly" value={`${result.fullKellyPct.toFixed(2)}%`} />
              <Output label="Fractional Kelly" value={`${result.fractionalKellyPct.toFixed(2)}%`} />
            </div>
            <div className="rounded-2xl border border-terminal-accent/30 bg-terminal-accent/10 p-6">
              <div className="metric-label">Recommended stake after risk cap</div>
              <div className="mt-2 text-4xl font-black text-terminal-accent">€{result.cappedStake.toFixed(2)}</div>
              <p className="mt-2 text-sm text-white/62">Raw recommendation: €{result.recommendedStake.toFixed(2)}</p>
            </div>
          </div>
        ) : (
          <div className="flex min-h-[26rem] items-center justify-center rounded-2xl border border-dashed border-white/12 text-center text-white/45">
            Run calculation to produce stake, EV, edge and pass/watch/act signal.
          </div>
        )}
      </div>
    </div>
  );
}

function NumberField({ label, value, onChange, step }: { label: string; value: number; step: number; onChange: (value: number) => void }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-white/70">{label}</span>
      <input className="terminal-input w-full rounded-xl px-4 py-3" type="number" value={value} step={step} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}

function Output({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/15 p-4">
      <div className="metric-label">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-white">{value}</div>
    </div>
  );
}
