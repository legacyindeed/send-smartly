import type { Corridor } from "@/types/corridor";
import type { PayoutMethod, Quote } from "@/types/quote";
import { normalizeQuote } from "./models";
import { round } from "@/lib/utils/math";

function toWiseCountryCode(code: string): string {
  if (code.toUpperCase() === "UK") return "GB";
  return code.toUpperCase();
}

async function fetchWiseRealQuote(params: {
  corridor: Corridor;
  sendAmount: number;
  payoutMethod?: PayoutMethod;
  midMarketRate: number;
}): Promise<Quote | null> {
  const token = process.env.WISE_API_TOKEN;
  const profileId = process.env.WISE_PROFILE_ID;

  if (!token || !profileId) return null;

  // NOTE: Replace this request payload with your Wise sandbox/live quote flow details.
  // Wise real quote APIs may require additional fields such as targetAccount or transfer purpose
  // depending on your account configuration.
  const response = await fetch(`https://api.wise.com/v3/profiles/${profileId}/quotes`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sourceCurrency: params.corridor.sendCurrency,
      targetCurrency: params.corridor.receiveCurrency,
      sourceAmount: params.sendAmount,
      payOut: params.payoutMethod === "cash_pickup" ? "BANK_TRANSFER" : "BANK_TRANSFER",
      preferredPayIn: "BALANCE",
      sourceCountry: toWiseCountryCode(params.corridor.sendCountry),
      targetCountry: toWiseCountryCode(params.corridor.receiveCountry),
    }),
    cache: "no-store",
  });

  if (!response.ok) return null;

  const json = (await response.json()) as {
    rate?: number;
    fee?: { total?: number };
    sourceAmount?: number;
    targetAmount?: number;
    estimatedDelivery?: string;
  };

  if (!json.rate || !json.targetAmount) return null;

  return normalizeQuote({
    provider: "Wise",
    sendCountry: params.corridor.sendCountry,
    receiveCountry: params.corridor.receiveCountry,
    sendCurrency: params.corridor.sendCurrency,
    receiveCurrency: params.corridor.receiveCurrency,
    sendAmount: params.sendAmount,
    fee: round(json.fee?.total ?? 0, 2),
    providerRate: json.rate,
    midMarketRate: params.midMarketRate,
    deliveryEstimate: json.estimatedDelivery ?? "Within 24 hours",
    payoutMethod: params.payoutMethod ?? "bank",
    trustScore: 95,
    sourceType: "real",
  });
}

function buildWiseFallback(params: {
  corridor: Corridor;
  sendAmount: number;
  payoutMethod?: PayoutMethod;
  midMarketRate: number;
}): Quote {
  const fee = round(2.9 + params.sendAmount * 0.0085, 2);
  const providerRate = round(params.midMarketRate * (1 - 0.0048), 6);
  return normalizeQuote({
    provider: "Wise",
    sendCountry: params.corridor.sendCountry,
    receiveCountry: params.corridor.receiveCountry,
    sendCurrency: params.corridor.sendCurrency,
    receiveCurrency: params.corridor.receiveCurrency,
    sendAmount: params.sendAmount,
    fee,
    providerRate,
    midMarketRate: params.midMarketRate,
    deliveryEstimate: "Within 24 hours",
    payoutMethod: params.payoutMethod ?? "bank",
    trustScore: 95,
    sourceType: "fallback",
  });
}

export async function getWiseQuote(params: {
  corridor: Corridor;
  sendAmount: number;
  payoutMethod?: PayoutMethod;
  midMarketRate: number;
}): Promise<Quote> {
  try {
    const realQuote = await fetchWiseRealQuote(params);
    if (realQuote) return realQuote;
  } catch {
    // swallow and fallback
  }

  return buildWiseFallback(params);
}
