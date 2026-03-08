import { type TransferResult, type Country } from "@/lib/remittance-data";
import { motion } from "framer-motion";
import { PiggyBank } from "lucide-react";

interface CostSavingsProps {
  results: TransferResult[];
  fromCountry: Country;
  toCountry: Country;
}

export default function CostSavings({ results, fromCountry, toCountry }: CostSavingsProps) {
  if (results.length < 2) return null;

  const best = results[0];
  const worst = results[results.length - 1];
  const savingsCost = worst.totalCost - best.totalCost;
  const savingsReceived = best.recipientReceives - worst.recipientReceives;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="rounded-3xl gradient-hero text-primary-foreground p-6 md:p-8 shadow-card"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-xl bg-accent/20 flex items-center justify-center">
          <PiggyBank className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h3 className="font-heading text-lg font-bold">Your Savings</h3>
          <p className="text-sm opacity-70">By choosing {best.provider.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl bg-primary-foreground/10 p-4 border border-primary-foreground/15">
          <p className="text-sm opacity-70 mb-1">You save</p>
          <p className="text-2xl md:text-3xl font-heading font-bold">
            {fromCountry.currencySymbol}{savingsCost.toFixed(2)}
          </p>
          <p className="text-xs opacity-60 mt-1">vs {worst.provider.name}</p>
        </div>
        <div className="rounded-xl bg-primary-foreground/10 p-4 border border-primary-foreground/15">
          <p className="text-sm opacity-70 mb-1">Recipient gets more</p>
          <p className="text-2xl md:text-3xl font-heading font-bold">
            +{toCountry.currencySymbol}{savingsReceived.toFixed(2)}
          </p>
          <p className="text-xs opacity-60 mt-1">extra received</p>
        </div>
      </div>
    </motion.div>
  );
}
