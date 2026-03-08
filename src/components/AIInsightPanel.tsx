import { motion } from "framer-motion";
import { AlertTriangle, Lightbulb, TrendingUp } from "lucide-react";

interface AIInsightPanelProps {
  insights: string[];
}

export default function AIInsightPanel({ insights }: AIInsightPanelProps) {
  if (insights.length === 0) return null;

  const normalized = insights.map((item) => {
    const clean = String(item || "").trim();
    if (/warning|risk|volatil|caution/i.test(clean)) {
      return { kind: "risk", text: clean };
    }
    if (/tip|consider|could|opportun|save/i.test(clean)) {
      return { kind: "tip", text: clean };
    }
    return { kind: "trend", text: clean };
  });

  const iconFor = (kind: string) => {
    if (kind === "risk") return <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />;
    if (kind === "tip") return <Lightbulb className="h-4 w-4 text-accent shrink-0 mt-0.5" />;
    return <TrendingUp className="h-4 w-4 text-success shrink-0 mt-0.5" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="section-shell p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="h-8 w-8 rounded-lg gradient-accent flex items-center justify-center">
          <Lightbulb className="h-4 w-4 text-accent-foreground" />
        </div>
        <h3 className="font-heading text-lg font-bold text-foreground">Decision Notes</h3>
      </div>

      <div className="space-y-3">
        {normalized.map((insight, i) => (
          <div key={i} className="flex gap-3 rounded-xl bg-muted/60 p-4 border border-border/60">
            {iconFor(insight.kind)}
            <p className="text-sm text-foreground leading-relaxed">{insight.text}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
