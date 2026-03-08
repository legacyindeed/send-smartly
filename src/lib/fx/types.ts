export type FxProviderResponse = {
  provider: string;
  base: string;
  rates: Record<string, number>;
  fetchedAt: string;
  sourceType: "real" | "fallback";
};
