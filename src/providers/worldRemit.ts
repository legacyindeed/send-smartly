import type { Quote } from "../models/quote";
import { baseQuote, type ScrapeProviderModule } from "./shared";

export const providerModule: ScrapeProviderModule = {
  provider: "WorldRemit",
  async scrapeProvider({ corridor, amount }): Promise<Quote[]> {
    const sourceUrl = "https://www.worldremit.com/";
    const common = baseQuote({ provider: "WorldRemit", corridor, amount, sourceUrl });

    // TODO(WorldRemit): implement Playwright quote extraction for transfer calculator.
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
        errorMessage: "WorldRemit scraper not implemented yet",
      },
    ];
  },
};
