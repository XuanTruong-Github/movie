# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Dev Commands

```bash
pnpm dev       # Next.js dev server at localhost:3000
pnpm build     # Production Next.js build
pnpm start     # Start production server (binds 0.0.0.0)
pnpm lint      # Run ESLint (next/core-web-vitals + typescript rules)
pnpm preview   # opennextjs-cloudflare build then local Cloudflare preview
pnpm deploy    # opennextjs-cloudflare build then deploy to Cloudflare Workers
pnpm upload    # opennextjs-cloudflare build then upload assets only
pnpm cf-typegen  # Generate Cloudflare env types → cloudflare-env.d.ts
```

## Architecture

- Next.js 16 App Router deployed to **Cloudflare Workers** via `@opennextjs/cloudflare`; pages are Server Components by default, `"use client"` only in `player.tsx` and `search.tsx`
- All data comes from one external API: `fetch(BASE_URL + "/v1/api" + path)` via `configs/api.ts` (`"use server"`); no client-side fetching library
- Each page defines its own local `getData()`/`getMovie()` function, called separately in both `generateMetadata` and the page component (no shared cache/deduplication)
- UI is shadcn/ui (new-york style, neutral base, CSS variables) composed in `components/ui/`; custom feature components live in `components/layout/`, `components/home/`, `components/movie/`
- `components/movie/player.tsx` saves and restores per-movie playback position using `localStorage`, keyed by `window.location.pathname`

## Code Conventions

- `@/*` path alias maps to the project root (`tsconfig.json` `paths`)
- Filenames: lowercase kebab-case (`hero-slider.tsx`, `header-shell.tsx`)
- Default export for page/layout/feature components; named exports for UI primitives
- Feature component props extend `ComponentProps<"div">` and spread `...props` + merge `className` via `cn()` from `lib/utils.ts`
- Icons are hand-rolled SVGs in `components/ui/icons.tsx` — do not install lucide-react; add new icons there
- Shared API response types go in `lib/types.ts`; no co-located type files

## Testing

No test framework is configured. No test files exist in the repository.

## Key Files

- `configs/api.ts` — `"use server"` fetch wrapper; prepends `BASE_URL + "/v1/api"` to every request
- `lib/types.ts` — all shared TypeScript types (`MovieDetail`, `MovieListResponse`, etc.)
- `app/layout.tsx` — root layout: Geist fonts, `ThemeProvider` (dark default), `Header`, `Footer`
- `app/movie/[slug]/page.tsx` — movie detail page: breadcrumb, player or trailer, metadata card with `dangerouslySetInnerHTML` for API-supplied HTML
- `components/movie/player.tsx` — Client Component; m3u8 playback via `react-player`, localStorage resume, skip ±10s buttons
- `app/danh-sach/[slug]/page.tsx` — paginated movie list; pattern reused by `the-loai/` and `quoc-gia/` routes
- `components/ui/icons.tsx` — inline SVG icon components (source of truth; not lucide-react)
- `next.config.ts` — only config: `remotePatterns` allowing `img.ophim.live` for `next/image`
- `wrangler.jsonc` — Cloudflare Workers config; binds `ASSETS`, `IMAGES`, and `WORKER_SELF_REFERENCE`
- `open-next.config.ts` — Cloudflare adapter config (R2 incremental cache commented out)
