import { chromium, type Browser, type BrowserContext, type Page } from "playwright";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { env } from "../config/env";

export interface BrowserFactory {
  browser: Browser;
  createProviderContext: (provider: string) => Promise<{ context: BrowserContext; page: Page; close: () => Promise<void> }>;
  close: () => Promise<void>;
}

export async function createBrowserFactory(): Promise<BrowserFactory> {
  const browser = await chromium.launch({ headless: env.headless });

  return {
    browser,
    async createProviderContext(provider: string) {
      const context = await browser.newContext({
        viewport: { width: 1440, height: 900 },
        userAgent: env.BROWSER_USER_AGENT,
        locale: "en-US",
        timezoneId: "America/New_York",
      });
      const page = await context.newPage();
      return {
        context,
        page,
        close: async () => {
          await page.close({ runBeforeUnload: false }).catch(() => undefined);
          await context.close().catch(() => undefined);
        },
      };
    },
    async close() {
      await browser.close();
    },
  };
}

export async function screenshotOnFailure(page: Page, provider: string, name: string): Promise<string | null> {
  try {
    const dir = join("artifacts", provider);
    mkdirSync(dir, { recursive: true });
    const file = join(dir, `${Date.now()}-${name}.png`);
    await page.screenshot({ path: file, fullPage: true });
    return file;
  } catch {
    return null;
  }
}
