export function parseMoney(input: string | null | undefined): number | null {
  if (!input) return null;
  const normalized = input.replace(/[^\d.,-]/g, "").replace(/,/g, "");
  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
