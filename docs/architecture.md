# Architecture

## Monorepo

```
apps/
  web/     @teziko/web    Storefront (Next.js App Router), :3000
  admin/   @teziko/admin  Admin dashboard (Next.js App Router), :3001, noindex
packages/
  ui/                 @teziko/ui           shadcn-style components + animation primitives
  data/               @teziko/data         catalogue, pricing engine, queries, seeded analytics, SVG art
  types/              @teziko/types        shared domain types
  validators/         @teziko/validators   Zod schemas + signed session tokens
  config-typescript/  shared tsconfigs (strict, noUncheckedIndexedAccess)
  config-eslint/      flat configs (Next + library)
  config-tailwind/    design tokens (CSS variables + Tailwind v4 @theme) and PostCSS config
supabase/migrations/  optional database schema (RLS + pg_cron purge)
```

Dependency direction: apps → packages. Packages never import apps. Internal packages ship TypeScript source and are compiled by Next via `transpilePackages`.

There is no separate backend. Server logic lives in Next.js route handlers.

## Data flow

- **Catalogue** is static, typed data in `packages/data`. Server Components read it directly.
- **Client bundles never import the catalogue root.** Client code uses the light subpath exports `@teziko/data/images`, `/orders` and `/states`. Product details reach the client as serialisable `CardProduct` props, or from `/api/products` (wishlist, compare, recently viewed).
- **Pricing** has a single implementation, `priceCart()`. The cart UI asks `/api/cart/quote`, and `/api/orders` recomputes before saving.
- **Shopper state** (cart, wishlist, compare, recently viewed) uses Zustand `persist` → `localStorage`.
- **Data-access layer** (`apps/web/src/features/data-access`) has one `DataAdapter` interface and two implementations:
  - `local` (default): `localStorage`, every record has `createdAt`, purged after 14 days on app load (`RetentionPurge`).
  - `supabase` (`NEXT_PUBLIC_DATA_ADAPTER=supabase` plus server env vars): the browser calls `/api/data/*`, which uses the service-role key server-side only. Tables have `expires_at default now() + interval '14 days'`, RLS is enabled with no anon policies, and `pg_cron` purges daily.

## Auth

`@teziko/validators/session` signs `{ email, name, role, exp }` with HMAC-SHA256 (Web Crypto), so the same code runs in `proxy.ts` and in route handlers.

- **Storefront:** `/account/*` is guarded by `proxy.ts` and again by `getSession()` in the account layout. The storefront only issues `customer` sessions.
- **Admin:** every route except `/login`, `/api/auth/*` and `/media/*` is guarded by `proxy.ts` (role must be `admin`), and every page calls `requireAdmin()` server-side.

## Security notes

- Honeypot field and per-IP rate limit on the contact, newsletter, order (and auth) handlers. Honeypot hits get a generic success reply.
- Zod validation on every handler; unknown fields (e.g. client totals) are stripped.
- No secrets are committed: `.env.example` only. The Supabase service key is read only in `server-only` modules.
- The SVG media route only accepts whitelisted kinds and `^[0-4]-[0-9a-f]{6}\.svg$` file names, and responds with a sandboxing CSP.
- Security headers via `next.config.ts`. The admin also sends `X-Robots-Tag: noindex` and `X-Frame-Options: DENY`.

## Animation system

Primitives live in `packages/ui/src/motion` and `hooks`: `Reveal`, `Stagger`, `AnimatedText`, `ImageReveal`, `Magnetic`, `Marquee` (CSS), `CountUp`, `SpotlightCard`, `PageTransition`, `BentoGrid`, `useScrollReveal`, `usePrefersReducedMotion`.

- Only `transform` and `opacity` are animated.
- **Hidden state comes from JS.** An inline head script adds `js-anim` and always removes it after 1.2s. Without JS nothing is hidden. If hydration arrives late, on-screen content is left alone rather than hidden and replayed, which protects LCP.
- `MotionProvider` wraps the app in `LazyMotion` (strict) + `MotionConfig reducedMotion="user"`. Animation features load asynchronously.
- **Lazy-loaded with `next/dynamic` or dynamic `import()`:**
  - GSAP + ScrollTrigger: the pinned trending section, on desktop fine pointers only.
  - React Three Fiber: hero preview card (idle, desktop) and the product page "View in 3D" dialog.
  - Lottie: order confirmation.
  - Lenis: desktop only.
  - Cart drawer (vaul) and search palette (cmdk): mounted on first open.
- **Reduced motion:** no Lenis, parallax, pinned scroll or 3D auto-rotate; motion falls back to fades; CSS animations are neutralised; the marquee becomes a scroll row.
- The product listing page has no GSAP, R3F, Lottie or stagger; hover effects are desktop-only, with always-visible touch controls.
- Shared-element transition from listing to product page uses the View Transitions API where available (`features/navigation/view-transition.tsx`).

## Admin

Server Components read seeded data from `@teziko/data` and live orders from the storefront feed (`WEB_INTERNAL_URL` + `DEMO_FEED_TOKEN`, fails soft). Edits are applied client-side through a persisted overrides store (`features/overrides/store.ts`). Tables use TanStack Table v9 with explicit `tableFeatures` (sorting, global filter, pagination). Charts use Recharts: single-series, one ink colour with the latest month emphasised, each with a data-table alternative.
