import type { QuoteResponse } from "@/types/quote";

type Props = {
  insights: QuoteResponse["insights"];
};

export function InsightsPanel({ insights }: Props) {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#0d1720] p-5">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Insight Brief</p>
      <h3 className="mt-2 text-xl font-semibold text-white">AI-style Summary (rules-based)</h3>

      <ul className="mt-4 space-y-2 text-sm text-slate-200">
        {insights.summaries.map((s, i) => (
          <li key={i} className="rounded-lg border border-white/10 bg-white/5 p-3">
            {s}
          </li>
        ))}
      </ul>

      <div className="mt-4 rounded-lg border border-emerald-300/20 bg-emerald-500/10 p-3 text-sm text-emerald-100">
        <p className="font-medium">Recommendation</p>
        <p className="mt-1">{insights.recommendation}</p>
      </div>

      <div className="mt-3 rounded-lg border border-amber-300/20 bg-amber-500/10 p-3 text-sm text-amber-100">
        <p className="font-medium">Caution</p>
        <p className="mt-1">{insights.caution}</p>
      </div>
    </section>
  );
}
