import { z } from "zod";

export const quoteStatusSchema = z.enum(["success", "partial", "failed"]);

export const corridorSchema = z.object({
  sendCountry: z.string().length(2).transform((v) => v.toUpperCase()),
  receiveCountry: z.enum(["GH", "NG", "KE"]),
  sendCurrency: z.string().length(3).transform((v) => v.toUpperCase()),
  receiveCurrency: z.string().length(3).transform((v) => v.toUpperCase()),
});

export type Corridor = z.infer<typeof corridorSchema>;

export const quoteSchema = z.object({
  provider: z.string().min(1),
  sendCountry: z.string().length(2),
  receiveCountry: z.enum(["GH", "NG", "KE"]),
  sendCurrency: z.string().length(3),
  receiveCurrency: z.string().length(3),
  sendAmount: z.number().positive(),
  fee: z.number().nonnegative(),
  exchangeRate: z.number().positive(),
  recipientAmount: z.number().nonnegative(),
  deliveryEstimate: z.string().nullable(),
  payoutMethod: z.string().nullable(),
  scrapedAt: z.string().datetime(),
  sourceUrl: z.string().url(),
  status: quoteStatusSchema,
  errorMessage: z.string().nullable(),
});

export type Quote = z.infer<typeof quoteSchema>;

export interface ScrapeRunResult {
  provider: string;
  status: "success" | "failed";
  recordsWritten: number;
  errorMessage: string | null;
  startedAt: string;
  finishedAt: string;
}
