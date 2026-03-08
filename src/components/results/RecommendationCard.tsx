import type { Quote } from "@/types/quote";
import { formatMoney, formatPercent } from "@/lib/utils/formatting";

type Props = {
  quote: Quote | null;
  title: string;
  subtitle: string;
};

export function RecommendationCard({ quote, title, subtitle }: Props) {
  if (!quote) return null;

  return (
    <article className="rounded-2xl border border-emerald-300/20 bg-gradient-to-br from-emerald-500/10 to-cyan-500/5 p-5">
      <p className="text-xs uppercase tracking-[0.18em] text-emerald-300">{title}</p>
      <h3 className="mt-2 text-2xl font-semibold text-white">{quote.provider}</h3>
      <p className="mt-1 text-sm text-slate-300">{subtitle}</p>
      <div className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
        <div className="rounded-lg border border-white/10 bg-white/5 p-3">
          <p className="text-slate-400">Recipient gets</p>
          <p className="font-semibold text-white">{formatMoney(quote.recipientAmount, quote.receiveCurrency)}</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/5 p-3">
          <p className="text-slate-400">Fee</p>
          <p className="font-semibold text-white">{formatMoney(quote.fee, quote.sendCurrency)}</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/5 p-3">
          <p className="text-slate-400">FX markup</p>
          <p className="font-semibold text-white">{formatPercent(quote.fxMarkupPercent)}</p>
        </div>
      </div>
    </article>
  );
}
