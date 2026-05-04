import { DEMO_USER_EMAIL } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

export async function getDemoUserWithBankroll() {
  const user = await prisma.user.findUnique({
    where: { email: DEMO_USER_EMAIL },
    include: { bankrolls: { take: 1, orderBy: { createdAt: "asc" } } }
  });

  if (!user || user.bankrolls.length === 0) {
    throw new Error("Demo user not found. Run `npm run db:seed` first.");
  }

  return { user, bankroll: user.bankrolls[0] };
}
