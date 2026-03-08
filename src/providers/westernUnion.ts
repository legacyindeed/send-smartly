import type { Quote } from "../models/quote";
import { baseQuote, type ScrapeProviderModule } from "./shared";

export const providerModule: ScrapeProviderModule = {
  provider: "Western Union",
  async scrapeProvider({ corridor, amount }): Promise<Quote[]> {
    const sourceUrl = "https://www.westernunion.com/";
    const common = baseQuote({ provider: "Western Union", corridor, amount, sourceUrl });

    // TODO(Western Union): implement Playwright quote extraction for quote calculator on transfer flow.
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
        errorMessage: "Western Union scraper not implemented yet",
      },
    ];
  },
};
