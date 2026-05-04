import { NextResponse } from "next/server";
import { calculateKelly } from "@/lib/math";
import { kellySchema } from "@/lib/validators";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = kellySchema.parse(body);
    const result = calculateKelly(input);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid Kelly input" },
      { status: 400 }
    );
  }
}
