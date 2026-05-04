import type { KellyInput, KellyOutput } from "@/lib/types";

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function round(value: number, decimals = 2): number {
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

export function impliedProbabilityFromDecimalOdds(oddsDecimal: number): number {
  if (!Number.isFinite(oddsDecimal) || oddsDecimal <= 1) {
    throw new Error("Decimal odds must be greater than 1.00");
  }

  return 1 / oddsDecimal;
}

export function expectedValuePct(modelProbability: number, oddsDecimal: number): number {
  validateProbability(modelProbability);
  if (oddsDecimal <= 1) throw new Error("Decimal odds must be greater than 1.00");

  return (modelProbability * oddsDecimal - 1) * 100;
}

export function fullKellyPct(modelProbability: number, oddsDecimal: number): number {
  validateProbability(modelProbability);
  if (oddsDecimal <= 1) throw new Error("Decimal odds must be greater than 1.00");

  const b = oddsDecimal - 1;
  const p = modelProbability;
  const q = 1 - p;
  const kelly = (b * p - q) / b;

  return Math.max(0, kelly * 100);
}

export function calculateKelly(input: KellyInput): KellyOutput {
  const bankroll = input.bankroll;
  const oddsDecimal = input.oddsDecimal;
  const modelProbability = input.modelProbability;
  const kellyFraction = input.kellyFraction ?? 0.25;
  const maxStakePct = input.maxStakePct ?? 5;

  if (!Number.isFinite(bankroll) || bankroll <= 0) throw new Error("Bankroll must be positive");
  if (!Number.isFinite(kellyFraction) || kellyFraction < 0 || kellyFraction > 1) {
    throw new Error("Kelly fraction must be between 0 and 1");
  }
  if (!Number.isFinite(maxStakePct) || maxStakePct <= 0 || maxStakePct > 100) {
    throw new Error("Max stake percentage must be between 0 and 100");
  }

  const impliedProbability = impliedProbabilityFromDecimalOdds(oddsDecimal);
  const edgePct = (modelProbability - impliedProbability) * 100;
  const evPct = expectedValuePct(modelProbability, oddsDecimal);
  const fullKelly = fullKellyPct(modelProbability, oddsDecimal);
  const fractionalKelly = fullKelly * kellyFraction;
  const recommendedStake = bankroll * (fractionalKelly / 100);
  const cap = bankroll * (maxStakePct / 100);
  const cappedStake = Math.min(recommendedStake, cap);

  let status: KellyOutput["status"] = "PASS";
  let reason = "No positive expected value after model-market comparison.";

  if (evPct > 0 && edgePct >= 1 && cappedStake > 0) {
    status = evPct >= 3 && edgePct >= 2 ? "ACT" : "WATCH";
    reason = status === "ACT"
      ? "Positive EV clears execution threshold with disciplined stake sizing."
      : "Positive EV detected, but edge is close to the action threshold.";
  }

  return {
    impliedProbability: round(impliedProbability, 6),
    modelProbability: round(modelProbability, 6),
    edgePct: round(edgePct, 2),
    expectedValuePct: round(evPct, 2),
    fullKellyPct: round(fullKelly, 2),
    fractionalKellyPct: round(fractionalKelly, 2),
    recommendedStake: round(recommendedStake, 2),
    cappedStake: round(cappedStake, 2),
    status,
    reason
  };
}

export function decimalOddsFromAmerican(americanOdds: number): number {
  if (americanOdds > 0) return round(1 + americanOdds / 100, 4);
  if (americanOdds < 0) return round(1 + 100 / Math.abs(americanOdds), 4);
  throw new Error("American odds cannot be 0");
}

export function validateProbability(value: number): void {
  if (!Number.isFinite(value) || value <= 0 || value >= 1) {
    throw new Error("Probability must be greater than 0 and less than 1");
  }
}
