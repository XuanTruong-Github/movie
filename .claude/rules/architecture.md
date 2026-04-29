---
name: Architecture & Tech Stack
description: Next.js 16 deployment to Cloudflare Workers, data fetching, and component structure
type: project
---

## Tech Stack

- **Framework:** Next.js 16 App Router (Server Components by default)
- **Deployment:** Cloudflare Workers via `@opennextjs/cloudflare`
- **UI Framework:** shadcn/ui (new-york style, neutral base colors, CSS variables)
- **Data Fetching:** Server-side via `configs/api.ts` (no client-side fetching library)
- **Playback:** `react-player` for m3u8 video streaming

## Deployment Model

- Pages are **Server Components by default**
- `"use client"` only in: `player.tsx`, `search.tsx`
- Bundled and deployed to Cloudflare Workers via opennextjs-cloudflare adapter
- Configuration in `wrangler.jsonc` (binds `ASSETS`, `IMAGES`, `WORKER_SELF_REFERENCE`)
- Incremental caching config in `open-next.config.ts` (R2 commented out)

## Data Fetching Pattern

All external data comes from single API endpoint:

```typescript
// configs/api.ts (use server)
fetch(BASE_URL + "/v1/api" + path)
```

**Important:** Each page defines its own local `getData()` / `getMovie()` function, called **separately** in both:
1. `generateMetadata()` for SSR metadata
2. The page component itself

**No shared cache/deduplication** between these calls — if needed, must be implemented per-page.

## Component Architecture

| Directory | Purpose |
|-----------|---------|
| `components/ui/` | shadcn/ui primitives + hand-rolled SVG icons |
| `components/layout/` | Header, Footer, layout wrappers |
| `components/home/` | Homepage feature components |
| `components/movie/` | Movie detail & player components |

Feature component props extend `ComponentProps<"div">` and spread `...props` with `className` merged via `cn()` from `lib/utils.ts`.

## Stateful Features

**Playback Resume** — `components/movie/player.tsx` saves/restores per-movie playback position via `localStorage`, keyed by `window.location.pathname`.

**Why:** Avoid reloading video from start when returning to a movie.

**How to apply:** When modifying player component or localStorage keys, preserve this behavior.
