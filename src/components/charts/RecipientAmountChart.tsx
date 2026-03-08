"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { Quote } from "@/types/quote";

type Props = { quotes: Quote[] };

export function RecipientAmountChart({ quotes }: Props) {
  const data = quotes.map((q) => ({
    provider: q.provider,
    amount: Number(q.recipientAmount.toFixed(2)),
  }));

  return (
    <div className="h-72 rounded-xl border border-white/10 bg-[#0d1720] p-4">
      <p className="text-sm text-slate-300">Recipient Amount by Provider</p>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data}>
          <XAxis dataKey="provider" stroke="#8ea0af" fontSize={11} />
          <YAxis stroke="#8ea0af" fontSize={11} />
          <Tooltip cursor={{ fill: "rgba(255,255,255,0.05)" }} />
          <Bar dataKey="amount" fill="#34d399" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
