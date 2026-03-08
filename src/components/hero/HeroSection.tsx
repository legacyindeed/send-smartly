export function HeroSection() {
  return (
    <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#0f1720] via-[#101a26] to-[#122235] p-8 shadow-2xl shadow-black/30">
      <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Smart Remittance Optimizer</p>
      <h1 className="mt-3 max-w-3xl text-4xl font-semibold text-white md:text-5xl">
        Compare real and modeled remittance quotes with full fee and hidden FX transparency.
      </h1>
      <p className="mt-4 max-w-2xl text-slate-300">
        Mid-market FX baseline, Wise real integration when credentials are present, and realistic provider simulation for actionable corridor decisions.
      </p>
    </section>
  );
}
