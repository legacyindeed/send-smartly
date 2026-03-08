import type { Quote } from "../models/quote";
import { baseQuote, type ScrapeProviderModule } from "./shared";

export const providerModule: ScrapeProviderModule = {
  provider: "LemFi",
  async scrapeProvider({ corridor, amount }): Promise<Quote[]> {
    const sourceUrl = "https://www.lemfi.com/";
    const common = baseQuote({ provider: "LemFi", corridor, amount, sourceUrl });

    // TODO(LemFi): implement Playwright quote extraction for public send flow.
    // Constraints:
    // - Public flow only (no login / no bypass techniques)
    // - Use resilient locators (roles/labels/text)
    // - Extract fee, exchange rate, recipient amount, payout method, delivery estimate when visible
    // - Return partial status if only some fields are available
    //
    // 

    return [
      {
        ...common,
        fee: 0,
        exchangeRate: 0,
        recipientAmount: 0,
        deliveryEstimate: null,
        payoutMethod: null,
        status: "failed",
        errorMessage: "LemFi scraper not implemented yet",
      },
    ];
  },
};
