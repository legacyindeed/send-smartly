import dotenv from "dotenv";
import { z } from "zod";
import type { Corridor } from "../models/quote";

dotenv.config();

const countryCurrency: Record<string, string> = {
  US: "USD",
  UK: "GBP",
  GH: "GHS",
  NG: "NGN",
  KE: "KES",
  UG: "UGX",
};

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  LOG_LEVEL: z.string().default("info"),
  DATABASE_PATH: z.string().default("data/quotes.sqlite"),
  SCRAPE_INTERVAL_HOURS: z.coerce.number().int().positive().default(4),
  SCRAPE_TIMEOUT_MS: z.coerce.number().int().positive().default(90_000),
  SCRAPE_RETRIES: z.coerce.number().int().min(0).max(5).default(2),
  REQUEST_DELAY_MS: z.coerce.number().int().min(0).default(1500),
  TARGET_CORRIDORS: z.string().default("US-GH,US-NG,UK-KE"),
  TARGET_AMOUNTS: z.string().default("100,500,1000"),
  API_PORT: z.coerce.number().int().positive().default(8787),
  HEADLESS: z.enum(["true", "false"]).default("true"),
  BROWSER_USER_AGENT: z
    .string()
    .default(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
    ),
});

const parsed = envSchema.parse(process.env);

function parseCorridors(raw: string): Corridor[] {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((pair) => {
      const [sendCountry, receiveCountry] = pair.toUpperCase().split("-");
      if (!sendCountry || !receiveCountry) {
        throw new Error(`Invalid corridor: ${pair}. Use format US-GH`);
      }
      if (!["GH", "NG", "KE"].includes(receiveCountry)) {
        throw new Error(`Unsupported receive country ${receiveCountry}. Allowed: GH, NG, KE`);
      }
      const sendCurrency = countryCurrency[sendCountry];
      const receiveCurrency = countryCurrency[receiveCountry];
      if (!sendCurrency || !receiveCurrency) {
        throw new Error(`Missing currency mapping for corridor ${pair}`);
      }
      return { sendCountry, receiveCountry: receiveCountry as "GH" | "NG" | "KE", sendCurrency, receiveCurrency };
    });
}

function parseAmounts(raw: string): number[] {
  const amounts = raw
    .split(",")
    .map((v) => Number(v.trim()))
    .filter((v) => Number.isFinite(v) && v > 0);
  if (amounts.length === 0) {
    throw new Error("TARGET_AMOUNTS must contain at least one positive amount");
  }
  return amounts;
}

export const env = {
  ...parsed,
  headless: parsed.HEADLESS === "true",
  corridors: parseCorridors(parsed.TARGET_CORRIDORS),
  amounts: parseAmounts(parsed.TARGET_AMOUNTS),
};

export type AppEnv = typeof env;
