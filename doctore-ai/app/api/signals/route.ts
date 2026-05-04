import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Market, Signal } from "@prisma/client";
import type { SignalDTO } from "@/lib/types";

export const dynamic = "force-dynamic";

type SignalWithMarket = Signal & { market: Market };

function mapSignal(signal: SignalWithMarket): SignalDTO {
  return {
    id: signal.id,
    eventName: signal.market.eventName,
    sport: signal.market.sport,
    league: signal.market.league,
    marketType: signal.market.marketType,
    selection: signal.market.selection,
    book: signal.market.book,
    oddsDecimal: Number(signal.market.oddsDecimal),
    startsAt: signal.market.startsAt.toISOString(),
    modelProbability: Number(signal.modelProbability),
    impliedProbability: Number(signal.impliedProbability),
    edgePct: Number(signal.edgePct),
    expectedValuePct: Number(signal.expectedValuePct),
    confidence: Number(signal.confidence),
    recommendedStake: Number(signal.recommendedStake),
    status: signal.status,
    reason: signal.reason,
    createdAt: signal.createdAt.toISOString()
  };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const limit = Math.min(Number(url.searchParams.get("limit") ?? 25), 100);
  const status = url.searchParams.get("status") ?? undefined;

  const signals = await prisma.signal.findMany({
    where: status ? { status: status as never } : undefined,
    take: limit,
    orderBy: [{ expectedValuePct: "desc" }, { createdAt: "desc" }],
    include: { market: true }
  });

  return NextResponse.json({ signals: signals.map(mapSignal) });
}
