import { z } from "zod";

export const kellySchema = z.object({
  bankroll: z.coerce.number().positive(),
  oddsDecimal: z.coerce.number().gt(1),
  modelProbability: z.coerce.number().gt(0).lt(1),
  kellyFraction: z.coerce.number().min(0).max(1).optional(),
  maxStakePct: z.coerce.number().gt(0).max(100).optional()
});

export const ingestOddsItemSchema = z.object({
  sport: z.string().min(2).max(32),
  league: z.string().min(2).max(32),
  eventName: z.string().min(3).max(160),
  marketType: z.enum(["MONEYLINE", "SPREAD", "TOTAL", "PLAYER_PROP", "FUTURES"]).default("MONEYLINE"),
  selection: z.string().min(1).max(160),
  startsAt: z.coerce.date(),
  book: z.string().min(2).max(64),
  oddsDecimal: z.coerce.number().gt(1),
  line: z.coerce.number().optional(),
  modelProbability: z.coerce.number().gt(0).lt(1),
  bankroll: z.coerce.number().positive().default(10000),
  kellyFraction: z.coerce.number().min(0).max(1).default(0.25),
  maxStakePct: z.coerce.number().gt(0).max(100).default(5),
  confidence: z.coerce.number().min(0).max(1).default(0.67)
});

export const ingestOddsSchema = z.object({
  items: z.array(ingestOddsItemSchema).min(1).max(100)
});

export const betCreateSchema = z.object({
  signalId: z.string().optional(),
  selection: z.string().min(1).max(160),
  book: z.string().min(2).max(64),
  oddsTaken: z.coerce.number().gt(1),
  stake: z.coerce.number().positive(),
  notes: z.string().max(1000).optional()
});

export const bankrollUpdateSchema = z.object({
  currentAmount: z.coerce.number().positive().optional(),
  kellyFraction: z.coerce.number().min(0).max(1).optional(),
  maxStakePct: z.coerce.number().gt(0).max(100).optional()
});
