export function parseDeliveryToHours(input: string | null | undefined): number {
  if (!input) return 999;
  const text = input.toLowerCase();

  if (text.includes("minute")) return 0.25;
  if (text.includes("same day")) return 12;
  if (text.includes("hour")) {
    const match = text.match(/(\d+(?:\.\d+)?)\s*hour/);
    return match ? Number(match[1]) : 3;
  }
  if (text.includes("day")) {
    const match = text.match(/(\d+(?:\.\d+)?)\s*day/);
    return match ? Number(match[1]) * 24 : 24;
  }
  return 72;
}
