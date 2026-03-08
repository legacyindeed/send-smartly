import express from "express";
import { env } from "./config/env";
import { runMigrations } from "./db/migrations";
import { CacheService } from "./services/cacheService";
import { rankQuotes } from "./services/rankingService";
import { logger } from "./utils/logger";

function parseAmount(value: string | undefined): number | null {
  const amount = Number(value);
  return Number.isFinite(amount) && amount > 0 ? amount : null;
}

function validateCountries(sendCountry: string | undefined, receiveCountry: string | undefined): string | null {
  if (!sendCountry || !receiveCountry) return "sendCountry and receiveCountry are required";
  const rc = receiveCountry.toUpperCase();
  if (!["GH", "NG", "KE"].includes(rc)) {
    return "receiveCountry must be one of: GH, NG, KE";
  }
  return null;
}

export async function startApiServer(): Promise<void> {
  runMigrations();
  const cache = new CacheService();

  const app = express();
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ ok: true, service: "remittance-scraper-api" });
  });

  app.get("/quotes/latest", (req, res) => {
    const sendCountry = String(req.query.sendCountry ?? "").toUpperCase();
    const receiveCountry = String(req.query.receiveCountry ?? "").toUpperCase();
    const amount = parseAmount(typeof req.query.amount === "string" ? req.query.amount : undefined);

    const countryError = validateCountries(sendCountry, receiveCountry);
    if (countryError) return res.status(400).json({ error: countryError });
    if (!amount) return res.status(400).json({ error: "amount must be a positive number" });

    const quotes = cache.getLatestQuotesByCorridorAmount(sendCountry, receiveCountry, amount);
    return res.json({ quotes, count: quotes.length });
  });

  app.get("/quotes/best", (req, res) => {
    const sendCountry = String(req.query.sendCountry ?? "").toUpperCase();
    const receiveCountry = String(req.query.receiveCountry ?? "").toUpperCase();
    const amount = parseAmount(typeof req.query.amount === "string" ? req.query.amount : undefined);

    const countryError = validateCountries(sendCountry, receiveCountry);
    if (countryError) return res.status(400).json({ error: countryError });
    if (!amount) return res.status(400).json({ error: "amount must be a positive number" });

    const quotes = cache.getLatestQuotesByCorridorAmount(sendCountry, receiveCountry, amount);
    const ranked = rankQuotes(
      quotes.map((q) => ({
        provider: q.provider,
        fee: q.fee,
        recipientAmount: q.recipient_amount,
        deliveryEstimate: q.delivery_estimate,
      }))
    );

    const bestByRecipient = cache.getBestQuoteByRecipient(sendCountry, receiveCountry, amount);

    return res.json({
      rankings: ranked,
      bestByRecipient,
      quoteCount: quotes.length,
    });
  });

  app.listen(env.API_PORT, () => {
    logger.info({ port: env.API_PORT }, "API server listening");
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  startApiServer().catch((error) => {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, "API startup failed");
    process.exitCode = 1;
  });
}
