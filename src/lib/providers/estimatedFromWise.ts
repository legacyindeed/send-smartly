import type { PayoutMethod, Quote } from "@/types/quote";
import type { Corridor } from "@/types/corridor";
import { estimatedProviderConfig, type EstimatedProviderConfig } from "@/data/provider-estimates";

export function computeEstimatedRate(wiseRate: number, multiplier: number): number {
  return Math.round(wiseRate * multiplier * 10000) / 10000;
}

// Utility for manual screenshot recalibration
export function deriveMultiplier(observedRate: number, wiseRate: number): number {
  if (!Number.isFinite(observedRate) || !Number.isFinite(wiseRate) || wiseRate <= 0) {
    throw new Error("Invalid observedRate or wiseRate");
  }
  return observedRate / wiseRate;
}

function pickPayoutMethod(config: EstimatedProviderConfig, requested?: PayoutMethod): PayoutMethod {
  if (requested && config.payoutMethods.includes(requested)) return requested;
  return config.payoutMethods[0] ?? "bank";
}

function buildRecommendationTags(rateMultiplier: number, provider: string): string[] {
  const tags: string[] = ["estimated from Wise"];
  if (rateMultiplier > 1.0017) tags.push("aggressive payout estimate");
  if (provider === "Western Union") tags.push("cash pickup coverage");
  if (provider === "TapTap Send" || provider === "LemFi") tags.push("mobile money oriented");
  return tags;
}

export function buildEstimatedQuoteFromWise(params: {
  config: EstimatedProviderConfig;
  wiseRate: number;
  wiseFee: number;
  sendAmount: number;
  sendCountry: string;
  receiveCountry: string;
  sendCurrency: string;
  receiveCurrency: string;
  payoutMethod?: PayoutMethod;
}): Quote {
  const exchangeRate = computeEstimatedRate(params.wiseRate, params.config.rateMultiplier);
  const fee = params.sendCurrency === "USD" ? params.config.feeUsd : params.config.feeUsd * 0.79;
  const recipientAmount = Math.max(0, (params.sendAmount - fee) * exchangeRate);
  const effectiveRate = recipientAmount / params.sendAmount;
  const fxMarkupPercent = ((exchangeRate - params.wiseRate) / params.wiseRate) * 100;

  const wiseRecipientAmount = Math.max(0, (params.sendAmount - params.wiseFee) * params.wiseRate);
  const savingsVsWise = recipientAmount - wiseRecipientAmount;

  return {
    provider: params.config.provider,
    sendCountry: params.sendCountry,
    receiveCountry: params.receiveCountry,
    sendCurrency: params.sendCurrency,
    receiveCurrency: params.receiveCurrency,
    sendAmount: params.sendAmount,
    fee: Math.round(fee * 100) / 100,
    exchangeRate,
    midMarketRate: params.wiseRate,
    fxMarkupPercent: Math.round(fxMarkupPercent * 10000) / 10000,
    recipientAmount: Math.round(recipientAmount * 100) / 100,
    effectiveRate: Math.round(effectiveRate * 10000) / 10000,
    deliveryEstimate: params.config.deliveryEstimate,
    payoutMethod: pickPayoutMethod(params.config, params.payoutMethod),
    trustScore: params.config.trustScore,
    sourceType: "estimated",
    recommendationTags: [...buildRecommendationTags(params.config.rateMultiplier, params.config.provider), `${savingsVsWise >= 0 ? "+" : ""}${savingsVsWise.toFixed(2)} vs Wise`],
    savingsVsWise: Math.round(savingsVsWise * 100) / 100,
  };
}

export function buildAllEstimatedQuotesFromWise(params: {
  wiseRate: number;
  wiseFee: number;
  corridor: Corridor;
  sendAmount: number;
  payoutMethod?: PayoutMethod;
}): Quote[] {
  return estimatedProviderConfig
    .filter((cfg) => params.corridor.availableProviders.includes(cfg.provider))
    .filter((cfg) => (params.payoutMethod ? cfg.payoutMethods.includes(params.payoutMethod) : true))
    .map((cfg) =>
      buildEstimatedQuoteFromWise({
        config: cfg,
        wiseRate: params.wiseRate,
        wiseFee: params.wiseFee,
        sendAmount: params.sendAmount,
        sendCountry: params.corridor.sendCountry,
        receiveCountry: params.corridor.receiveCountry,
        sendCurrency: params.corridor.sendCurrency,
        receiveCurrency: params.corridor.receiveCurrency,
        payoutMethod: params.payoutMethod,
      })
    );
}
