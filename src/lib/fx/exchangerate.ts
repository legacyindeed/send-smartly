import { withCache } from "@/lib/utils/cache";
import { getOpenExchangeRates } from "./openExchangeRates";
import type { FxProviderResponse } from "./types";

const TTL_MS = 45 * 60 * 1000;

const fallbackRates: Record<string, Record<string, number>> = {
  USD: { USD: 1, GBP: 0.79, GHS: 15.25, NGN: 1545, KES: 129.6, UGX: 3830 },
  GBP: { USD: 1.26, GBP: 1, GHS: 19.25, NGN: 1955, KES: 163.4, UGX: 4825 },
};

async function getExchangeRateApi(base: string): Promise<FxProviderResponse> {
  const key = process.env.EXCHANGERATE_API_KEY;
  if (!key) {
    throw new Error("EXCHANGERATE_API_KEY not configured");
  }

  return withCache(`xrate:${base}`, TTL_MS, async () => {
    const response = await fetch(`https://v6.exchangerate-api.com/v6/${key}/latest/${base}`, {
      next: { revalidate: 2700 },
    });

    if (!response.ok) {
      throw new Error(`ExchangeRate-API failed: ${response.status}`);
    }

    const json = (await response.json()) as {
      time_last_update_utc: string;
      conversion_rates: Record<string, number>;
    };

    return {
      provider: "exchangerate-api",
      base,
      rates: json.conversion_rates,
      fetchedAt: new Date(json.time_last_update_utc).toISOString(),
      sourceType: "real",
    };
  });
}

export async function getFxBase(base: string): Promise<FxProviderResponse> {
  try {
    return await getExchangeRateApi(base);
  } catch {
    try {
      return await getOpenExchangeRates(base);
    } catch {
      const rates = fallbackRates[base];
      if (!rates) throw new Error(`No fallback rates configured for ${base}`);
      return {
        provider: "fallback",
        base,
        rates,
        fetchedAt: new Date().toISOString(),
        sourceType: "fallback",
      };
    }
  }
}

export async function getMidMarketRate(base: string, target: string): Promise<number> {
  const fx = await getFxBase(base);
  const rate = fx.rates[target];
  if (!rate) throw new Error(`No FX rate found for ${base}/${target}`);
  return rate;
}

export async function getSupportedCurrencies(): Promise<string[]> {
  const fx = await getFxBase("USD");
  return Object.keys(fx.rates).sort();
}
