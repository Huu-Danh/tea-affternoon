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

**Styling (luxury look):**
- Tailwind v4 design tokens are defined in `@theme` in `src/app/globals.css`:
  - Colors: Hilton navy `navy`/`navy-dark`, ivory `cream`/`paper`/`sand`, champagne `gold`/`gold-soft`, plus `ink`, `muted` and `line`. There is no `forest` color any more.
  - Fonts: `font-display` (Cormorant), `font-sans` (Be Vietnam Pro) and `font-script` (Pinyon Script, used for short English accents such as "Afternoon Tea").
  - `.lattice` is the gold diamond pattern used on navy sections.
- Corners are sharp. Containers use `rounded-sm` or `rounded-xs`, and `rounded-full` is kept only for circles.
- Buttons in `btn.*` are uppercase with wide tracking. Shared class strings and `cn()` live in `src/components/ui.ts`.
- Use v4 class names, e.g. `bg-linear-to-*`, not `bg-gradient-to-*`. No component library is used.
- Because of CSS `uppercase`, `innerText` on buttons returns upper case. Match on `textContent` in tests.

**Motion and layout pieces:**
- `Intro` (in `layout.tsx`) is a pure-CSS splash: classes `.intro*` in `globals.css`. It shows only on full page loads.
- `SiteHeader` is transparent with the white logo over the home hero. It turns solid after 40px of scroll, using `useSyncExternalStore` on scroll. The home hero uses `-mt-16 lg:-mt-20` to slide under the header.
- `SmoothScroll` runs Lenis in `components/smooth-scroll.tsx`:
  - The header offset for anchors comes from CSS `scroll-padding-top`, and Lenis subtracts it itself. Do not also pass an `offset`.
  - On every pathname change it calls `lenis.resize()` before scrolling. Without that, Lenis keeps the previous page's scroll limit and `/#hash` links from other pages stop short.
  - `getLenis()?.stop()/start()` locks scrolling, e.g. in the gallery lightbox.
- `Reveal` fades content in. `RevealMask` reveals images with a clip-path. In `RevealMask` the in-view observer must sit on an unclipped outer element: a fully clipped element that is already on screen at load never reports as in view.
- `Photo` has a `kenBurns` prop for a slow zoom. `Ornament` (in `photo.tsx`) is the gold divider.
- `Gallery` (`components/gallery.tsx`) opens a lightbox for items that have a `src`.

**Media assets:**
- Images are WebP. `public/images/*.webp` and `public/logo*.webp` were made from the jpg/png originals with sharp at quality 82–85.
- The mp3s in `public/music/` (`clair-de-lune`, `european-classic`, `european-premium`) were loudness-normalized to -16 LUFS (ffmpeg `loudnorm`, two passes) and re-encoded at 128 kbps. Because of that, a single `venue.music.volume` fits all tracks.
- Process new media the same way. The originals are still in `public/` but are not referenced.

**Images:**
- `Photo` (`src/components/photo.tsx`) shows `src` when it is set. Otherwise it draws a gradient by `tone` plus an SVG line illustration (`art`: cup, stand or pot).
- To use real photos, put them in `public/images/` and set `image` on each experience.

**Background music:**
- `BackgroundMusic` (`src/components/background-music.tsx`) has no UI. By the owner's choice there is no play/mute button.
- It is rendered in the root layout, so the music keeps playing across client-side navigations. The volume and the default track are set in `venue.music`.
- The track depends on the page, and `trackFor()` picks it:
  - `/experiences/[slug]` plays that experience's `music`.
  - `/checkout`, `/payment` and `/confirmation` play the music of the draft's experience. If there is no draft, they use the last booking's experience. This matters because `confirm()` clears the draft before the redirect, and without the fallback the track would restart.
  - Every other page plays the default track.
- Tracks are crossfaded on a single reused `Audio` element. Reusing it keeps the browser's autoplay permission.
- File names in `public/music/` may contain spaces, so the URL goes through `encodeURI()`.
- On mount it calls `audio.play()`. Browsers usually block autoplay with sound; when that happens it retries on the first pointer, touch or key event. Scrolling does not count as a user activation.
- It pauses while the tab is hidden.
- On a local Windows static build, navigation becomes full page reloads (see the Windows build note), so the music restarts. Test this with `next dev`.
- When testing with puppeteer, do not wait for `networkidle`: once the mp3 is streaming, the network never goes idle.
