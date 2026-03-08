import type { BrowserContext, Page } from "playwright";
import type { Corridor, Quote } from "../models/quote";
import { nowIso } from "../utils/time";

export interface ProviderScrapeInput {
  page: Page;
  context: BrowserContext;
  corridor: Corridor;
  amount: number;
}

export type ProviderScraper = (input: ProviderScrapeInput) => Promise<Quote[]>;

export interface ScrapeProviderModule {
  provider: string;
  scrapeProvider: ProviderScraper;
}

export function baseQuote(params: {
  provider: string;
  corridor: Corridor;
  amount: number;
  sourceUrl: string;
}): Omit<Quote, "fee" | "exchangeRate" | "recipientAmount" | "deliveryEstimate" | "payoutMethod" | "status" | "errorMessage"> {
  return {
    provider: params.provider,
    sendCountry: params.corridor.sendCountry,
    receiveCountry: params.corridor.receiveCountry,
    sendCurrency: params.corridor.sendCurrency,
    receiveCurrency: params.corridor.receiveCurrency,
    sendAmount: params.amount,
    scrapedAt: nowIso(),
    sourceUrl: params.sourceUrl,
  };
}

export function missingFieldFallback(provider: string, field: string): string {
  return `${provider}: ${field} not visible in public quote flow`;
}

export const providerSelectorNotes = `
Selector update workflow:
1) Run: npm run pw:codegen -- <provider quote URL>
2) Capture stable locators by role/label/text before CSS selectors.
3) Avoid brittle nth-child selectors.
4) Keep extraction helpers defensive: parse nulls and continue.
`;
