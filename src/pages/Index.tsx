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
import { ArrowDown, Zap } from "lucide-react";

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg gradient-accent flex items-center justify-center">
              <Zap className="h-4 w-4 text-accent-foreground" />
            </div>
            <h1 className="font-heading text-lg font-bold text-foreground">Smart Remittance Optimizer</h1>
          </div>
          <p className="text-sm text-muted-foreground hidden sm:block">Find the cheapest way to send money abroad</p>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl mx-auto mb-4"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
            Send money smarter, not harder
          </h2>
          <p className="text-muted-foreground text-lg">
            Compare 6+ providers instantly. Save on fees and get the best exchange rates.
          </p>
        </motion.div>

        {/* Calculator */}
        <CalculatorForm onCalculate={handleCalculate} />

        {/* Results */}
        <AnimatePresence>
          {results && fromCountry && toCountry && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              {/* Savings banner */}
              <CostSavings results={results} fromCountry={fromCountry} toCountry={toCountry} />

              {/* Cards grid */}
              <div>
                <h3 className="font-heading text-xl font-bold text-foreground mb-4">Provider Results</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.map((r, i) => (
                    <ResultsCard key={r.provider.id} result={r} index={i} fromCountry={fromCountry} toCountry={toCountry} />
                  ))}
                </div>
              </div>

              {/* Comparison table */}
              <ComparisonTable results={results} fromCountry={fromCountry} toCountry={toCountry} />

              {/* AI Insights */}
              <AIInsightPanel insights={insights} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Corridor Insights */}
        <CorridorInsights />

        {/* Transfer History */}
        <TransferHistory />
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12 py-8">
        <div className="container max-w-6xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Smart Remittance Optimizer — Demo product with simulated data. Not financial advice.</p>
        </div>
      </footer>
    </div>
  );
}
