import { useState } from "react";
import { countries, type Country, type OptimizationMode } from "@/lib/remittance-data";
import { motion } from "framer-motion";
import { ArrowRight, Zap, DollarSign, Scale } from "lucide-react";

interface CalculatorFormProps {
  onCalculate: (from: Country, to: Country, amount: number, mode: OptimizationMode) => void;
}

const modes: { value: OptimizationMode; label: string; icon: React.ReactNode; desc: string }[] = [
  { value: "cheapest", label: "Cheapest", icon: <DollarSign className="h-4 w-4" />, desc: "Lowest total cost" },
  { value: "fastest", label: "Fastest", icon: <Zap className="h-4 w-4" />, desc: "Quickest delivery" },
  { value: "balanced", label: "Balanced", icon: <Scale className="h-4 w-4" />, desc: "Best overall" },
];

export default function CalculatorForm({ onCalculate }: CalculatorFormProps) {
  const [fromCode, setFromCode] = useState("US");
  const [toCode, setToCode] = useState("NG");
  const [amount, setAmount] = useState(1000);
  const [mode, setMode] = useState<OptimizationMode>("balanced");

  const fromCountry = countries.find(c => c.code === fromCode)!;
  const toCountry = countries.find(c => c.code === toCode)!;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate(fromCountry, toCountry, amount, mode);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl bg-card shadow-card p-6 md:p-8"
    >
      <h2 className="font-heading text-xl font-bold text-foreground mb-6">Compare Remittance Providers</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Country selectors */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-end">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Sending from</label>
            <select
              value={fromCode}
              onChange={(e) => setFromCode(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {countries.map(c => (
                <option key={c.code} value={c.code}>{c.flag} {c.name} ({c.currency})</option>
              ))}
            </select>
          </div>

          <div className="hidden md:flex items-center justify-center pt-6">
            <div className="h-10 w-10 rounded-full gradient-accent flex items-center justify-center">
              <ArrowRight className="h-5 w-5 text-accent-foreground" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Sending to</label>
            <select
              value={toCode}
              onChange={(e) => setToCode(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {countries.map(c => (
                <option key={c.code} value={c.code}>{c.flag} {c.name} ({c.currency})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Amount */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">Amount ({fromCountry.currency})</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">{fromCountry.currencySymbol}</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              min={1}
              className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-3 text-foreground font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {/* Mode selector */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-3 block">Optimization preference</label>
          <div className="grid grid-cols-3 gap-3">
            {modes.map(m => (
              <button
                type="button"
                key={m.value}
                onClick={() => setMode(m.value)}
                className={`rounded-xl border-2 p-3 text-center transition-all ${
                  mode === m.value
                    ? "border-accent bg-accent/10 shadow-accent"
                    : "border-border hover:border-muted-foreground/30"
                }`}
              >
                <div className={`flex items-center justify-center gap-1.5 font-heading font-semibold text-sm ${mode === m.value ? "text-accent" : "text-foreground"}`}>
                  {m.icon}
                  {m.label}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{m.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-xl gradient-accent py-4 text-accent-foreground font-heading font-bold text-lg transition-all hover:shadow-accent hover:scale-[1.01] active:scale-[0.99]"
        >
          Compare Providers
        </button>
      </form>
    </motion.div>
  );
}
