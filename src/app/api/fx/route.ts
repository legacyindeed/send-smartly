import { NextResponse } from "next/server";
import { z } from "zod";
import { getFxBase, getMidMarketRate } from "@/lib/fx/exchangerate";

const querySchema = z.object({
  base: z.string().length(3).transform((v) => v.toUpperCase()),
  target: z.string().length(3).transform((v) => v.toUpperCase()),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = querySchema.parse({
      base: searchParams.get("base"),
      target: searchParams.get("target"),
    });

    const [rate, source] = await Promise.all([
      getMidMarketRate(parsed.base, parsed.target),
      getFxBase(parsed.base),
    ]);

    return NextResponse.json({
      base: parsed.base,
      target: parsed.target,
      rate,
      source: source.provider,
      sourceType: source.sourceType,
      fetchedAt: source.fetchedAt,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch FX rate",
      },
      { status: 400 }
    );
  }
}
