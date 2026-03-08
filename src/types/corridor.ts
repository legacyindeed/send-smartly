import type { PayoutMethod } from "./quote";

export type Corridor = {
  id: string;
  sendCountry: "US" | "UK";
  receiveCountry: "GH" | "NG" | "KE" | "UG";
  sendCurrency: "USD" | "GBP";
  receiveCurrency: "GHS" | "NGN" | "KES" | "UGX";
  payoutMethods: PayoutMethod[];
  availableProviders: string[];
};
