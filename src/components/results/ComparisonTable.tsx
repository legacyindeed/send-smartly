import type { Quote } from "@/types/quote";
import { formatMoney, formatPercent } from "@/lib/utils/formatting";

type Props = { quotes: Quote[] };

function sourceBadge(q: Quote) {
  if (q.sourceType === "real") {
    return <span className="ml-2 rounded-full bg-emerald-400/20 px-2 py-0.5 text-[10px] text-emerald-200">Real</span>;
  }

  if (q.sourceType === "estimated") {
    return (
      <span
        className="ml-2 rounded-full bg-amber-400/20 px-2 py-0.5 text-[10px] text-amber-200"
        title="This quote is modeled from observed provider pricing relative to the current Wise rate."
      >
        Estimated
      </span>
    );
  }

  return <span className="ml-2 rounded-full bg-slate-400/20 px-2 py-0.5 text-[10px] text-slate-200">Fallback</span>;
}

export function ComparisonTable({ quotes }: Props) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0d1720]">
      <table className="min-w-[920px] w-full text-sm">
        <thead className="bg-white/5 text-slate-300">
          <tr>
            <th className="px-4 py-3 text-left">Provider</th>
            <th className="px-4 py-3 text-right">Fee</th>
            <th className="px-4 py-3 text-right">Provider Rate</th>
            <th className="px-4 py-3 text-right">Mid-Market</th>
            <th className="px-4 py-3 text-right" title="Difference between provider rate and mid-market rate">FX Markup</th>
            <th className="px-4 py-3 text-right" title="Recipient amount divided by sender amount">Effective Rate</th>
            <th className="px-4 py-3 text-right">Recipient Gets</th>
            <th className="px-4 py-3 text-left">Speed</th>
          </tr>
        </thead>
        <tbody>
          {quotes.map((q) => (
            <tr key={`${q.provider}-${q.payoutMethod}`} className="border-t border-white/10 text-slate-100">
              <td className="px-4 py-3">
                {q.provider}
                {sourceBadge(q)}
              </td>
              <td className="px-4 py-3 text-right">{formatMoney(q.fee, q.sendCurrency)}</td>
              <td className="px-4 py-3 text-right">{q.exchangeRate.toFixed(4)}</td>
              <td className="px-4 py-3 text-right">{q.midMarketRate.toFixed(4)}</td>
              <td className="px-4 py-3 text-right">{formatPercent(q.fxMarkupPercent)}</td>
              <td className="px-4 py-3 text-right">{q.effectiveRate.toFixed(4)}</td>
              <td className="px-4 py-3 text-right font-semibold">{formatMoney(q.recipientAmount, q.receiveCurrency)}</td>
              <td className="px-4 py-3">{q.deliveryEstimate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
