"use client";

import { useState } from "react";
import type { QuoteResponse } from "@/types/quote";
import { CompareForm, type CompareInput } from "@/components/form/CompareForm";
import { RecommendationCard } from "@/components/results/RecommendationCard";
import { ProviderCards } from "@/components/results/ProviderCards";
import { ComparisonTable } from "@/components/results/ComparisonTable";
import { RecipientAmountChart } from "@/components/charts/RecipientAmountChart";
import { FeeMarkupChart } from "@/components/charts/FeeMarkupChart";
import { RankingChart } from "@/components/charts/RankingChart";
import { InsightsPanel } from "@/components/insights/InsightsPanel";
import { CorridorExplainer } from "@/components/insights/CorridorExplainer";

export function ComparisonWorkspace() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<QuoteResponse | null>(null);

  async function handleCompare(input: CompareInput) {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? "Failed to compare providers");
      }

      const payload = (await response.json()) as QuoteResponse;
      setData(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-8 space-y-6">
      <CompareForm loading={loading} onSubmit={handleCompare} />

      {error && <div className="rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</div>}

      {!data && !loading && (
        <div className="rounded-2xl border border-white/10 bg-[#0d1720] p-8 text-center text-slate-300">
          Run a comparison to see ranked providers, hidden FX markup analysis, and recommendation insights.
        </div>
      )}

      {loading && (
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="h-36 animate-pulse rounded-xl border border-white/10 bg-[#0d1720]" />
          ))}
        </div>
      )}

      {data && (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <RecommendationCard quote={data.rankings.bestOverall} title="Best Overall" subtitle="Balanced for payout, trust, and speed" />
            <RecommendationCard quote={data.rankings.fastest} title="Fastest" subtitle="Best for urgent transfers" />
          </div>

          <ProviderCards quotes={data.quotes} />
          <ComparisonTable quotes={data.quotes} />

          <div className="grid gap-4 xl:grid-cols-3">
            <RecipientAmountChart quotes={data.quotes} />
            <FeeMarkupChart quotes={data.quotes} />
            <RankingChart quotes={data.quotes} />
          </div>

          <InsightsPanel insights={data.insights} />
          <CorridorExplainer />
        </>
      )}
    </div>
  );
}
