import { env } from "../config/env";
import { scrapeAllProviders, printSummary } from "../services/scrapeAll";
import { logger } from "../utils/logger";

let running = false;

async function runScheduled() {
  if (running) {
    logger.warn("Scheduler tick skipped because previous run is still active");
    return;
  }

  running = true;
  try {
    const summary = await scrapeAllProviders();
    printSummary(summary);
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, "Scheduled scrape failed");
  } finally {
    running = false;
  }
}

async function main() {
  // Run immediately on startup
  await runScheduled();

  const everyMs = env.SCRAPE_INTERVAL_HOURS * 60 * 60 * 1000;
  setInterval(runScheduled, everyMs);

  logger.info({ intervalHours: env.SCRAPE_INTERVAL_HOURS }, "Scheduler running");
  logger.info("Equivalent cron: 0 */4 * * * npm run scrape:once");
}

main().catch((error) => {
  logger.error({ error: error instanceof Error ? error.message : String(error) }, "scrape:scheduler failed");
  process.exitCode = 1;
});
