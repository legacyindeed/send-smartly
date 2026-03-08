import { motion } from "framer-motion";
import { History, ArrowRight } from "lucide-react";

interface HistoryEntry {
  id: string;
  date: string;
  from: string;
  to: string;
  amount: string;
  bestProvider: string;
  saved: string;
}

const mockHistory: HistoryEntry[] = [
  { id: "1", date: "Mar 5, 2026", from: "🇺🇸 US", to: "🇳🇬 Nigeria", amount: "$1,000", bestProvider: "Wise", saved: "$32" },
  { id: "2", date: "Feb 28, 2026", from: "🇬🇧 UK", to: "🇰🇪 Kenya", amount: "£500", bestProvider: "Wise", saved: "£18" },
  { id: "3", date: "Feb 15, 2026", from: "🇺🇸 US", to: "🇮🇳 India", amount: "$2,000", bestProvider: "Remitly", saved: "$45" },
  { id: "4", date: "Feb 1, 2026", from: "🇺🇸 US", to: "🇬🇭 Ghana", amount: "$750", bestProvider: "Crypto", saved: "$28" },
];

export default function TransferHistory() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-2xl bg-card shadow-card p-6"
    >
      <div className="flex items-center gap-2 mb-5">
        <History className="h-5 w-5 text-accent" />
        <h3 className="font-heading text-lg font-bold text-foreground">Recent Comparisons</h3>
      </div>

      <div className="space-y-3">
        {mockHistory.map((entry, i) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="flex items-center justify-between rounded-xl border border-border p-4 hover:shadow-card transition-all"
          >
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground w-20">{entry.date}</span>
              <span className="text-sm font-medium text-foreground">
                {entry.from} <ArrowRight className="inline h-3 w-3 text-muted-foreground mx-1" /> {entry.to}
              </span>
              <span className="text-sm font-semibold text-foreground">{entry.amount}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="text-muted-foreground">via <span className="font-medium text-foreground">{entry.bestProvider}</span></span>
              <span className="rounded-full bg-success/10 text-success px-2.5 py-0.5 text-xs font-semibold">Saved {entry.saved}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
