# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
pnpm dev        # Start development server (Next.js)
pnpm build      # Production build
pnpm start      # Start production server
pnpm lint       # Run ESLint
```

No test suite is configured. Verify changes manually in the browser.

## Architecture

**Data flow:** All movie data comes from `https://phimapi.com` (KKPhim API, no auth). The Next.js API route at `app/api/kkphim/route.ts` proxies requests to avoid CORS. Server components fetch directly via `lib/kkphim.ts`, which wraps fetch with React `cache()` for deduplication and sets ISR revalidation per endpoint (180 s for latest, 300 s for lists, 600 s for detail, 3600 s for categories/countries, no cache for search).

**Routing:** App Router with Vietnamese-named segments — `/phim/[slug]` (detail), `/xem/[slug]` (watch), `/danh-sach/[type]` (list by type), `/the-loai/[slug]` (category), `/quoc-gia/[slug]` (country), `/tim-kiem` (search), `/yeu-thich` (favorites), `/lich-su` (history).

**Client state:** No global state library. Favorites (`truonglx:favorites`) and watch history (`truonglx:history`, max 50 entries, dedup by slug) live in `localStorage`, managed by `hooks/use-favorites.ts` and `hooks/use-watch-history.ts`.

**Styling:** Tailwind CSS v4 (PostCSS plugin, not the legacy CLI). Theme is pure Apple TV+ dark: `#000` background, `#1c1c1e` cards, `#8e8e93` secondary text. System font stack (`-apple-system, SF Pro`) — no Google Fonts. All theme tokens are CSS variables in `app/globals.css`.

**UI components:** shadcn/ui (New York style) with Radix UI primitives and Lucide icons. Carousel rows use Embla via shadcn's carousel component.

**Video player:** `@videojs/react` with VideoJS 10 beta. Playback tries native HLS first, falls back to embed iframe. Keyboard shortcuts: Space (play/pause), Left/Right arrows (±10 s), F (fullscreen).

## Key Gotchas

- **Next.js 16.2.6 + React 19** — APIs and conventions differ from earlier versions. Read `node_modules/next/dist/docs/` before touching routing, data fetching, or caching APIs.
- **Home page uses `Promise.allSettled`** — the phimapi.com API can 500 on specific endpoints; individual carousel failures must not crash the page.
- **Episode name normalization** — API returns either `"Tập 01"` or `"1"`. Check `startsWith("Tập")` before prepending the prefix to avoid `"Tập Tập 01"`.
- **Remote images** — `next.config.ts` allows any HTTP/HTTPS hostname with a 30-day cache TTL. Don't add host-specific patterns unnecessarily.
- **pnpm only** — project uses pnpm with a workspace config (`pnpm-workspace.yaml`). Don't use npm or yarn.
