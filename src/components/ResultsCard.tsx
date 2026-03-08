import { type TransferResult, type Country } from "@/lib/remittance-data";
import { motion } from "framer-motion";
import { Clock, Shield, Star, TrendingDown } from "lucide-react";

interface ResultsCardProps {
  result: TransferResult;
  index: number;
  fromCountry: Country;
  toCountry: Country;
}

const tagConfig: Record<string, { label: string; icon: React.ReactNode; className: string }> = {
  recommended: { label: "Recommended", icon: <Star className="h-3 w-3" />, className: "gradient-accent text-accent-foreground" },
  "best-value": { label: "Best Value", icon: <TrendingDown className="h-3 w-3" />, className: "bg-success text-success-foreground" },
  fastest: { label: "Fastest", icon: <Clock className="h-3 w-3" />, className: "bg-warning text-warning-foreground" },
  "most-trusted": { label: "Most Trusted", icon: <Shield className="h-3 w-3" />, className: "bg-primary text-primary-foreground" },
};

export default function ResultsCard({ result, index, fromCountry, toCountry }: ResultsCardProps) {
  const isRecommended = result.tags.includes("recommended");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className={`rounded-2xl border border-border/70 p-5 md:p-6 transition-all ${
        isRecommended
          ? "bg-card ring-2 ring-accent shadow-accent"
          : "bg-card shadow-card hover:-translate-y-0.5 hover:shadow-card-hover"
      }`}
    >
      <div className="flex items-start justify-between mb-4 gap-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{result.provider.logo}</span>
          <div>
            <h3 className="font-heading font-bold text-foreground">{result.provider.name}</h3>
            <p className="text-xs text-muted-foreground">{result.provider.methods.join(" • ")}</p>
          </div>
        </div>
        <div className="flex flex-wrap justify-end gap-1.5">
          {result.tags.map((tag) => {
            const cfg = tagConfig[tag];
            if (!cfg) return null;
            return (
              <span key={tag} className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${cfg.className}`}>
                {cfg.icon} {cfg.label}
              </span>
            );
          })}
        </div>
      </div>

      <div className="mb-5">
        <p className="text-xs text-muted-foreground mb-1">Recipient receives</p>
        <p className="text-2xl md:text-3xl font-heading font-bold text-foreground">
          {toCountry.currencySymbol}
          {result.recipientReceives.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="panel-muted p-3">
          <p className="text-xs text-muted-foreground">Transfer fee</p>
          <p className="font-semibold text-foreground">
            {fromCountry.currencySymbol}
            {result.fee.toFixed(2)}
          </p>
        </div>
        <div className="panel-muted p-3">
          <p className="text-xs text-muted-foreground">Exchange rate</p>
          <p className="font-semibold text-foreground">1 = {result.fxRate.toFixed(4)}</p>
        </div>
        <div className="panel-muted p-3">
          <p className="text-xs text-muted-foreground">Total cost</p>
          <p className="font-semibold text-foreground">
            {fromCountry.currencySymbol}
            {result.totalCost.toFixed(2)}
          </p>
        </div>
        <div className="panel-muted p-3">
          <p className="text-xs text-muted-foreground">Delivery</p>
          <p className="font-semibold text-foreground flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            {result.provider.deliveryLabel}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs text-muted-foreground mb-2">Cost breakdown</p>
        <div className="flex h-2 rounded-full overflow-hidden bg-muted">
          <div
            className="bg-destructive transition-all"
            style={{ width: `${(result.fee / (result.fee + result.fxMargin)) * 100}%` }}
            title="Fee"
          />
          <div
            className="bg-warning transition-all"
            style={{ width: `${(result.fxMargin / (result.fee + result.fxMargin)) * 100}%` }}
            title="FX Margin"
          />
        </div>
        <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
          <span>
            Fee: {fromCountry.currencySymbol}
            {result.fee.toFixed(2)}
          </span>
          <span>
            FX margin: {fromCountry.currencySymbol}
            {result.fxMargin.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
          <div className="h-full rounded-full bg-success transition-all" style={{ width: `${result.provider.reliabilityScore}%` }} />
        </div>
        <span className="text-xs text-muted-foreground font-medium">{result.provider.reliabilityScore}% reliable</span>
      </div>
    </motion.div>
  );
}
