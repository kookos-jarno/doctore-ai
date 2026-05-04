export type KellyInput = {
  bankroll: number;
  oddsDecimal: number;
  modelProbability: number;
  kellyFraction?: number;
  maxStakePct?: number;
};

export type KellyOutput = {
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

export type SignalDTO = {
  id: string;
  eventName: string;
  sport: string;
  league: string;
  marketType: string;
  selection: string;
  book: string;
  oddsDecimal: number;
  startsAt: string;
  modelProbability: number;
  impliedProbability: number;
  edgePct: number;
  expectedValuePct: number;
  confidence: number;
  recommendedStake: number;
  status: string;
  reason: string;
  createdAt: string;
};
