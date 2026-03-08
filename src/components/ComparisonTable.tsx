import { type TransferResult, type Country } from "@/lib/remittance-data";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

interface ComparisonTableProps {
  results: TransferResult[];
  fromCountry: Country;
  toCountry: Country;
}

export default function ComparisonTable({ results, fromCountry, toCountry }: ComparisonTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-2xl bg-card shadow-card overflow-hidden"
    >
      <div className="p-6 border-b border-border">
        <h3 className="font-heading text-lg font-bold text-foreground">Full Comparison</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left px-6 py-3 font-medium text-muted-foreground">Provider</th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">Fee</th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">Rate</th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">Total Cost</th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">Received</th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">Delivery</th>
              <th className="text-center px-4 py-3 font-medium text-muted-foreground">Tags</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => {
              const isRec = r.tags.includes("recommended");
              return (
                <tr key={r.provider.id} className={`border-b border-border last:border-0 transition-colors ${isRec ? "bg-accent/5" : "hover:bg-muted/20"}`}>
                  <td className="px-6 py-4 font-medium text-foreground">
                    <span className="mr-2">{r.provider.logo}</span>
                    {r.provider.name}
                  </td>
                  <td className="text-right px-4 py-4 text-foreground">{fromCountry.currencySymbol}{r.fee.toFixed(2)}</td>
                  <td className="text-right px-4 py-4 text-foreground">{r.fxRate.toFixed(4)}</td>
                  <td className="text-right px-4 py-4 font-semibold text-foreground">{fromCountry.currencySymbol}{r.totalCost.toFixed(2)}</td>
                  <td className="text-right px-4 py-4 font-bold text-foreground">{toCountry.currencySymbol}{r.recipientReceives.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="text-right px-4 py-4 text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{r.provider.deliveryLabel}</span>
                  </td>
                  <td className="text-center px-4 py-4">
                    <div className="flex flex-wrap justify-center gap-1">
                      {r.tags.map(tag => (
                        <span key={tag} className={`text-[10px] font-semibold rounded-full px-2 py-0.5 ${
                          tag === "recommended" ? "gradient-accent text-accent-foreground" :
                          tag === "best-value" ? "bg-success/10 text-success" :
                          tag === "fastest" ? "bg-warning/10 text-warning" :
                          "bg-primary/10 text-primary"
                        }`}>
                          {tag.replace("-", " ")}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
