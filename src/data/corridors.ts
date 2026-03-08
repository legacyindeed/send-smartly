import type { Corridor } from "@/types/corridor";

export const corridors: Corridor[] = [
  {
    id: "US-GH",
    sendCountry: "US",
    receiveCountry: "GH",
    sendCurrency: "USD",
    receiveCurrency: "GHS",
    payoutMethods: ["bank", "mobile_money", "cash_pickup"],
    availableProviders: ["Wise", "Remitly", "WorldRemit", "LemFi", "Western Union", "TapTap Send"],
  },
];

export function getCorridorByCountries(sendCountry: string, receiveCountry: string): Corridor | undefined {
  return corridors.find((c) => c.sendCountry === sendCountry && c.receiveCountry === receiveCountry);
}
