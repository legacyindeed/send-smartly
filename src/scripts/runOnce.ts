import { scrapeAllProviders, printSummary } from "../services/scrapeAll";
import { logger } from "../utils/logger";

async function main() {
  const summary = await scrapeAllProviders();
  printSummary(summary);
}

main().catch((error) => {
  logger.error({ error: error instanceof Error ? error.message : String(error) }, "scrape:once failed");
  process.exitCode = 1;
});
