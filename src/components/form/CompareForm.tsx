"use client";

import { useMemo, useState } from "react";
import { corridors } from "@/data/corridors";
import type { PriorityMode, PayoutMethod } from "@/types/quote";

export type CompareInput = {
  sendCountry: "US";
  receiveCountry: "GH";
  sendAmount: number;
  payoutMethod?: PayoutMethod;
  priority?: PriorityMode;
};

type Props = {
  loading: boolean;
  onSubmit: (value: CompareInput) => void;
};

export function CompareForm({ loading, onSubmit }: Props) {
  const [sendCountry] = useState<"US">("US");
  const [receiveCountry] = useState<"GH">("GH");
  const [sendAmount, setSendAmount] = useState(500);
  const [payoutMethod, setPayoutMethod] = useState<PayoutMethod | "">("");
  const [priority, setPriority] = useState<PriorityMode>("balanced");

  const corridor = useMemo(() => corridors.find((c) => c.sendCountry === "US" && c.receiveCountry === "GH"), []);

  const payoutMethods = corridor?.payoutMethods ?? ["bank", "mobile_money", "cash_pickup"];

  return (
    <form
      className="grid gap-4 rounded-2xl border border-white/10 bg-[#0c1319]/90 p-4 md:grid-cols-6 md:items-end"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          sendCountry,
          receiveCountry,
          sendAmount,
          payoutMethod: payoutMethod || undefined,
          priority,
        });
      }}
    >
      <label className="grid gap-1 text-sm md:col-span-1">
        <span className="text-xs uppercase tracking-wide text-slate-400">Send from</span>
        <select className="rounded-lg border border-white/10 bg-[#111b24] px-3 py-2" value={sendCountry} disabled>
          <option value="US">United States</option>
        </select>
      </label>

      <label className="grid gap-1 text-sm md:col-span-1">
        <span className="text-xs uppercase tracking-wide text-slate-400">Receive in</span>
        <select className="rounded-lg border border-white/10 bg-[#111b24] px-3 py-2" value={receiveCountry} disabled>
          <option value="GH">Ghana</option>
        </select>
      </label>

      <label className="grid gap-1 text-sm md:col-span-1">
        <span className="text-xs uppercase tracking-wide text-slate-400">Amount</span>
        <input
          type="number"
          min={50}
          step={50}
          className="rounded-lg border border-white/10 bg-[#111b24] px-3 py-2"
          value={sendAmount}
          onChange={(e) => setSendAmount(Number(e.target.value) || 0)}
        />
      </label>

      <label className="grid gap-1 text-sm md:col-span-1">
        <span className="text-xs uppercase tracking-wide text-slate-400">Payout method</span>
        <select className="rounded-lg border border-white/10 bg-[#111b24] px-3 py-2" value={payoutMethod} onChange={(e) => setPayoutMethod(e.target.value as PayoutMethod | "") }>
          <option value="">Any</option>
          {payoutMethods.map((method) => (
            <option key={method} value={method}>
              {method.replace("_", " ")}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-1 text-sm md:col-span-1">
        <span className="text-xs uppercase tracking-wide text-slate-400">Priority</span>
        <select className="rounded-lg border border-white/10 bg-[#111b24] px-3 py-2" value={priority} onChange={(e) => setPriority(e.target.value as PriorityMode)}>
          <option value="balanced">Balanced</option>
          <option value="cheapest">Cheapest</option>
          <option value="fastest">Fastest</option>
        </select>
      </label>

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-gradient-to-r from-emerald-400 to-teal-500 px-4 py-2 font-semibold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 md:col-span-1"
      >
        {loading ? "Comparing..." : "Compare"}
      </button>
    </form>
  );
}
