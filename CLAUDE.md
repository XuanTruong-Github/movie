# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start Next.js dev server (http://localhost:3000)
pnpm build        # Production build
pnpm lint         # ESLint check
pnpm preview      # Build + preview on local Cloudflare Workers runtime
pnpm deploy       # Build + deploy to Cloudflare Workers
pnpm cf-typegen   # Regenerate Cloudflare env types (cloudflare-env.d.ts)
```

No test framework is configured.

## Architecture

**Next.js 16 App Router** targeting **Cloudflare Workers** via `@opennextjs/cloudflare`. All pages are Server Components by default; `"use client"` is used only where browser APIs or React state are required (player, search form).

**Data flow:** every page defines a local async fetch function (e.g. `getData`, `getMovie`) that calls `configs/api.ts` → `fetch(BASE_URL + "/v1/api" + path)`. There is no client-side data-fetching library (no React Query, SWR, etc.). The same fetch function is called twice per page — once in `generateMetadata` and once in the page component; there is no deduplication helper.

**Environment variable:** `BASE_URL` must be set for the API calls to work. It's the root of the upstream movie API.

**Directory layout:**
- `app/` — route pages and layouts (App Router)
- `components/ui/` — shadcn/ui primitives (new-york style, neutral base, CSS variables)
- `components/layout/` — Header (async Server Component), HeaderShell (sticky shell), Footer, Menu
- `components/home/` — homepage-specific sections
- `components/movie/` — `player.tsx` (Client Component, m3u8 via react-player, localStorage resume), `trailer.tsx`
- `components/common/` — shared non-primitive components (pagination)
- `lib/types.ts` — all shared TypeScript types
- `lib/utils.ts` — `cn()` (clsx + tailwind-merge)
- `lib/metadata.ts` — `toOpenGraphType()` helper
- `configs/api.ts` — `"use server"` fetch wrapper
- `providers/` — `ThemeProvider` (next-themes, defaults to dark)

**Routes:**
- `/` — homepage
- `/movie/[slug]` — movie detail + player
- `/danh-sach/[slug]` — paginated movie list (type-based)
- `/the-loai/[slug]` — paginated list by genre
- `/quoc-gia/[slug]` — paginated list by country
- `/search` — search results page

## Conventions

- **Path alias:** `@/` maps to the project root (e.g. `@/lib/types`, `@/components/ui/badge`).
- **Filenames:** lowercase kebab-case (`hero-slider.tsx`, `header-shell.tsx`).
- **Exports:** default export for page/layout/feature components; named exports for UI primitives.
- **Props:** feature components extend `ComponentProps<"div">` (or the relevant HTML element) and forward `...props` and `className` via `cn()`.
- **Icons:** hand-rolled inline SVGs in `components/ui/icons.tsx`. Do **not** install lucide-react — `components.json` lists it as `iconLibrary` for shadcn CLI scaffolding only, but the actual icon source is the local file.
- **Shadcn components:** add via `pnpm dlx shadcn@latest add <component>`, which places them in `components/ui/`.
- **Types:** add shared API response types to `lib/types.ts`.

## Anti-patterns to avoid

- Do not add `"use client"` to components that don't need browser APIs or hooks — keep the default Server Component boundary.
- Do not use `<img>` — always use `next/image` with appropriate `sizes` prop.
- Do not install a client-side state management library; server-fetched data is passed as props.
- Do not install lucide-react or any other icon library; add new icons to `components/ui/icons.tsx`.
- The `dangerouslySetInnerHTML` on the movie detail page is intentional — the upstream API returns HTML for movie descriptions.
