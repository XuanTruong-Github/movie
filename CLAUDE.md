# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Vietnamese movie streaming platform built with Next.js App Router (v16), React 19, TypeScript, and Tailwind CSS v4. Data is sourced from the ophim1.com API. The app can be deployed to either a Node.js server or Cloudflare Workers via OpenNext.

## Commands

```bash
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm start        # Run production server (0.0.0.0:3000)
pnpm lint         # ESLint check
pnpm preview      # Build + preview Cloudflare Workers locally
pnpm deploy       # Deploy to Cloudflare Workers
pnpm cf-typegen   # Regenerate Cloudflare env types
```

## Architecture

### Data Fetching

All data fetching is server-side. The single API client lives in [configs/api.ts](configs/api.ts) and wraps `fetch` with a base URL from `BASE_URL` env var (default: `https://ophim1.com`). All endpoints follow the pattern `/v1/api/*`. There is no client-side data fetching layer or caching abstraction — pages call the API directly in their async server components.

### Routing

App Router with these route segments:
- `/` — homepage
- `/movie/[slug]` — movie detail + video player
- `/danh-sach/[slug]` — category listings (e.g. `phim-bo`, `phim-le`, `phim-chieu-rap`)
- `/the-loai/[slug]` — genre filter
- `/quoc-gia/[slug]` — country filter
- `/search?q=` — search results

### State Management

No global state library. The only client-side state is the dark/light theme, handled by `next-themes` via [providers/theme-provider.tsx](providers/theme-provider.tsx). Everything else is server-rendered.

### Component Conventions

- `components/ui/` — shadcn/ui primitives (generated via `pnpm dlx shadcn add <component>`)
- `components/layout/` — header, menu, navigation
- `components/movie/` — player, trailer
- `components/home/` — homepage sections
- `components/common/` — shared components like pagination
- Mark components `"use client"` only when browser APIs or interactivity are needed

### Type Definitions

All API response types are in [lib/types.ts](lib/types.ts). Key types: `MovieDetail`, `MovieListItem`, `MovieListResponse`, `MovieEpisode`, `MovieEpisodeServer`, `SeoOnPage`, `PaginationData`.

### Path Aliases

Use `@/` to import from the project root (e.g. `@/components/ui/button`, `@/lib/types`).

### Image CDN

Remote images come from `img.ophim.live`. The `next.config.ts` allowlists this domain for `next/image` optimization.

## Deployment

Two deployment targets are supported:

- **Node.js**: `pnpm build && pnpm start`
- **Cloudflare Workers**: `pnpm deploy` (uses OpenNext adapter configured in [open-next.config.ts](open-next.config.ts) and [wrangler.jsonc](wrangler.jsonc))

## Environment Variables

| Variable   | Default                    | Purpose             |
|------------|----------------------------|---------------------|
| `BASE_URL` | `https://ophim1.com`       | API backend base URL |
