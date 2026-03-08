import { createHash } from "node:crypto";
import type { Quote } from "../models/quote";

export function quoteHash(quote: Quote): string {
  const stable = {
    provider: quote.provider,
    sendCountry: quote.sendCountry,
    receiveCountry: quote.receiveCountry,
    sendCurrency: quote.sendCurrency,
    receiveCurrency: quote.receiveCurrency,
    sendAmount: Number(quote.sendAmount.toFixed(2)),
    fee: Number(quote.fee.toFixed(2)),
    exchangeRate: Number(quote.exchangeRate.toFixed(6)),
    recipientAmount: Number(quote.recipientAmount.toFixed(2)),
    deliveryEstimate: quote.deliveryEstimate ?? null,
    payoutMethod: quote.payoutMethod ?? null,
    sourceUrl: quote.sourceUrl,
  };
  return createHash("sha256").update(JSON.stringify(stable)).digest("hex");
}
