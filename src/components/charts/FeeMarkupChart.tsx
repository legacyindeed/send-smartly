"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { Quote } from "@/types/quote";

type Props = { quotes: Quote[] };

export function FeeMarkupChart({ quotes }: Props) {
  const data = quotes.map((q) => ({
    provider: q.provider,
    totalDrag: Number((q.fee + (q.sendAmount * q.fxMarkupPercent) / 100).toFixed(2)),
  }));

  return (
    <div className="h-72 rounded-xl border border-white/10 bg-[#0d1720] p-4">
      <p className="text-sm text-slate-300">Total Cost Drag (Fee + Hidden FX)</p>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data}>
          <XAxis dataKey="provider" stroke="#8ea0af" fontSize={11} />
          <YAxis stroke="#8ea0af" fontSize={11} />
          <Tooltip cursor={{ fill: "rgba(255,255,255,0.05)" }} />
          <Bar dataKey="totalDrag" fill="#f97316" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
