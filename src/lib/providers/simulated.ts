import type { Corridor } from "@/types/corridor";
import type { PayoutMethod, Quote } from "@/types/quote";
import { clamp, round } from "@/lib/utils/math";
import { normalizeQuote } from "./models";

type CorridorKey = "US-GH" | "US-NG" | "US-KE" | "US-UG" | "UK-GH" | "UK-KE";

type SimProvider = {
  provider: string;
  trustScore: number;
  baseFee: number;
  pctFee: number;
  payoutMethods: PayoutMethod[];
  baseSpeedHours: number;
  markupByCorridor: Record<CorridorKey, [number, number]>;
};

const assumptions: SimProvider[] = [
  {
    provider: "Western Union",
    trustScore: 87,
    baseFee: 4.9,
    pctFee: 0.0125,
    payoutMethods: ["cash_pickup", "bank", "mobile_money"],
    baseSpeedHours: 0.5,
    markupByCorridor: {
      "US-GH": [0.018, 0.028],
      "US-NG": [0.022, 0.034],
      "US-KE": [0.019, 0.03],
      "US-UG": [0.02, 0.032],
      "UK-GH": [0.017, 0.027],
      "UK-KE": [0.018, 0.028],
    },
  },
  {
    provider: "TapTap Send",
    trustScore: 84,
    baseFee: 1.9,
    pctFee: 0.0065,
    payoutMethods: ["mobile_money", "bank"],
    baseSpeedHours: 1.1,
    markupByCorridor: {
      "US-GH": [0.007, 0.013],
      "US-NG": [0.008, 0.014],
      "US-KE": [0.006, 0.012],
      "US-UG": [0.007, 0.013],
      "UK-GH": [0.007, 0.013],
      "UK-KE": [0.006, 0.012],
    },
  },
  {
    provider: "LemFi",
    trustScore: 82,
    baseFee: 1.6,
    pctFee: 0.0058,
    payoutMethods: ["bank", "wallet", "mobile_money"],
    baseSpeedHours: 1.8,
    markupByCorridor: {
      "US-GH": [0.006, 0.011],
      "US-NG": [0.005, 0.01],
      "US-KE": [0.006, 0.011],
      "US-UG": [0.007, 0.012],
      "UK-GH": [0.006, 0.011],
      "UK-KE": [0.006, 0.011],
    },
  },
  {
    provider: "WorldRemit",
    trustScore: 86,
    baseFee: 3.4,
    pctFee: 0.0095,
    payoutMethods: ["bank", "mobile_money", "cash_pickup"],
    baseSpeedHours: 5.5,
    markupByCorridor: {
      "US-GH": [0.012, 0.019],
      "US-NG": [0.014, 0.022],
      "US-KE": [0.012, 0.02],
      "US-UG": [0.013, 0.021],
      "UK-GH": [0.011, 0.018],
      "UK-KE": [0.012, 0.019],
    },
  },
  {
    provider: "Remitly",
    trustScore: 89,
    baseFee: 2.8,
    pctFee: 0.0088,
    payoutMethods: ["bank", "mobile_money", "cash_pickup"],
    baseSpeedHours: 1.6,
    markupByCorridor: {
      "US-GH": [0.01, 0.017],
      "US-NG": [0.011, 0.018],
      "US-KE": [0.009, 0.016],
      "US-UG": [0.011, 0.018],
      "UK-GH": [0.009, 0.016],
      "UK-KE": [0.009, 0.016],
    },
  },
];

function deterministicNoise(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash % 1000) / 1000;
}

function pickPayoutMethod(available: PayoutMethod[], requested?: PayoutMethod): PayoutMethod {
  if (requested && available.includes(requested)) return requested;
  return available[0] ?? "bank";
}

function payoutSpeedAdjustment(payoutMethod: PayoutMethod): number {
  if (payoutMethod === "cash_pickup") return -0.7;
  if (payoutMethod === "mobile_money") return -0.3;
  if (payoutMethod === "wallet") return -0.4;
  return 0;
}

function payoutFeeAdjustment(payoutMethod: PayoutMethod): number {
  if (payoutMethod === "cash_pickup") return 1.75;
  if (payoutMethod === "wallet") return -0.35;
  return 0;
}

function amountFeeDiscount(sendAmount: number): number {
  if (sendAmount >= 1000) return 1.15;
  if (sendAmount >= 500) return 0.6;
  return 0;
}

function deliveryLabel(hours: number): string {
  if (hours <= 0.5) return "Minutes";
  if (hours < 2) return "Within 2 hours";
  if (hours < 8) return `${Math.round(hours)} hours`;
  if (hours < 24) return "Same day";
  const days = Math.max(1, Math.round(hours / 24));
  return `${days} day${days > 1 ? "s" : ""}`;
}

export function generateSimulatedQuotes(params: {
  corridor: Corridor;
  sendAmount: number;
  midMarketRate: number;
  payoutMethod?: PayoutMethod;
}): Quote[] {
  return assumptions
    .filter((assumption) => params.corridor.availableProviders.includes(assumption.provider))
    .map((assumption) => {
      const corridorKey = `${params.corridor.sendCountry}-${params.corridor.receiveCountry}` as CorridorKey;
      const payoutMethod = pickPayoutMethod(assumption.payoutMethods, params.payoutMethod);

      const [minMarkup, maxMarkup] = assumption.markupByCorridor[corridorKey];
      const noise = deterministicNoise(`${assumption.provider}:${corridorKey}:${params.sendAmount}:${payoutMethod}`);
      const markup = minMarkup + (maxMarkup - minMarkup) * noise;

      const fee =
        assumption.baseFee +
        params.sendAmount * assumption.pctFee +
        payoutFeeAdjustment(payoutMethod) -
        amountFeeDiscount(params.sendAmount);

      const providerRate = round(params.midMarketRate * (1 - markup), 6);
      const hours = clamp(assumption.baseSpeedHours + payoutSpeedAdjustment(payoutMethod), 0.2, 48);

      return normalizeQuote({
        provider: assumption.provider,
        sendCountry: params.corridor.sendCountry,
        receiveCountry: params.corridor.receiveCountry,
        sendCurrency: params.corridor.sendCurrency,
        receiveCurrency: params.corridor.receiveCurrency,
        sendAmount: params.sendAmount,
        fee: round(Math.max(0, fee), 2),
        providerRate,
        midMarketRate: params.midMarketRate,
        deliveryEstimate: deliveryLabel(hours),
        payoutMethod,
        trustScore: assumption.trustScore,
        sourceType: "estimated",
      });
    });
}
