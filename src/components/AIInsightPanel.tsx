import { motion } from "framer-motion";
import { Lightbulb, AlertTriangle, TrendingUp } from "lucide-react";

interface AIInsightPanelProps {
  insights: string[];
}

export default function AIInsightPanel({ insights }: AIInsightPanelProps) {
  if (insights.length === 0) return null;

  const getIcon = (text: string) => {
    if (text.startsWith("⚠️")) return <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />;
    if (text.startsWith("💡")) return <Lightbulb className="h-4 w-4 text-accent shrink-0 mt-0.5" />;
    return <TrendingUp className="h-4 w-4 text-success shrink-0 mt-0.5" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="rounded-2xl bg-card shadow-card p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="h-8 w-8 rounded-lg gradient-accent flex items-center justify-center">
          <Lightbulb className="h-4 w-4 text-accent-foreground" />
        </div>
        <h3 className="font-heading text-lg font-bold text-foreground">AI Insights</h3>
      </div>

      <div className="space-y-3">
        {insights.map((insight, i) => (
          <div key={i} className="flex gap-3 rounded-xl bg-muted/50 p-4">
            {getIcon(insight)}
            <p className="text-sm text-foreground leading-relaxed">{insight.replace(/^[⚠️💡]\s*/, "")}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
