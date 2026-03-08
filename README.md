# Smart Remittance Optimizer

Premium remittance comparison experience focused on **United States -> Ghana** for v1.

This repo includes:
- A Next.js App Router app (API routes + UI)
- A standalone `index.html` preview page (opens directly via `file://`)

## What it does

Users enter a send amount and compare providers on:
- Fee
- FX rate
- Net principal used for FX conversion
- Recipient amount
- Delivery estimate

Wise is the anchor quote. Other provider quotes are estimated from Wise using configurable multipliers.

## v1 Scope

- Corridor: **US -> GH only**
- Providers shown:
  - Wise
  - WorldRemit
  - TapTap Send
  - LemFi
  - Remitly
  - Western Union

## Data model approach

- Wise: real API when available, fallback model otherwise
- Non-Wise providers: estimated from Wise rate
- Estimated multiplier config: `src/data/provider-estimates.ts`

## Tech stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Recharts
- Zod

## API routes

- `GET /api/fx?base=USD&target=GHS`
- `POST /api/quote`

Example body:

```json
{
  "sendCountry": "US",
  "receiveCountry": "GH",
  "sendAmount": 500,
  "payoutMethod": "mobile_money",
  "priority": "balanced"
}
```

## Environment variables

Copy `.env.example` to `.env`.

- `EXCHANGERATE_API_KEY` (preferred FX source)
- `OPEN_EXCHANGE_RATES_APP_ID` (optional FX fallback)
- `WISE_API_TOKEN` (optional Wise real quote)
- `WISE_PROFILE_ID` (optional Wise real quote)
- `NEXT_PUBLIC_APP_NAME`

If keys are missing, app still works with graceful fallback behavior.

## Run locally

```bash
npm install
npm run dev
```

Open: `http://localhost:3000`

## Standalone preview

Open `index.html` directly:

```txt
file:///.../send-smartly/index.html
```

## Deploy (Vercel)

1. Push to GitHub
2. Import repo in Vercel
3. Add env vars
4. Deploy

## Notes

- No auth in v1
- No scraping infra required for v1 app experience
- Keep provider estimate multipliers updated from observed market snapshots
