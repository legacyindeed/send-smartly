import type { Quote } from "@/types/quote";
import { formatMoney, formatPercent } from "@/lib/utils/formatting";

type Props = {
  quotes: Quote[];
};

function sourceBadge(quote: Quote) {
  if (quote.sourceType === "real") {
    return <span className="rounded-full bg-emerald-400/20 px-2 py-0.5 text-xs text-emerald-200">Real</span>;
  }

  if (quote.sourceType === "estimated") {
    return (
      <span
        className="rounded-full bg-amber-400/20 px-2 py-0.5 text-xs text-amber-200"
        title="This quote is modeled from observed provider pricing relative to the current Wise rate."
      >
        Estimated
      </span>
    );
  }

  return <span className="rounded-full bg-slate-400/20 px-2 py-0.5 text-xs text-slate-200">Fallback</span>;
}

export function ProviderCards({ quotes }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {quotes.map((quote) => (
        <article key={`${quote.provider}-${quote.payoutMethod}`} className="rounded-xl border border-white/10 bg-[#0e1821] p-4">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-medium text-white">{quote.provider}</h4>
            {sourceBadge(quote)}
          </div>
          <p className="mt-3 text-2xl font-semibold text-white">{formatMoney(quote.recipientAmount, quote.receiveCurrency)}</p>
          <p className="text-xs text-slate-400">Recipient amount</p>
          <div className="mt-3 space-y-1 text-sm text-slate-300">
            <p>Fee: {formatMoney(quote.fee, quote.sendCurrency)}</p>
            <p>Rate: {quote.exchangeRate.toFixed(4)}</p>
            <p>FX markup: {formatPercent(quote.fxMarkupPercent)}</p>
            <p>Delivery: {quote.deliveryEstimate}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
