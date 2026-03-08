import type { PayoutMethod } from "@/types/quote";

export type ProviderProfile = {
  name: string;
  trustScore: number;
  supports: PayoutMethod[];
  style: "value" | "speed" | "balanced" | "cash" | "mobile";
};

export const providerProfiles: ProviderProfile[] = [
  { name: "Wise", trustScore: 95, supports: ["bank"], style: "value" },
  { name: "Western Union", trustScore: 87, supports: ["cash_pickup", "bank", "mobile_money"], style: "cash" },
  { name: "TapTap Send", trustScore: 84, supports: ["mobile_money", "bank"], style: "mobile" },
  { name: "LemFi", trustScore: 82, supports: ["bank", "wallet", "mobile_money"], style: "mobile" },
  { name: "WorldRemit", trustScore: 86, supports: ["bank", "mobile_money", "cash_pickup"], style: "balanced" },
  { name: "Remitly", trustScore: 89, supports: ["bank", "mobile_money", "cash_pickup"], style: "speed" },
];
