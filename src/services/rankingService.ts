import { parseDeliveryToHours } from "../utils/timeDelivery";

export interface RankableQuote {
  provider: string;
  fee: number;
  recipientAmount: number;
  deliveryEstimate: string | null;
}

export interface RankingResult {
  cheapest: RankableQuote | null;
  fastest: RankableQuote | null;
  bestOverall: RankableQuote | null;
}

export function rankQuotes(quotes: RankableQuote[]): RankingResult {
  if (quotes.length === 0) {
    return { cheapest: null, fastest: null, bestOverall: null };
  }

  const cheapest = [...quotes].sort((a, b) => a.fee - b.fee)[0] ?? null;
  const fastest = [...quotes].sort((a, b) => parseDeliveryToHours(a.deliveryEstimate) - parseDeliveryToHours(b.deliveryEstimate))[0] ?? null;

  const bestOverall =
    [...quotes]
      .map((q) => {
        const deliveryPenalty = parseDeliveryToHours(q.deliveryEstimate);
        const score = q.recipientAmount * 1 - q.fee * 0.25 - deliveryPenalty * 0.5;
        return { q, score };
      })
      .sort((a, b) => b.score - a.score)[0]?.q ?? null;

  return { cheapest, fastest, bestOverall };
}
