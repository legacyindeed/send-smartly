import type { Quote } from "../models/quote";
import { baseQuote, type ScrapeProviderModule } from "./shared";

export const providerModule: ScrapeProviderModule = {
  provider: "Remitly",
  async scrapeProvider({ corridor, amount }): Promise<Quote[]> {
    const sourceUrl = "https://www.remitly.com/";
    const common = baseQuote({ provider: "Remitly", corridor, amount, sourceUrl });

    // TODO(Remitly): implement Playwright quote extraction for public pricing flow.
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
        errorMessage: "Remitly scraper not implemented yet",
      },
    ];
  },
};
