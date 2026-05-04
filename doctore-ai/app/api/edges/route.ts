import { NextResponse } from "next/server";
import { calculateKelly } from "@/lib/math";
import { ingestOddsItemSchema } from "@/lib/validators";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const item = ingestOddsItemSchema.parse(body);
    const kelly = calculateKelly({
      bankroll: item.bankroll,
      oddsDecimal: item.oddsDecimal,
      modelProbability: item.modelProbability,
      kellyFraction: item.kellyFraction,
      maxStakePct: item.maxStakePct
    });

    return NextResponse.json({
      eventName: item.eventName,
      sport: item.sport,
      league: item.league,
      marketType: item.marketType,
      selection: item.selection,
      book: item.book,
      oddsDecimal: item.oddsDecimal,
      startsAt: item.startsAt.toISOString(),
      ...kelly
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid edge payload" },
      { status: 400 }
    );
  }
}
