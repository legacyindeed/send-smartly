import { useState } from "react";
import { type Country, type OptimizationMode, type TransferResult, calculateTransfer, generateInsight } from "@/lib/remittance-data";
import CalculatorForm from "@/components/CalculatorForm";
import ResultsCard from "@/components/ResultsCard";
import ComparisonTable from "@/components/ComparisonTable";
import AIInsightPanel from "@/components/AIInsightPanel";
import CostSavings from "@/components/CostSavings";
import CorridorInsights from "@/components/CorridorInsights";
import TransferHistory from "@/components/TransferHistory";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, BadgeDollarSign, Sparkles, Zap } from "lucide-react";

export default function Index() {
  const [results, setResults] = useState<TransferResult[] | null>(null);
  const [insights, setInsights] = useState<string[]>([]);
  const [fromCountry, setFromCountry] = useState<Country | null>(null);
  const [toCountry, setToCountry] = useState<Country | null>(null);

  const handleCalculate = (from: Country, to: Country, amount: number, mode: OptimizationMode) => {
    const res = calculateTransfer(from, to, amount, mode);
    setResults(res);
    setInsights(generateInsight(res, amount, from.currency, to.currency));
    setFromCountry(from);
    setToCountry(to);
  };

  return (
    <div className="page-shell min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b border-border/80 bg-background/92 backdrop-blur-sm">
        <div className="container max-w-6xl mx-auto px-4 py-4 md:py-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl gradient-accent flex items-center justify-center shadow-accent">
              <Zap className="h-4 w-4 text-accent-foreground" />
            </div>
            <div>
              <p className="section-kicker">Send Smartly</p>
              <h1 className="font-heading text-[1.05rem] leading-none text-foreground">Remittance Intelligence Desk</h1>
            </div>
          </div>
          <p className="text-sm text-muted-foreground hidden lg:block">Compare costs, speed, and payout value before you send.</p>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-8 md:py-10 space-y-8 md:space-y-10">
        <motion.section
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl gradient-hero text-primary-foreground p-6 md:p-9 shadow-card"
        >
          <div className="grid lg:grid-cols-[1.25fr_0.75fr] gap-6 md:gap-8 items-start">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] opacity-70 mb-3">Transfer Planning</p>
              <h2 className="font-heading text-3xl md:text-4xl leading-[1.04] mb-4">
                Decide before you send.
                <br />
                Not after the fees hit.
              </h2>
              <p className="text-sm md:text-base text-primary-foreground/80 max-w-2xl leading-relaxed">
                Benchmark provider fees, FX rates, and delivery windows in one workflow so teams and households can pick
                the option with the best final payout.
              </p>
            </div>

            <div className="glass-panel rounded-2xl border border-white/20 p-4 md:p-5 text-foreground shadow-card">
              <p className="section-kicker mb-2">What This View Solves</p>
              <ul className="space-y-2.5 text-sm leading-relaxed">
                <li className="flex items-start gap-2"><Sparkles className="h-4 w-4 mt-0.5 text-accent" />Transparent provider ranking by effective cost.</li>
                <li className="flex items-start gap-2"><BadgeDollarSign className="h-4 w-4 mt-0.5 text-accent" />Clear visibility into FX margin versus transfer fee.</li>
                <li className="flex items-start gap-2"><ArrowRight className="h-4 w-4 mt-0.5 text-accent" />Faster routing decisions for frequent corridors.</li>
              </ul>
            </div>
          </div>
        </motion.section>

        <CalculatorForm onCalculate={handleCalculate} />

        <AnimatePresence>
          {results && fromCountry && toCountry && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <CostSavings results={results} fromCountry={fromCountry} toCountry={toCountry} />

              <div>
                <p className="section-kicker mb-2">Ranked Results</p>
                <h3 className="font-heading text-2xl text-foreground mb-5">Provider Scoreboard</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.map((r, i) => (
                    <ResultsCard key={r.provider.id} result={r} index={i} fromCountry={fromCountry} toCountry={toCountry} />
                  ))}
                </div>
              </div>

              <ComparisonTable results={results} fromCountry={fromCountry} toCountry={toCountry} />

              <AIInsightPanel insights={insights} />
            </motion.div>
          )}
        </AnimatePresence>

        <CorridorInsights />

        <TransferHistory />
      </main>

      <footer className="border-t border-border mt-12 py-8 bg-card/45">
        <div className="container max-w-6xl mx-auto px-4 text-center text-sm text-muted-foreground space-y-1">
          <p>Send Smartly - Demo environment with simulated pricing data for product preview.</p>
          <p>Not financial advice. Validate rates and fees with providers before transacting.</p>
        </div>
      </footer>
    </div>
  );
}
