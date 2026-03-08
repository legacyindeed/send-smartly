import type { PayoutMethod, Quote } from "@/types/quote";

export type ProviderAssumption = {
  provider: string;
  trustScore: number;
  baseFee: number;
  percentFee: number;
  fxMarkupMin: number;
  fxMarkupMax: number;
  speedHoursMin: number;
  speedHoursMax: number;
  payoutMethods: PayoutMethod[];
  corridorMultiplier?: Partial<Record<string, number>>;
};

export type BuildQuoteParams = {
  provider: string;
  sendCountry: string;
  receiveCountry: string;
  sendCurrency: string;
  receiveCurrency: string;
  sendAmount: number;
  fee: number;
  providerRate: number;
  midMarketRate: number;
  deliveryEstimate: string;
  payoutMethod: PayoutMethod;
  trustScore: number;
  sourceType: "real" | "estimated" | "fallback";
};

export function normalizeQuote(params: BuildQuoteParams): Quote {
  const recipientAmount = Math.max(0, (params.sendAmount - params.fee) * params.providerRate);
  const fxMarkupPercent = Math.max(0, ((params.midMarketRate - params.providerRate) / params.midMarketRate) * 100);
  const effectiveRate = recipientAmount / params.sendAmount;

  return {
    provider: params.provider,
    sendCountry: params.sendCountry,
    receiveCountry: params.receiveCountry,
    sendCurrency: params.sendCurrency,
    receiveCurrency: params.receiveCurrency,
    sendAmount: params.sendAmount,
    fee: params.fee,
    exchangeRate: params.providerRate,
    midMarketRate: params.midMarketRate,
    fxMarkupPercent,
    recipientAmount,
    effectiveRate,
    deliveryEstimate: params.deliveryEstimate,
    payoutMethod: params.payoutMethod,
    trustScore: params.trustScore,
    sourceType: params.sourceType,
    recommendationTags: [],
  };
}
