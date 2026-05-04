import { PrismaClient, MarketType, SubscriptionTier } from "@prisma/client";
import crypto from "node:crypto";
import { calculateKelly } from "../lib/math";

const prisma = new PrismaClient();

function hashApiKey(apiKey: string): string {
  return crypto.createHash("sha256").update(apiKey).digest("hex");
}

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "demo@doctore.ai" },
    update: {},
    create: {
      email: "demo@doctore.ai",
      name: "Demo User",
      subscriptionTier: SubscriptionTier.SHARP
    }
  });

  const bankroll = await prisma.bankroll.upsert({
    where: { id: "demo-bankroll" },
    update: {
      userId: user.id,
      currentAmount: 10000,
      startingAmount: 10000,
      kellyFraction: 0.25,
      maxStakePct: 5
    },
    create: {
      id: "demo-bankroll",
      userId: user.id,
      name: "Main bankroll",
      currency: "EUR",
      startingAmount: 10000,
      currentAmount: 10000,
      kellyFraction: 0.25,
      maxStakePct: 5
    }
  });

  const demoApiKey = process.env.B2B_API_KEY ?? "doctore_demo_key_change_me";
  await prisma.apiKey.upsert({
    where: { keyHash: hashApiKey(demoApiKey) },
    update: { userId: user.id, revokedAt: null },
    create: {
      userId: user.id,
      label: "Demo B2B key",
      keyHash: hashApiKey(demoApiKey),
      tier: SubscriptionTier.B2B
    }
  });

  await prisma.bet.deleteMany({ where: { userId: user.id } });
  await prisma.signal.deleteMany();
  await prisma.market.deleteMany();

  const now = new Date();
  const inputs = [
    {
      sport: "MLB",
      league: "MLB",
      eventName: "New York Yankees @ Boston Red Sox",
      marketType: MarketType.MONEYLINE,
      selection: "New York Yankees ML",
      startsAt: addHours(now, 7),
      book: "Pinnacle",
      oddsDecimal: 2.08,
      modelProbability: 0.515,
      confidence: 0.72
    },
    {
      sport: "MLB",
      league: "MLB",
      eventName: "Los Angeles Dodgers @ San Diego Padres",
      marketType: MarketType.TOTAL,
      selection: "Over 8.0",
      startsAt: addHours(now, 5),
      book: "Bet365",
      oddsDecimal: 1.96,
      modelProbability: 0.532,
      confidence: 0.66
    },
    {
      sport: "NBA",
      league: "NBA",
      eventName: "Dallas Mavericks @ Denver Nuggets",
      marketType: MarketType.SPREAD,
      selection: "Dallas +3.5",
      startsAt: addHours(now, 9),
      book: "Unibet",
      oddsDecimal: 1.91,
      modelProbability: 0.529,
      confidence: 0.63
    },
    {
      sport: "NHL",
      league: "NHL",
      eventName: "Toronto Maple Leafs @ Tampa Bay Lightning",
      marketType: MarketType.MONEYLINE,
      selection: "Toronto ML",
      startsAt: addHours(now, 8),
      book: "FanDuel",
      oddsDecimal: 1.84,
      modelProbability: 0.525,
      confidence: 0.58
    }
  ];

  for (const input of inputs) {
    const kelly = calculateKelly({
      bankroll: Number(bankroll.currentAmount),
      oddsDecimal: input.oddsDecimal,
      modelProbability: input.modelProbability,
      kellyFraction: Number(bankroll.kellyFraction),
      maxStakePct: Number(bankroll.maxStakePct)
    });

    await prisma.market.create({
      data: {
        sport: input.sport,
        league: input.league,
        eventName: input.eventName,
        marketType: input.marketType,
        selection: input.selection,
        startsAt: input.startsAt,
        book: input.book,
        oddsDecimal: input.oddsDecimal,
        signals: {
          create: {
            modelProbability: input.modelProbability,
            impliedProbability: kelly.impliedProbability,
            edgePct: kelly.edgePct,
            expectedValuePct: kelly.expectedValuePct,
            confidence: input.confidence,
            recommendedStake: kelly.cappedStake,
            kellyFraction: kelly.fractionalKellyPct / 100,
            status: kelly.status,
            reason: kelly.reason,
            expiresAt: input.startsAt
          }
        }
      }
    });
  }

  console.log("Seed complete");
  console.log(`Demo user: ${user.email}`);
  console.log(`Demo B2B API key: ${demoApiKey}`);
}

function addHours(date: Date, hours: number) {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
