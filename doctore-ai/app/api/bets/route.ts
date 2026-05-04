import { NextResponse } from "next/server";
import { getDemoUserWithBankroll } from "@/lib/demo";
import { prisma } from "@/lib/prisma";
import { betCreateSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

export async function GET() {
  const { user } = await getDemoUserWithBankroll();

  const bets = await prisma.bet.findMany({
    where: { userId: user.id },
    take: 50,
    orderBy: { placedAt: "desc" },
    include: {
      signal: {
        include: { market: true }
      }
    }
  });

  return NextResponse.json({
    bets: bets.map((bet) => ({
      id: bet.id,
      selection: bet.selection,
      book: bet.book,
      oddsTaken: Number(bet.oddsTaken),
      stake: Number(bet.stake),
      profitLoss: bet.profitLoss === null ? null : Number(bet.profitLoss),
      status: bet.status,
      placedAt: bet.placedAt.toISOString(),
      eventName: bet.signal?.market.eventName ?? "Manual bet",
      expectedValuePct: bet.signal ? Number(bet.signal.expectedValuePct) : null
    }))
  });
}

export async function POST(request: Request) {
  try {
    const { user, bankroll } = await getDemoUserWithBankroll();
    const body = await request.json();
    const payload = betCreateSchema.parse(body);

    const bet = await prisma.$transaction(async (tx) => {
      const created = await tx.bet.create({
        data: {
          userId: user.id,
          bankrollId: bankroll.id,
          signalId: payload.signalId,
          selection: payload.selection,
          book: payload.book,
          oddsTaken: payload.oddsTaken,
          stake: payload.stake,
          notes: payload.notes
        }
      });

      await tx.bankroll.update({
        where: { id: bankroll.id },
        data: { currentAmount: { decrement: payload.stake } }
      });

      return created;
    });

    return NextResponse.json({
      bet: {
        id: bet.id,
        selection: bet.selection,
        book: bet.book,
        oddsTaken: Number(bet.oddsTaken),
        stake: Number(bet.stake),
        status: bet.status,
        placedAt: bet.placedAt.toISOString()
      }
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid bet payload" },
      { status: 400 }
    );
  }
}
