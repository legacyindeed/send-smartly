import { z } from "zod";
import { env } from "../config/env";
import type { Quote } from "../models/quote";
import { parseMoney } from "../utils/money";
import { withRetry } from "../utils/retry";
import { sleep } from "../utils/time";
import { baseQuote, type ScrapeProviderModule } from "./shared";

const wiseApiItemSchema = z
  .object({
    alias: z.string().optional(),
    name: z.string().optional(),
    quotes: z
      .array(
        z.object({
          fee: z.union([z.number(), z.string()]).optional(),
          rate: z.union([z.number(), z.string()]).optional(),
          receivedAmount: z.union([z.number(), z.string()]).optional(),
          estimatedDelivery: z.string().optional(),
          delivery: z.string().optional(),
          payOut: z.string().optional(),
          payout: z.string().optional(),
        })
      )
      .optional(),
  })
  .passthrough();

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") return parseMoney(value);
  return null;
}

function toWiseCountryCode(code: string): string {
  const upper = code.toUpperCase();
  if (upper === "UK") return "GB";
  return upper;
}

export const wiseProvider: ScrapeProviderModule = {
  provider: "Wise",
  async scrapeProvider({ page, context, corridor, amount }): Promise<Quote[]> {
    const sourceUrl = "https://wise.com/";
    const common = baseQuote({ provider: "Wise", corridor, amount, sourceUrl });

    return withRetry(
      async () => {
        await page.goto(sourceUrl, { waitUntil: "domcontentloaded", timeout: env.SCRAPE_TIMEOUT_MS });
        await sleep(1200);

        const params = new URLSearchParams({
          sourceCurrency: corridor.sendCurrency,
          targetCurrency: corridor.receiveCurrency,
          sendAmount: String(amount),
          includeWise: "true",
          providers: "wise",
          sourceCountry: toWiseCountryCode(corridor.sendCountry),
          targetCountry: toWiseCountryCode(corridor.receiveCountry),
        });

        const apiUrl = `https://api.wise.com/v4/comparisons/?${params.toString()}`;
        const response = await context.request.get(apiUrl, {
          timeout: env.SCRAPE_TIMEOUT_MS,
          headers: {
            "accept": "application/json",
          },
        });

        if (!response.ok()) {
          throw new Error(`Wise comparison endpoint returned ${response.status()}`);
        }

        const payload: unknown = await response.json();
        const rows = Array.isArray(payload)
          ? payload
          : Array.isArray((payload as { providers?: unknown[] })?.providers)
            ? ((payload as { providers: unknown[] }).providers ?? [])
            : [];

        const wise = rows
          .map((item) => wiseApiItemSchema.safeParse(item))
          .filter((parsed) => parsed.success)
          .map((parsed) => parsed.data)
          .find((item) => {
            const key = `${item.alias ?? ""} ${item.name ?? ""}`.toLowerCase();
            return key.includes("wise");
          });

        if (!wise || !wise.quotes || wise.quotes.length === 0) {
          throw new Error("Wise quote data missing from public comparison response");
        }

        const quoteCandidate = wise.quotes.find((q) => asNumber(q.receivedAmount) !== null) ?? wise.quotes[0];
        const fee = asNumber(quoteCandidate.fee);
        const exchangeRate = asNumber(quoteCandidate.rate);
        const recipientAmount = asNumber(quoteCandidate.receivedAmount);

        if (fee === null || exchangeRate === null || recipientAmount === null) {
          throw new Error("Wise quote response missing fee/rate/recipient amount");
        }

        const payoutMethod = quoteCandidate.payOut ?? quoteCandidate.payout ?? null;
        const deliveryEstimate = quoteCandidate.estimatedDelivery ?? quoteCandidate.delivery ?? null;

        return [
          {
            ...common,
            fee,
            exchangeRate,
            recipientAmount,
            deliveryEstimate,
            payoutMethod,
            status: "success",
            errorMessage: null,
          },
        ];
      },
      { retries: env.SCRAPE_RETRIES, initialDelayMs: 1000, maxDelayMs: 8000 }
    );
  },
};
