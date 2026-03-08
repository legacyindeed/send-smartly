const symbols: Record<string, string> = {
  USD: "$",
  GBP: "£",
  GHS: "GH₵",
  NGN: "₦",
  KES: "KSh",
  UGX: "USh",
};

export function currencySymbol(code: string): string {
  return symbols[code] ?? code;
}
