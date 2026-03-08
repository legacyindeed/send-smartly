import { getDb } from "../db/sqlite";
import type { Quote, ScrapeRunResult } from "../models/quote";
import { quoteHash } from "../utils/hashing";

export interface QuoteRow {
  id: number;
  provider: string;
  send_country: string;
  receive_country: string;
  send_currency: string;
  receive_currency: string;
  send_amount: number;
  fee: number;
  exchange_rate: number;
  recipient_amount: number;
  delivery_estimate: string | null;
  payout_method: string | null;
  scraped_at: string;
  source_url: string;
  quote_hash: string;
  created_at: string;
}

export class CacheService {
  private readonly db = getDb();

  insertQuotes(quotes: Quote[]): number {
    const stmt = this.db.prepare(`
      INSERT OR IGNORE INTO quotes (
        provider, send_country, receive_country, send_currency, receive_currency,
        send_amount, fee, exchange_rate, recipient_amount, delivery_estimate,
        payout_method, scraped_at, source_url, quote_hash
      ) VALUES (
        @provider, @send_country, @receive_country, @send_currency, @receive_currency,
        @send_amount, @fee, @exchange_rate, @recipient_amount, @delivery_estimate,
        @payout_method, @scraped_at, @source_url, @quote_hash
      )
    `);

    let written = 0;
    const tx = this.db.transaction((rows: Quote[]) => {
      for (const q of rows) {
        if (q.status === "failed") continue;
        const result = stmt.run({
          provider: q.provider,
          send_country: q.sendCountry,
          receive_country: q.receiveCountry,
          send_currency: q.sendCurrency,
          receive_currency: q.receiveCurrency,
          send_amount: q.sendAmount,
          fee: q.fee,
          exchange_rate: q.exchangeRate,
          recipient_amount: q.recipientAmount,
          delivery_estimate: q.deliveryEstimate,
          payout_method: q.payoutMethod,
          scraped_at: q.scrapedAt,
          source_url: q.sourceUrl,
          quote_hash: quoteHash(q),
        });
        if (result.changes > 0) written += 1;
      }
    });

    tx(quotes);
    return written;
  }

  insertScrapeRun(run: ScrapeRunResult): void {
    this.db
      .prepare(
        `INSERT INTO scrape_runs (provider, started_at, finished_at, status, error_message, records_written)
         VALUES (@provider, @started_at, @finished_at, @status, @error_message, @records_written)`
      )
      .run({
        provider: run.provider,
        started_at: run.startedAt,
        finished_at: run.finishedAt,
        status: run.status,
        error_message: run.errorMessage,
        records_written: run.recordsWritten,
      });
  }

  getLatestQuotesByCorridorAmount(sendCountry: string, receiveCountry: string, amount: number): QuoteRow[] {
    return this.db
      .prepare(
        `SELECT q.*
         FROM quotes q
         JOIN (
            SELECT provider, MAX(scraped_at) AS max_scraped_at
            FROM quotes
            WHERE send_country = ? AND receive_country = ? AND send_amount = ?
            GROUP BY provider
         ) latest
         ON q.provider = latest.provider AND q.scraped_at = latest.max_scraped_at
         WHERE q.send_country = ? AND q.receive_country = ? AND q.send_amount = ?
         ORDER BY q.recipient_amount DESC`
      )
      .all(sendCountry, receiveCountry, amount, sendCountry, receiveCountry, amount) as QuoteRow[];
  }

  getLatestQuotesByProvider(provider: string): QuoteRow[] {
    return this.db
      .prepare(
        `SELECT * FROM quotes WHERE provider = ? ORDER BY scraped_at DESC LIMIT 200`
      )
      .all(provider) as QuoteRow[];
  }

  getBestQuoteByRecipient(sendCountry: string, receiveCountry: string, amount: number): QuoteRow | null {
    return (
      this.db
        .prepare(
          `SELECT * FROM quotes
           WHERE send_country = ? AND receive_country = ? AND send_amount = ?
           ORDER BY scraped_at DESC, recipient_amount DESC
           LIMIT 1`
        )
        .get(sendCountry, receiveCountry, amount) as QuoteRow | undefined
    ) ?? null;
  }

  compareCurrentVsPrevious(sendCountry: string, receiveCountry: string, amount: number): Array<{
    provider: string;
    currentRecipientAmount: number;
    previousRecipientAmount: number | null;
    deltaRecipientAmount: number | null;
    currentFee: number;
    previousFee: number | null;
    deltaFee: number | null;
  }> {
    const latest = this.getLatestQuotesByCorridorAmount(sendCountry, receiveCountry, amount);

    const prevStmt = this.db.prepare(
      `SELECT * FROM quotes
       WHERE provider = ? AND send_country = ? AND receive_country = ? AND send_amount = ?
       AND scraped_at < ?
       ORDER BY scraped_at DESC
       LIMIT 1`
    );

    return latest.map((row) => {
      const prev = prevStmt.get(row.provider, sendCountry, receiveCountry, amount, row.scraped_at) as QuoteRow | undefined;
      return {
        provider: row.provider,
        currentRecipientAmount: row.recipient_amount,
        previousRecipientAmount: prev?.recipient_amount ?? null,
        deltaRecipientAmount: prev ? row.recipient_amount - prev.recipient_amount : null,
        currentFee: row.fee,
        previousFee: prev?.fee ?? null,
        deltaFee: prev ? row.fee - prev.fee : null,
      };
    });
  }
}
