import { withCache } from "@/lib/utils/cache";
import type { FxProviderResponse } from "./types";

const TTL_MS = 45 * 60 * 1000;

export async function getOpenExchangeRates(base: string): Promise<FxProviderResponse> {
  const appId = process.env.OPEN_EXCHANGE_RATES_APP_ID;
  if (!appId) {
    throw new Error("OPEN_EXCHANGE_RATES_APP_ID not configured");
  }

  return withCache(`oxr:${base}`, TTL_MS, async () => {
    const symbols = ["USD", "GBP", "GHS", "NGN", "KES", "UGX"].join(",");
    const response = await fetch(
      `https://openexchangerates.org/api/latest.json?app_id=${appId}&base=${base}&symbols=${symbols}`,
      { next: { revalidate: 2700 } }
    );

    if (!response.ok) {
      throw new Error(`OpenExchangeRates failed: ${response.status}`);
    }

    const json = (await response.json()) as { base: string; rates: Record<string, number>; timestamp: number };

    return {
      provider: "openexchangerates",
      base: json.base,
      rates: json.rates,
      fetchedAt: new Date(json.timestamp * 1000).toISOString(),
      sourceType: "real",
    };
  });
}
