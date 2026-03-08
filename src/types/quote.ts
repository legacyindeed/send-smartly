export type PayoutMethod = "bank" | "mobile_money" | "cash_pickup" | "wallet";

export type PriorityMode = "cheapest" | "fastest" | "balanced";

export type Quote = {
  provider: string;
  sendCountry: string;
  receiveCountry: string;
  sendCurrency: string;
  receiveCurrency: string;
  sendAmount: number;
  fee: number;
  exchangeRate: number;
  midMarketRate: number;
  fxMarkupPercent: number;
  recipientAmount: number;
  effectiveRate: number;
  deliveryEstimate: string;
  payoutMethod: PayoutMethod;
  trustScore: number;
  sourceType: "real" | "estimated" | "fallback";
  recommendationTags: string[];
  savingsVsWise?: number;
};

export type QuoteResponse = {
  corridorId: string;
  priority: PriorityMode;
  quotes: Quote[];
  rankings: {
    cheapest: Quote | null;
    fastest: Quote | null;
    bestOverall: Quote | null;
    mostRecipientGets: Quote | null;
  };
  insights: {
    summaries: string[];
    recommendation: string;
    caution: string;
  };
  generatedAt: string;
};
