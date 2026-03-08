import { sleep } from "./time";

export interface RetryOptions {
  retries: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
}

export async function withRetry<T>(fn: () => Promise<T>, options: RetryOptions): Promise<T> {
  const retries = Math.max(0, options.retries);
  const initial = options.initialDelayMs ?? 500;
  const max = options.maxDelayMs ?? 6000;

  let attempt = 0;
  let lastError: unknown;

  while (attempt <= retries) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt === retries) break;
      const delay = Math.min(max, initial * Math.pow(2, attempt));
      await sleep(delay);
      attempt += 1;
    }
  }

  throw lastError;
}
