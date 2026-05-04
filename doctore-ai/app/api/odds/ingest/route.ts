import { NextResponse } from "next/server";
import { MarketType, SignalStatus } from "@prisma/client";
import { requireApiKey } from "@/lib/api-key";
import { calculateKelly } from "@/lib/math";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { ingestOddsSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const auth = await requireApiKey(request);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const rate = rateLimit(`ingest:${auth.apiKeyHash}`, 60, 60_000);
  if (!rate.ok) {
    return NextResponse.json({ error: "Rate limit exceeded", resetAt: rate.resetAt }, { status: 429 });
  }

  try {
    const body = await request.json();
    const payload = ingestOddsSchema.parse(body);

    const created = await prisma.$transaction(
      payload.items.map((item) => {
        const kelly = calculateKelly({
          bankroll: item.bankroll,
          oddsDecimal: item.oddsDecimal,
          modelProbability: item.modelProbability,
          kellyFraction: item.kellyFraction,
          maxStakePct: item.maxStakePct
        });

        const status: SignalStatus = kelly.status;

        return prisma.market.create({
          data: {
            sport: item.sport.toUpperCase(),
            league: item.league.toUpperCase(),
            eventName: item.eventName,
            marketType: item.marketType as MarketType,
            selection: item.selection,
            startsAt: item.startsAt,
            book: item.book,
            oddsDecimal: item.oddsDecimal,
            line: item.line,
            signals: {
              create: {
                modelProbability: item.modelProbability,
                impliedProbability: kelly.impliedProbability,
                edgePct: kelly.edgePct,
                expectedValuePct: kelly.expectedValuePct,
                confidence: item.confidence,
                recommendedStake: kelly.cappedStake,
                kellyFraction: kelly.fractionalKellyPct / 100,
                status,
                reason: kelly.reason,
                expiresAt: item.startsAt
              }
            }
          },
          include: { signals: true }
        });
      })
    );

    return NextResponse.json({
      created: created.length,
      remaining: rate.remaining,
      markets: created.map((market) => ({
        id: market.id,
        eventName: market.eventName,
        signals: market.signals.map((signal) => ({
          id: signal.id,
          status: signal.status,
          expectedValuePct: Number(signal.expectedValuePct),
          recommendedStake: Number(signal.recommendedStake)
        }))
      }))
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid odds ingestion payload" },
      { status: 400 }
    );
  }
}
