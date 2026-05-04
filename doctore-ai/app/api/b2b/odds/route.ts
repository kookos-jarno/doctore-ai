import { NextResponse } from "next/server";
import { requireApiKey } from "@/lib/api-key";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await requireApiKey(request);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const rate = rateLimit(`b2b-odds:${auth.apiKeyHash}`, 240, 60_000);
  if (!rate.ok) {
    return NextResponse.json({ error: "Rate limit exceeded", resetAt: rate.resetAt }, { status: 429 });
  }

  const url = new URL(request.url);
  const sport = url.searchParams.get("sport")?.toUpperCase();
  const limit = Math.min(Number(url.searchParams.get("limit") ?? 100), 500);

  const markets = await prisma.market.findMany({
    where: sport ? { sport } : undefined,
    take: limit,
    orderBy: { capturedAt: "desc" },
    include: { signals: { orderBy: { createdAt: "desc" }, take: 1 } }
  });

  return NextResponse.json({
    remaining: rate.remaining,
    data: markets.map((market) => ({
      marketId: market.id,
      sport: market.sport,
      league: market.league,
      eventName: market.eventName,
      marketType: market.marketType,
      selection: market.selection,
      book: market.book,
      oddsDecimal: Number(market.oddsDecimal),
      line: market.line === null ? null : Number(market.line),
      startsAt: market.startsAt.toISOString(),
      capturedAt: market.capturedAt.toISOString(),
      latestSignal: market.signals[0]
        ? {
            id: market.signals[0].id,
            modelProbability: Number(market.signals[0].modelProbability),
            impliedProbability: Number(market.signals[0].impliedProbability),
            edgePct: Number(market.signals[0].edgePct),
            expectedValuePct: Number(market.signals[0].expectedValuePct),
            status: market.signals[0].status
          }
        : null
    }))
  });
}
