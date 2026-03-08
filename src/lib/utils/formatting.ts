import { currencySymbol } from "./currency";

export function formatMoney(amount: number, currency: string, fraction = 2): string {
  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: fraction,
    maximumFractionDigits: fraction,
  });
  return `${currencySymbol(currency)}${formatter.format(amount)}`;
}

export function formatPercent(value: number, fraction = 2): string {
  return `${value.toFixed(fraction)}%`;
}
