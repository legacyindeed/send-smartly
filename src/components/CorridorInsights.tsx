import { corridors } from "@/lib/remittance-data";
import { motion } from "framer-motion";
import { Globe, Clock, DollarSign, TrendingUp } from "lucide-react";

export default function CorridorInsights() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="section-shell p-6"
    >
      <div className="flex items-center gap-2 mb-5">
        <Globe className="h-5 w-5 text-accent" />
        <h3 className="font-heading text-xl font-bold text-foreground">Popular Corridors</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {corridors.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * i }}
            className="rounded-xl border border-border/70 bg-card p-4 hover:-translate-y-0.5 hover:shadow-card-hover transition-all"
          >
            <p className="font-heading font-bold text-foreground mb-2">{c.label}</p>
            <div className="space-y-1.5 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <DollarSign className="h-3 w-3" />
                <span>Avg cost: {c.avgCostPercent}%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3 w-3" />
                <span>Avg delivery: {c.avgDeliveryHours}h</span>
              </div>
              <div className="flex items-center gap-1.5">
                <TrendingUp className="h-3 w-3" />
                <span>Volume: {c.volume}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1 mt-3">
              {c.popularProviders.map(p => (
                <span key={p} className="text-[10px] font-medium bg-accent/10 text-accent rounded-full px-2 py-0.5">{p}</span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
