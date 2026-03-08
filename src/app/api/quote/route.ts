import { NextResponse } from "next/server";
import { z } from "zod";
import { getCorridorByCountries } from "@/data/corridors";
import type { PriorityMode, PayoutMethod, QuoteResponse } from "@/types/quote";
import { getMidMarketRate } from "@/lib/fx/exchangerate";
import { getWiseQuote } from "@/lib/providers/wise";
import { buildAllEstimatedQuotesFromWise } from "@/lib/providers/estimatedFromWise";
import { attachQuoteMetrics, buildInsights, rankQuotes } from "@/lib/providers/ranking";
import { withCache } from "@/lib/utils/cache";

const bodySchema = z.object({
  sendCountry: z.literal("US"),
  receiveCountry: z.literal("GH"),
  sendAmount: z.number().positive().max(50000),
  payoutMethod: z.enum(["bank", "mobile_money", "cash_pickup", "wallet"]).optional(),
  priority: z.enum(["cheapest", "fastest", "balanced"]).optional(),
});

export async function POST(request: Request) {
  try {
    const input = bodySchema.parse(await request.json());
    const corridor = getCorridorByCountries(input.sendCountry, input.receiveCountry);

    if (!corridor) {
      return NextResponse.json({ error: "Unsupported corridor" }, { status: 400 });
    }

    const priority: PriorityMode = input.priority ?? "balanced";
    const cacheKey = `quote:${corridor.id}:${input.sendAmount}:${input.payoutMethod ?? "any"}:${priority}`;

    const payload = await withCache(cacheKey, 15 * 60 * 1000, async (): Promise<QuoteResponse> => {
      const midMarketRate = await getMidMarketRate(corridor.sendCurrency, corridor.receiveCurrency);

      const wiseQuote = await getWiseQuote({
        corridor,
        sendAmount: input.sendAmount,
        payoutMethod: input.payoutMethod as PayoutMethod | undefined,
        midMarketRate,
      });

      const estimatedQuotes = buildAllEstimatedQuotesFromWise({
        wiseRate: wiseQuote.exchangeRate,
        wiseFee: wiseQuote.fee,
        corridor,
        sendAmount: input.sendAmount,
        payoutMethod: input.payoutMethod,
      });

      const combined = [wiseQuote, ...estimatedQuotes]
        .filter((q) => (input.payoutMethod ? q.payoutMethod === input.payoutMethod : true));

      const enriched = attachQuoteMetrics(combined);
      const ranking = rankQuotes(enriched, priority);
      const insights = buildInsights(ranking.sorted, ranking.bestOverall, ranking.fastest, ranking.cheapest);

      return {
        corridorId: corridor.id,
        priority,
        quotes: ranking.sorted,
        rankings: {
          cheapest: ranking.cheapest,
          fastest: ranking.fastest,
          bestOverall: ranking.bestOverall,
          mostRecipientGets: ranking.mostRecipientGets,
        },
        insights,
        generatedAt: new Date().toISOString(),
      };
    });

    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to generate quotes",
      },
      { status: 400 }
    );
  }
}
