import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";

export function hashApiKey(apiKey: string): string {
  return crypto.createHash("sha256").update(apiKey).digest("hex");
}

export async function requireApiKey(request: Request): Promise<{ ok: true; apiKeyHash: string } | { ok: false; status: number; error: string }> {
  const apiKey = request.headers.get("x-api-key") ?? "";

  if (!apiKey) {
    return { ok: false, status: 401, error: "Missing x-api-key header" };
  }

  if (process.env.B2B_API_KEY && apiKey === process.env.B2B_API_KEY) {
    return { ok: true, apiKeyHash: hashApiKey(apiKey) };
  }

  const apiKeyHash = hashApiKey(apiKey);
  const record = await prisma.apiKey.findFirst({
    where: {
      keyHash: apiKeyHash,
      revokedAt: null
    }
  });

  if (!record) {
    return { ok: false, status: 403, error: "Invalid or revoked API key" };
  }

  await prisma.apiKey.update({
    where: { id: record.id },
    data: { lastUsedAt: new Date() }
  });

  return { ok: true, apiKeyHash };
}
