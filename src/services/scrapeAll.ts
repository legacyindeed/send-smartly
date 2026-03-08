import { env } from "../config/env";
import type { Corridor, Quote, ScrapeRunResult } from "../models/quote";
import { runMigrations } from "../db/migrations";
import { CacheService } from "./cacheService";
import { logger } from "../utils/logger";
import { createBrowserFactory, screenshotOnFailure } from "../utils/browser";
import { withRetry } from "../utils/retry";
import { elapsedMs, formatDuration, nowIso, sleep } from "../utils/time";
import { wiseProvider } from "../providers/wise";
import { providerModule as westernUnionProvider } from "../providers/westernUnion";
import { providerModule as taptapSendProvider } from "../providers/taptapSend";
import { providerModule as lemfiProvider } from "../providers/lemfi";
import { providerModule as worldRemitProvider } from "../providers/worldRemit";
import { providerModule as moneygramProvider } from "../providers/moneygram";
import { providerModule as riaProvider } from "../providers/ria";
import { providerModule as remitlyProvider } from "../providers/remitly";
import type { ScrapeProviderModule } from "../providers/shared";

const allProviders: ScrapeProviderModule[] = [
  wiseProvider,
  westernUnionProvider,
  taptapSendProvider,
  lemfiProvider,
  worldRemitProvider,
  moneygramProvider,
  riaProvider,
  remitlyProvider,
];

export interface ScrapeSummary {
  providersAttempted: number;
  successCount: number;
  failureCount: number;
  recordsWritten: number;
  elapsedMs: number;
  runResults: ScrapeRunResult[];
}

async function scrapeProviderForTargets(provider: ScrapeProviderModule, corridors: Corridor[], amounts: number[]): Promise<Quote[]> {
  const browserFactory = await createBrowserFactory();
  const allQuotes: Quote[] = [];

  try {
    for (const corridor of corridors) {
      for (const amount of amounts) {
        const { context, page, close } = await browserFactory.createProviderContext(provider.provider);

        try {
          logger.info({ provider: provider.provider, corridor, amount }, "Scraping quote target");
          const quotes = await withRetry(
            async () => provider.scrapeProvider({ page, context, corridor, amount }),
            { retries: env.SCRAPE_RETRIES, initialDelayMs: 1000, maxDelayMs: 7000 }
          );
          allQuotes.push(...quotes);
        } catch (error) {
          const screenshot = await screenshotOnFailure(page, provider.provider.replace(/\s+/g, "-"), `${corridor.sendCountry}-${corridor.receiveCountry}-${amount}`);
          logger.error(
            { provider: provider.provider, corridor, amount, error: error instanceof Error ? error.message : String(error), screenshot },
            "Provider target scrape failed"
          );
          allQuotes.push({
            provider: provider.provider,
            sendCountry: corridor.sendCountry,
            receiveCountry: corridor.receiveCountry,
            sendCurrency: corridor.sendCurrency,
            receiveCurrency: corridor.receiveCurrency,
            sendAmount: amount,
            fee: 0,
            exchangeRate: 0,
            recipientAmount: 0,
            deliveryEstimate: null,
            payoutMethod: null,
            scrapedAt: nowIso(),
            sourceUrl: "",
            status: "failed",
            errorMessage: error instanceof Error ? error.message : String(error),
          });
        } finally {
          await close();
        }

        await sleep(env.REQUEST_DELAY_MS);
      }
    }
  } finally {
    await browserFactory.close();
  }

  return allQuotes;
}

export async function scrapeAllProviders(): Promise<ScrapeSummary> {
  runMigrations();
  const cacheService = new CacheService();
  const started = Date.now();

  let successCount = 0;
  let failureCount = 0;
  let recordsWritten = 0;
  const runResults: ScrapeRunResult[] = [];

  for (const provider of allProviders) {
    const startedAt = nowIso();
    const startProvider = Date.now();

    try {
      const quotes = await scrapeProviderForTargets(provider, env.corridors, env.amounts);
      const written = cacheService.insertQuotes(quotes);
      recordsWritten += written;

      const hasAnySuccess = quotes.some((q) => q.status !== "failed");
      const status: "success" | "failed" = hasAnySuccess ? "success" : "failed";
      if (hasAnySuccess) successCount += 1;
      else failureCount += 1;

      const run: ScrapeRunResult = {
        provider: provider.provider,
        status,
        recordsWritten: written,
        errorMessage: hasAnySuccess ? null : "No successful quotes collected",
        startedAt,
        finishedAt: nowIso(),
      };

      cacheService.insertScrapeRun(run);
      runResults.push(run);

      logger.info({ provider: provider.provider, status, recordsWritten: written, elapsedMs: elapsedMs(startProvider) }, "Provider scrape completed");
    } catch (error) {
      failureCount += 1;
      const run: ScrapeRunResult = {
        provider: provider.provider,
        status: "failed",
        recordsWritten: 0,
        errorMessage: error instanceof Error ? error.message : String(error),
        startedAt,
        finishedAt: nowIso(),
      };
      cacheService.insertScrapeRun(run);
      runResults.push(run);
      logger.error({ provider: provider.provider, error: run.errorMessage }, "Provider scrape run failed");
    }

    await sleep(env.REQUEST_DELAY_MS);
  }

  const totalElapsed = elapsedMs(started);

  return {
    providersAttempted: allProviders.length,
    successCount,
    failureCount,
    recordsWritten,
    elapsedMs: totalElapsed,
    runResults,
  };
}

export function printSummary(summary: ScrapeSummary): void {
  logger.info(
    {
      providersAttempted: summary.providersAttempted,
      successCount: summary.successCount,
      failureCount: summary.failureCount,
      recordsWritten: summary.recordsWritten,
      elapsed: formatDuration(summary.elapsedMs),
    },
    "Scrape run summary"
  );

  // Human-readable CLI summary
  // eslint-disable-next-line no-console
  console.log(`\nScrape Summary\n--------------\nProviders attempted: ${summary.providersAttempted}\nSuccess count: ${summary.successCount}\nFailure count: ${summary.failureCount}\nRecords written: ${summary.recordsWritten}\nElapsed time: ${formatDuration(summary.elapsedMs)}\n`);
}
