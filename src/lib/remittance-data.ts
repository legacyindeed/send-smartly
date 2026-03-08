export interface Country {
  code: string;
  name: string;
  currency: string;
  currencySymbol: string;
  flag: string;
}

export interface Provider {
  id: string;
  name: string;
  logo: string;
  feePercent: number;
  fxSpreadPercent: number;
  deliveryMinutes: number;
  deliveryLabel: string;
  methods: string[];
  reliabilityScore: number; // 1-100
  color: string;
}

export interface TransferResult {
  provider: Provider;
  fee: number;
  fxRate: number;
  midMarketRate: number;
  fxMargin: number;
  totalCost: number;
  recipientReceives: number;
  tags: string[];
}

export interface Corridor {
  from: string;
  to: string;
  label: string;
  avgCostPercent: number;
  avgDeliveryHours: number;
  popularProviders: string[];
  volume: string;
}

export const countries: Country[] = [
  { code: "US", name: "United States", currency: "USD", currencySymbol: "$", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", currency: "GBP", currencySymbol: "£", flag: "🇬🇧" },
  { code: "CA", name: "Canada", currency: "CAD", currencySymbol: "C$", flag: "🇨🇦" },
  { code: "DE", name: "Germany", currency: "EUR", currencySymbol: "€", flag: "🇩🇪" },
  { code: "GH", name: "Ghana", currency: "GHS", currencySymbol: "₵", flag: "🇬🇭" },
  { code: "NG", name: "Nigeria", currency: "NGN", currencySymbol: "₦", flag: "🇳🇬" },
  { code: "KE", name: "Kenya", currency: "KES", currencySymbol: "KSh", flag: "🇰🇪" },
  { code: "IN", name: "India", currency: "INR", currencySymbol: "₹", flag: "🇮🇳" },
  { code: "PH", name: "Philippines", currency: "PHP", currencySymbol: "₱", flag: "🇵🇭" },
  { code: "MX", name: "Mexico", currency: "MXN", currencySymbol: "MX$", flag: "🇲🇽" },
];

// Mid-market rates (base: USD)
export const midMarketRates: Record<string, number> = {
  USD: 1,
  GBP: 0.79,
  CAD: 1.36,
  EUR: 0.92,
  GHS: 14.5,
  NGN: 1550,
  KES: 153,
  INR: 83.2,
  PHP: 56.1,
  MXN: 17.2,
};

export const providers: Provider[] = [
  {
    id: "wise",
    name: "Wise",
    logo: "💚",
    feePercent: 1.1,
    fxSpreadPercent: 0.4,
    deliveryMinutes: 1440,
    deliveryLabel: "1 day",
    methods: ["Bank transfer"],
    reliabilityScore: 95,
    color: "hsl(152 60% 45%)",
  },
  {
    id: "western-union",
    name: "Western Union",
    logo: "🟡",
    feePercent: 3.5,
    fxSpreadPercent: 2.0,
    deliveryMinutes: 15,
    deliveryLabel: "Minutes",
    methods: ["Cash pickup", "Bank transfer", "Mobile money"],
    reliabilityScore: 88,
    color: "hsl(45 100% 50%)",
  },
  {
    id: "remitly",
    name: "Remitly",
    logo: "🔵",
    feePercent: 1.5,
    fxSpreadPercent: 1.2,
    deliveryMinutes: 120,
    deliveryLabel: "2 hours",
    methods: ["Bank transfer", "Mobile money"],
    reliabilityScore: 90,
    color: "hsl(210 80% 50%)",
  },
  {
    id: "paypal-xoom",
    name: "PayPal Xoom",
    logo: "🟣",
    feePercent: 2.0,
    fxSpreadPercent: 1.8,
    deliveryMinutes: 60,
    deliveryLabel: "1 hour",
    methods: ["Bank transfer", "Cash pickup"],
    reliabilityScore: 85,
    color: "hsl(260 60% 50%)",
  },
  {
    id: "worldremit",
    name: "WorldRemit",
    logo: "🟢",
    feePercent: 1.8,
    fxSpreadPercent: 1.0,
    deliveryMinutes: 360,
    deliveryLabel: "6 hours",
    methods: ["Bank transfer", "Mobile money", "Airtime"],
    reliabilityScore: 87,
    color: "hsl(140 60% 45%)",
  },
  {
    id: "crypto",
    name: "Crypto (USDC/USDT)",
    logo: "🪙",
    feePercent: 0.5,
    fxSpreadPercent: 0.1,
    deliveryMinutes: 5,
    deliveryLabel: "Minutes",
    methods: ["Wallet transfer"],
    reliabilityScore: 72,
    color: "hsl(200 80% 55%)",
  },
];

export const corridors: Corridor[] = [
  { from: "US", to: "GH", label: "US → Ghana", avgCostPercent: 4.2, avgDeliveryHours: 6, popularProviders: ["Wise", "WorldRemit"], volume: "$2.1B/yr" },
  { from: "US", to: "NG", label: "US → Nigeria", avgCostPercent: 5.1, avgDeliveryHours: 4, popularProviders: ["Remitly", "Western Union"], volume: "$6.1B/yr" },
  { from: "GB", to: "KE", label: "UK → Kenya", avgCostPercent: 3.8, avgDeliveryHours: 3, popularProviders: ["Wise", "WorldRemit"], volume: "$1.8B/yr" },
  { from: "US", to: "IN", label: "US → India", avgCostPercent: 2.9, avgDeliveryHours: 12, popularProviders: ["Wise", "Remitly"], volume: "$12B/yr" },
  { from: "US", to: "MX", label: "US → Mexico", avgCostPercent: 3.5, avgDeliveryHours: 2, popularProviders: ["Wise", "Remitly"], volume: "$8.5B/yr" },
  { from: "US", to: "PH", label: "US → Philippines", avgCostPercent: 3.2, avgDeliveryHours: 8, popularProviders: ["Remitly", "Western Union"], volume: "$4.2B/yr" },
];

export type OptimizationMode = "cheapest" | "fastest" | "balanced";

function getMidMarketCrossRate(fromCurrency: string, toCurrency: string): number {
  const fromUsd = midMarketRates[fromCurrency] || 1;
  const toUsd = midMarketRates[toCurrency] || 1;
  return toUsd / fromUsd;
}

export function calculateTransfer(
  fromCountry: Country,
  toCountry: Country,
  amount: number,
  mode: OptimizationMode
): TransferResult[] {
  const midRate = getMidMarketCrossRate(fromCountry.currency, toCountry.currency);

  const results: TransferResult[] = providers.map((provider) => {
    // Add some randomness per corridor for realism
    const seed = (fromCountry.code.charCodeAt(0) + toCountry.code.charCodeAt(0) + provider.id.length) % 10;
    const feeVariance = 1 + (seed - 5) * 0.05;
    const spreadVariance = 1 + (seed - 3) * 0.08;

    const effectiveFeePercent = Math.max(0.1, provider.feePercent * feeVariance);
    const effectiveSpread = Math.max(0, provider.fxSpreadPercent * spreadVariance);

    const fee = amount * (effectiveFeePercent / 100);
    const afterFee = amount - fee;
    const fxRate = midRate * (1 - effectiveSpread / 100);
    const recipientReceives = afterFee * fxRate;
    const fxMargin = amount * (effectiveSpread / 100) * midRate;
    const totalCost = fee + (amount * effectiveSpread / 100);

    return {
      provider,
      fee: Math.round(fee * 100) / 100,
      fxRate: Math.round(fxRate * 10000) / 10000,
      midMarketRate: Math.round(midRate * 10000) / 10000,
      fxMargin: Math.round(fxMargin * 100) / 100,
      totalCost: Math.round(totalCost * 100) / 100,
      recipientReceives: Math.round(recipientReceives * 100) / 100,
      tags: [],
    };
  });

  // Sort and tag
  const byValue = [...results].sort((a, b) => a.totalCost - b.totalCost);
  const bySpeed = [...results].sort((a, b) => a.provider.deliveryMinutes - b.provider.deliveryMinutes);
  const byTrust = [...results].sort((a, b) => b.provider.reliabilityScore - a.provider.reliabilityScore);

  byValue[0].tags.push("best-value");
  bySpeed[0].tags.push("fastest");
  byTrust[0].tags.push("most-trusted");

  // Sort by mode
  if (mode === "cheapest") {
    results.sort((a, b) => a.totalCost - b.totalCost);
  } else if (mode === "fastest") {
    results.sort((a, b) => a.provider.deliveryMinutes - b.provider.deliveryMinutes);
  } else {
    // balanced: weighted score
    results.sort((a, b) => {
      const scoreA = a.totalCost * 0.5 + a.provider.deliveryMinutes * 0.003 + (100 - a.provider.reliabilityScore) * 0.2;
      const scoreB = b.totalCost * 0.5 + b.provider.deliveryMinutes * 0.003 + (100 - b.provider.reliabilityScore) * 0.2;
      return scoreA - scoreB;
    });
  }

  // Mark top result as recommended
  results[0].tags.push("recommended");

  return results;
}

export function generateInsight(results: TransferResult[], amount: number, fromCurrency: string, toCurrency: string): string[] {
  const recommended = results.find(r => r.tags.includes("recommended"));
  const worst = results[results.length - 1];
  if (!recommended || !worst) return [];

  const savings = worst.totalCost - recommended.totalCost;
  const moreReceived = recommended.recipientReceives - worst.recipientReceives;

  const insights: string[] = [];

  insights.push(
    `${recommended.provider.name} offers the best overall value for this transfer. The FX spread is lower than competitors, resulting in the recipient receiving ${toCurrency} ${Math.abs(moreReceived).toFixed(2)} more than the most expensive option.`
  );

  if (savings > 1) {
    insights.push(
      `You save ${fromCurrency} ${savings.toFixed(2)} compared to ${worst.provider.name} by choosing ${recommended.provider.name}.`
    );
  }

  const highSpread = results.filter(r => ((r.midMarketRate - r.fxRate) / r.midMarketRate) * 100 > 1.5);
  if (highSpread.length > 0) {
    insights.push(
      `⚠️ Watch out for high FX margins with ${highSpread.map(r => r.provider.name).join(", ")}. Their exchange rates are significantly worse than the mid-market rate.`
    );
  }

  insights.push(
    "💡 Tip: Sending larger amounts often reduces the percentage fee. Consider batching smaller transfers when possible."
  );

  return insights;
}
