import type { PriorityMode, Quote } from "@/types/quote";

function toHours(deliveryEstimate: string): number {
  const text = deliveryEstimate.toLowerCase();
  if (text.includes("minute")) return 0.2;
  if (text.includes("within 2")) return 2;
  if (text.includes("same day")) return 12;
  const hour = text.match(/(\d+)\s*hour/);
  if (hour) return Number(hour[1]);
  const day = text.match(/(\d+)\s*day/);
  if (day) return Number(day[1]) * 24;
  return 36;
}

export function attachQuoteMetrics(quotes: Quote[]): Quote[] {
  const sortedByRecipient = [...quotes].sort((a, b) => b.recipientAmount - a.recipientAmount);
  const worst = sortedByRecipient.at(-1);

  return quotes.map((quote) => {
    const tags: string[] = [];
    if (sortedByRecipient[0]?.provider === quote.provider) tags.push("most recipient gets");
    if ([...quotes].sort((a, b) => a.fee - b.fee)[0]?.provider === quote.provider) tags.push("cheapest fee");
    if ([...quotes].sort((a, b) => toHours(a.deliveryEstimate) - toHours(b.deliveryEstimate))[0]?.provider === quote.provider) tags.push("fastest");

    if (worst && quote.provider !== worst.provider) {
      const savings = quote.recipientAmount - worst.recipientAmount;
      if (savings > 0) tags.push(`+${savings.toFixed(2)} vs worst`);
    }

    return { ...quote, recommendationTags: tags };
  });
}

export function rankQuotes(quotes: Quote[], priority: PriorityMode) {
  const byRecipient = [...quotes].sort((a, b) => b.recipientAmount - a.recipientAmount);
  const byCheapest = [...quotes].sort((a, b) => a.fee - b.fee);
  const byFastest = [...quotes].sort((a, b) => toHours(a.deliveryEstimate) - toHours(b.deliveryEstimate));

  const bestOverall = [...quotes]
    .map((q) => ({
      quote: q,
      score:
        q.recipientAmount * 0.65 +
        q.trustScore * 0.2 -
        toHours(q.deliveryEstimate) * 0.12 -
        q.fee * 0.03,
    }))
    .sort((a, b) => b.score - a.score)[0]?.quote ?? null;

  const sortedByPriority =
    priority === "cheapest"
      ? byCheapest
      : priority === "fastest"
        ? byFastest
        : [...quotes].sort((a, b) => {
            const scoreA = a.recipientAmount * 0.7 + a.trustScore * 0.2 - toHours(a.deliveryEstimate) * 0.1;
            const scoreB = b.recipientAmount * 0.7 + b.trustScore * 0.2 - toHours(b.deliveryEstimate) * 0.1;
            return scoreB - scoreA;
          });

  return {
    sorted: sortedByPriority,
    cheapest: byCheapest[0] ?? null,
    fastest: byFastest[0] ?? null,
    bestOverall,
    mostRecipientGets: byRecipient[0] ?? null,
  };
}

export function buildInsights(quotes: Quote[], bestOverall: Quote | null, fastest: Quote | null, cheapest: Quote | null) {
  const summaries: string[] = [];
  if (bestOverall) {
    summaries.push(
      `${bestOverall.provider} leads overall by combining strong recipient payout with a competitive fee and narrower FX spread.`
    );
  }

  if (fastest && fastest.provider !== bestOverall?.provider) {
    summaries.push(
      `${fastest.provider} is the fastest option, but speed comes with a payout tradeoff versus top value providers.`
    );
  }

  if (cheapest) {
    summaries.push(
      `${cheapest.provider} has the lowest explicit fee, but always compare hidden FX markup before deciding.`
    );
  }

  const worstMarkup = [...quotes].sort((a, b) => b.fxMarkupPercent - a.fxMarkupPercent)[0];

  const recommendation = bestOverall
    ? `${bestOverall.provider} is the best balanced recommendation for this transfer. It maximizes recipient value while staying credible on delivery reliability and total cost.`
    : "No recommendation available for this request.";

  const caution = worstMarkup
    ? `Watch ${worstMarkup.provider}: it has the widest embedded FX spread in this set, which can reduce recipient value even when fees look acceptable.`
    : "Always validate final rates before sending because quotes can shift quickly.";

  return { summaries: summaries.slice(0, 3), recommendation, caution };
}
