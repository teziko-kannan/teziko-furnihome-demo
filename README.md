# Teziko Home: furniture & appliances demo store

A premium, animated **demo** e-commerce store (storefront + admin) built as a pnpm + Turborepo monorepo.

> Demo store. Orders are not real. Data is deleted automatically after 14 days.

## Requirements

- Node.js 20.9+ (tested with Node 22.22)
- pnpm 10 (`corepack enable` picks up the pinned version)

## Run it

```bash
pnpm install
pnpm dev            # storefront on http://localhost:3000, admin on http://localhost:3001
pnpm dev:web        # storefront only
pnpm dev:admin      # admin only
```

No environment variables are needed for `pnpm dev`. Development uses safe local fallbacks: a dev signing secret and a local demo-feed token.

For a production build (`pnpm build && pnpm start`), set at least:

```bash
AUTH_SECRET=<long random string, same value for both apps>
DEMO_FEED_TOKEN=<random string, same value for both apps>   # lets admin read live storefront orders
```

See `.env.example` for all options. Copy the values you need into `apps/web/.env.local` and `apps/admin/.env.local`.

## Demo logins

| App                   | Email               | Password    |
| --------------------- | ------------------- | ----------- |
| Storefront (`/login`) | `customer@demo.com` | `demo1234`  |
| Admin (`:3001/login`) | `admin@demo.com`    | `admin1234` |

Both login pages have a one-click "fill demo credentials" button. Coupon codes: `WELCOME10`, `FESTIVE15`, `APPLIANCE5`, `FLAT500`, `FREESHIP` (`MONSOON20` is expired, to show the error state).

## Scripts

| Command          | What it does                                                                         |
| ---------------- | ------------------------------------------------------------------------------------ |
| `pnpm lint`      | ESLint (flat config, Next core-web-vitals + React compiler rules) in every workspace |
| `pnpm typecheck` | `tsc --noEmit` (Next route types are generated first)                                |
| `pnpm test`      | Vitest unit tests (data, validators, ui, web)                                        |
| `pnpm test:e2e`  | Playwright e2e tests (build the web app first: `pnpm build`)                         |
| `pnpm build`     | Production build of both apps                                                        |
| `pnpm format`    | Prettier + Tailwind class sorting                                                    |

## Optional Supabase adapter

1. Apply `supabase/migrations/20261117000000_demo_store.sql`. It enables RLS on every table, sets `expires_at` defaults and schedules a daily `pg_cron` purge.
2. Set `NEXT_PUBLIC_DATA_ADAPTER=supabase`, `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (server-only) for the web app.

This adapter is implemented but **has not been run against a live Supabase project** (see _Unverified_ below).

## Docs

- [`docs/architecture.md`](docs/architecture.md): structure, data flow, auth, animation system
- [`docs/mock-vs-real.md`](docs/mock-vs-real.md): everything that is simulated

## Version notes

Latest stable versions were checked with `pnpm view` on 2026-11-17. Three were held back for peer compatibility:

- **TypeScript 6.0.3** (not 7.x): `typescript-eslint` (used by `eslint-config-next`) supports TS `<6.1`.
- **ESLint 9.39** (not 10.x): `eslint-plugin-react`, `-import` and `-jsx-a11y` support ESLint `^9`.
- **Tailwind v4**: autoprefixer is built in, so it isn't installed. `tw-animate-css` replaces `tailwindcss-animate` (v3-only). The shared "preset" is `packages/config-tailwind/theme.css`.

Extra packages beyond the brief, and why:

- `radix-ui`: the unified Radix package used by shadcn.
- `server-only`: guards server modules.
- `@vitejs/plugin-react`, `jsdom`, `@testing-library/dom`: needed to run vitest with React Testing Library.
- `@playwright/test`: the Playwright runner.

## Verification (last run 2026-11-19)

- `pnpm lint`, `pnpm typecheck`, `pnpm format:check`: pass (all workspaces).
- `pnpm test`: 30 unit tests pass (data 19, validators 5, ui 3, web 3).
- `pnpm build`: both apps build; 65 product pages are statically generated.
- `pnpm test:e2e`: 9 Playwright tests pass. They cover browsing, URL-synced filters, cart and coupon, simulated payment success and failure, the account guard, server-side total recomputation, the honeypot and the 404 page, plus a 360px mobile layout test.
- Responsive sweep: 34 storefront and admin pages at 320, 360, 390, 768 and 1440px, with no horizontal overflow and no console errors.
- Lighthouse 13.6 (local production build):

| Page    | Mobile perf / a11y / BP / SEO | Mobile LCP · TBT · CLS | Desktop perf | Desktop LCP · CLS |
| ------- | ----------------------------- | ---------------------- | ------------ | ----------------- |
| Home    | 57 / 100 / 100 / 100          | 4.6 s · 1.55 s · 0     | 87           | 1.3 s · 0         |
| Shop    | 54 / 100 / 100 / 100          | 5.3 s · 1.48 s · 0     | 97           | 1.2 s · 0         |
| Product | 55 / 100 / 100 / 100          | 5.3 s · 1.41 s · 0     | 95           | 1.2 s · 0.006     |

Mobile performance is limited by hydration and framework JavaScript under Lighthouse's 4× CPU throttling, not by animation. Layout shift is effectively zero; GSAP, Three.js and Lottie are absent from initial bundles; and entrance animations never hold back on-screen content past 1.2s. A further improvement would be turning product cards into server components with small client islands.

## Unverified / incomplete

- The Supabase adapter and migration have not been run against a live Supabase project.
- Testing used Chromium only (Playwright and Lighthouse); Safari and Firefox were not tested.
- The demo-feed and rate limiter are in-memory, so they only work on a single server instance.
- Admin edits are browser-local and do not affect the storefront (by design).
