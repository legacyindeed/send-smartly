export function CorridorExplainer() {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#0d1720] p-5 text-sm text-slate-300">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">How Pricing Works</p>
      <h3 className="mt-2 text-xl font-semibold text-white">Fee is visible. FX markup is often hidden.</h3>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <article className="rounded-lg border border-white/10 bg-white/5 p-3">
          <p className="font-medium text-white">Transfer Fee</p>
          <p className="mt-1">The explicit charge shown before sending. Usually flat + percentage.</p>
        </article>
        <article className="rounded-lg border border-white/10 bg-white/5 p-3">
          <p className="font-medium text-white">FX Markup</p>
          <p className="mt-1">The spread between provider rate and mid-market rate. This can quietly reduce payout.</p>
        </article>
        <article className="rounded-lg border border-white/10 bg-white/5 p-3">
          <p className="font-medium text-white">Effective Value</p>
          <p className="mt-1">Recipient amount after all pricing effects. This is the truest comparison metric.</p>
        </article>
      </div>
    </section>
  );
}
