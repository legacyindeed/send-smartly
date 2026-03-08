"use client";

import { RadialBar, RadialBarChart, ResponsiveContainer, Tooltip } from "recharts";
import type { Quote } from "@/types/quote";

type Props = { quotes: Quote[] };

export function RankingChart({ quotes }: Props) {
  const max = Math.max(...quotes.map((q) => q.recipientAmount));
  const data = quotes.map((q) => ({
    name: q.provider,
    score: Math.round((q.recipientAmount / max) * 100),
    fill: q.sourceType === "real" ? "#10b981" : q.sourceType === "estimated" ? "#60a5fa" : "#94a3b8",
  }));

  return (
    <div className="h-72 rounded-xl border border-white/10 bg-[#0d1720] p-4">
      <p className="text-sm text-slate-300">Relative Value Score</p>
      <ResponsiveContainer width="100%" height="90%">
        <RadialBarChart cx="50%" cy="50%" innerRadius="15%" outerRadius="95%" data={data} startAngle={180} endAngle={0}>
          <Tooltip />
          <RadialBar dataKey="score" label={{ fill: "#cbd5e1", fontSize: 11 }} />
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  );
}
