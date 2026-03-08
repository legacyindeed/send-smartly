import { getDb } from "./sqlite";

export function runMigrations(): void {
  const db = getDb();

  db.exec(`
    CREATE TABLE IF NOT EXISTS quotes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      provider TEXT NOT NULL,
      send_country TEXT NOT NULL,
      receive_country TEXT NOT NULL,
      send_currency TEXT NOT NULL,
      receive_currency TEXT NOT NULL,
      send_amount REAL NOT NULL,
      fee REAL NOT NULL,
      exchange_rate REAL NOT NULL,
      recipient_amount REAL NOT NULL,
      delivery_estimate TEXT,
      payout_method TEXT,
      scraped_at TEXT NOT NULL,
      source_url TEXT NOT NULL,
      quote_hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(provider, quote_hash)
    );

    CREATE TABLE IF NOT EXISTS scrape_runs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      provider TEXT NOT NULL,
      started_at TEXT NOT NULL,
      finished_at TEXT NOT NULL,
      status TEXT NOT NULL,
      error_message TEXT,
      records_written INTEGER NOT NULL DEFAULT 0
    );

    CREATE INDEX IF NOT EXISTS idx_quotes_lookup ON quotes (send_country, receive_country, send_amount, scraped_at DESC);
    CREATE INDEX IF NOT EXISTS idx_quotes_provider ON quotes (provider, scraped_at DESC);
    CREATE INDEX IF NOT EXISTS idx_scrape_runs_provider ON scrape_runs (provider, started_at DESC);
  `);
}
