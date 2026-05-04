import { NextResponse } from "next/server";
import { getDemoUserWithBankroll } from "@/lib/demo";
import { prisma } from "@/lib/prisma";
import { bankrollUpdateSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

export async function GET() {
  const { bankroll, user } = await getDemoUserWithBankroll();

  const bets = await prisma.bet.findMany({
    where: { userId: user.id },
    orderBy: { placedAt: "desc" },
    take: 250
  });

  const totalStaked = bets.reduce((sum, bet) => sum + Number(bet.stake), 0);
  const settledPnL = bets.reduce((sum, bet) => sum + Number(bet.profitLoss ?? 0), 0);
  const pendingExposure = bets
    .filter((bet) => bet.status === "PENDING")
    .reduce((sum, bet) => sum + Number(bet.stake), 0);

  return NextResponse.json({
    bankroll: {
      id: bankroll.id,
      name: bankroll.name,
      currency: bankroll.currency,
      startingAmount: Number(bankroll.startingAmount),
      currentAmount: Number(bankroll.currentAmount),
      kellyFraction: Number(bankroll.kellyFraction),
      maxStakePct: Number(bankroll.maxStakePct),
      totalStaked,
      settledPnL,
      pendingExposure,
      betCount: bets.length
    }
  });
}

export async function PATCH(request: Request) {
  try {
    const { bankroll } = await getDemoUserWithBankroll();
    const body = await request.json();
    const payload = bankrollUpdateSchema.parse(body);

    const updated = await prisma.bankroll.update({
      where: { id: bankroll.id },
      data: payload
    });

    return NextResponse.json({
      bankroll: {
        id: updated.id,
        currentAmount: Number(updated.currentAmount),
        kellyFraction: Number(updated.kellyFraction),
        maxStakePct: Number(updated.maxStakePct)
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid bankroll update" },
      { status: 400 }
    );
  }
}
