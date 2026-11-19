# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

The git root holds one app: `afternoon-tea/`, a **frontend-only** Next.js landing page plus a SevenRooms-style booking flow for afternoon tea. There is no backend and no database. Sample data lives in TypeScript files, bookings are kept in `localStorage`, and payment is simulated. UI text is in Vietnamese.

Run all commands from `afternoon-tea/`.

## Commands

```bash
npm run dev      # dev server (http://localhost:3000)
npm run build    # static export to out/; also type-checks
npm run lint      # eslint (next core-web-vitals + typescript)
npm run typecheck # next typegen && tsc --noEmit
```

There is no test suite.

- **Route types:** `PageProps<"/route">` and `LayoutProps<"/">` are global types that Next generates. Plain `tsc` fails on new routes until `next typegen` (included in `npm run typecheck`), `next dev` or `next build` regenerates them.
- **One dev server only:** Next allows a single dev server per project. A second one exits and prints the PID of the running one. Running `next build` while the dev server is up rewrites `.next/` and can break the running server.

## CI/CD

`.github/workflows/ci-cd.yml` has three jobs:
- `ci` runs `npm ci`, lint, typecheck and build in `afternoon-tea/` on every push and PR.
- After `ci` passes, `deploy-preview` (same-repo PRs) or `deploy-production` (pushes to `master`) deploys to Vercel with a pinned Vercel CLI: `vercel pull` → `vercel build` → `vercel deploy --prebuilt`.
- These run from the repo root, because the Vercel project's Root Directory is `afternoon-tea`.
- They need the repo secrets `VERCEL_TOKEN`, `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID`.

`afternoon-tea/vercel.json` turns off Vercel's own Git auto-deploys, so the workflow is the only thing that deploys.

**Base path (optional):** on Vercel the site is served at the domain root. For hosting under a sub-path, `next.config.ts` reads `basePath` from `NEXT_PUBLIC_BASE_PATH`.
- `next/link` and `router.push` add the base path automatically.
- Hand-written URLs to `public/` assets do not. Pass them through `withBasePath()` from `src/lib/base-path.ts`, as `Photo` does for `<img src>`.

**Windows build:** a local Windows build writes the per-segment prefetch files (`__next.<segment>.__PAGE__.txt`) into nested folders, so prefetches 404. This is a Next.js path-separator bug that does not happen on Linux builds. Ignore it when testing `out/` locally.

## Next.js 16: read the bundled docs first

`afternoon-tea/AGENTS.md` warns that this Next.js version has breaking changes compared with older versions. Before you use a Next API you are unsure about, read the matching guide in `afternoon-tea/node_modules/next/dist/docs/`. In particular:

- **Static export:** `next.config.ts` sets `output: "export"`, `trailingSlash: true` and `images.unoptimized`. This rules out Server Actions, request-dependent route handlers, cookies/headers, rewrites/redirects, middleware/proxy, ISR and the default image optimizer.
- **Dynamic routes:** each dynamic route needs `generateStaticParams` and `dynamicParams = false`.
- **Async params:** `params` is a Promise, so use `await params`.
- **Cache Components:** `cacheComponents` and `partialPrefetching` were deliberately removed from the config. They do not fit a static export.
- **Links:** internal links use trailing slashes, e.g. `/experiences/${slug}/` or `/checkout/`.

## Architecture

**Data:**
- `src/data/venue.ts` holds venue config: name, address, opening hours, service charge and VAT rates, hold minutes, booking window.
- `src/data/experiences.ts` holds the tea packages (price, days of week, time slots, capacity per slot, menu, terms), the add-ons and the occasion options.
- All prices are in VND.

**Booking flow:** `/` → `/experiences/[slug]` → `/checkout` → `/payment` → `/confirmation`, plus `/my-bookings`. State passes between pages only through the Zustand store in `src/lib/store.ts`, persisted to `localStorage`. There are no query strings.

- `startHold()` creates a `draft` with `holdExpiresAt`. Checkout and payment show `HoldExpired` when the hold runs out.
- `setGuest()` and `setAddonQty()` fill in the draft.
- `confirm()` turns the draft into a `Booking`, sets `lastCode` and clears the draft. `PaymentView` keeps a `paid` flag so the "no draft" empty state does not flash before the redirect.

**Availability:** `src/lib/availability.ts` simulates seat availability. "Seats taken" is a deterministic hash of slug + date + time, minus the user's own confirmed bookings. When a backend is added, this file and the store actions are the only places to swap in API calls.

**Pricing:** `src/lib/pricing.ts` has `computeTotals()`.
- Package price comes from `packagePrice()`: when an experience has `pairPrice` (the 2-person combo from the offer posters), each pair of guests is charged `pairPrice` and an odd guest pays `pricePerGuest`.
- The total is that package price + add-ons, then service charge, then VAT on (subtotal + service charge).
- The booking widget, the order summary and payment all go through these functions.

**Hydration rule:** pages are prerendered at build time, but they depend on `localStorage` and on the current date. Any component that reads the store or calls `new Date()` for availability must render a skeleton until `useHydrated()` returns true. Current examples are `BookingWidget` → `WidgetBody`, and each `*-view.tsx` under `checkout/`, `payment/`, `confirmation/` and `my-bookings/`.

**Page pattern:** for client pages, `page.tsx` is a server component that exports `metadata` and renders a `"use client"` `*-view.tsx` component.

**Styling:**
- Tailwind v4 design tokens (colors `forest`, `gold`, `cream`, `ink` and others; fonts `font-display` and `font-sans`) are defined in `@theme` in `src/app/globals.css`.
- Use v4 class names, e.g. `bg-linear-to-*`, not `bg-gradient-to-*`.
- Shared class strings (`btn.*`, `input`, `eyebrow`) and `cn()` live in `src/components/ui.ts`.
- No component library is used.

**Images:**
- `Photo` (`src/components/photo.tsx`) shows `src` when it is set. Otherwise it draws a gradient by `tone` plus an SVG line illustration (`art`: cup, stand or pot).
- To use real photos, put them in `public/images/` and set `image` on each experience.
