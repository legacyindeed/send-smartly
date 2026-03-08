import type { PayoutMethod } from "@/types/quote";

export type EstimatedProviderConfig = {
  provider: "WorldRemit" | "TapTap Send" | "LemFi" | "Remitly" | "Western Union";
  rateMultiplier: number;
  feeUsd: number;
  deliveryEstimate: string;
  payoutMethods: PayoutMethod[];
  trustScore: number;
  sourceType: "estimated";
};

// Manual recalibration note:
// multiplier = observedProviderRate / wiseRate
// Example:
// wiseRate = 10.7713
// worldRemitObserved = 10.7892
// multiplier = 10.7892 / 10.7713 = 1.0016618
export const estimatedProviderConfig: EstimatedProviderConfig[] = [
  {
    provider: "WorldRemit",
    rateMultiplier: 1.0016618,
    feeUsd: 0,
    deliveryEstimate: "Within 1 hour",
    payoutMethods: ["mobile_money", "bank"],
    trustScore: 86,
    sourceType: "estimated",
  },
  {
    provider: "TapTap Send",
    rateMultiplier: 1.0017361,
    feeUsd: 0,
    deliveryEstimate: "In minutes",
    payoutMethods: ["mobile_money"],
    trustScore: 84,
    sourceType: "estimated",
  },
  {
    provider: "LemFi",
    rateMultiplier: 1.0017361,
    feeUsd: 0,
    deliveryEstimate: "Usually within minutes",
    payoutMethods: ["wallet", "bank", "mobile_money"],
    trustScore: 82,
    sourceType: "estimated",
  },
  {
    provider: "Remitly",
    rateMultiplier: 1.0016618,
    feeUsd: 0,
    deliveryEstimate: "Within minutes",
    payoutMethods: ["mobile_money", "bank", "cash_pickup"],
    trustScore: 89,
    sourceType: "estimated",
  },
  {
    provider: "Western Union",
    rateMultiplier: 1.0017361,
    feeUsd: 0,
    deliveryEstimate: "In minutes",
    payoutMethods: ["bank", "cash_pickup", "mobile_money"],
    trustScore: 87,
    sourceType: "estimated",
  },
];
