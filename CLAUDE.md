# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

There is no test suite configured.

## Architecture

**CineVN** is a Vietnamese movie streaming app built on Next.js 16 App Router with React 19 and Tailwind CSS 4.

### Routing

```
/                        → Homepage (parallel-fetched movie rows)
/phim/[slug]             → Movie detail (SSG, revalidates every 1h)
/xem/[slug]/[tap]        → Watch/player page (client component)
/tim-kiem                → Search (Suspense + no-store fetch)
/danh-sach/[type]        → Filtered lists (latest/series/single/tv/coming-soon)
/the-loai/[slug]         → Genre pages
/quoc-gia/[slug]         → Country pages
/yeu-thich               → Favorites (client-only, localStorage)
```

### Data Fetching

All API calls go through `src/lib/api.ts`, which wraps the external OPhim18 API (`https://ophim1.com`). Two response shapes exist and are both normalized to internal types defined in `src/lib/types.ts`. Revalidation constants live in `src/lib/constants.ts`.

Cache strategy by route:
- Latest movies: 5 min
- Movie detail: 1 hour
- List pages: 10 min
- Genres/countries: 24 hours
- Search: `no-store`

Failed API calls return empty arrays rather than throwing — this is intentional.

### State Management

No global state library. Client-side persistence is localStorage only via two hooks:
- `src/hooks/useFavorites.ts` — favorites (max 200), synced cross-tab via `CustomEvent`
- `src/hooks/useWatchHistory.ts` — watch history (max 50), auto-added 5 seconds after episode starts

### Component Structure

```
src/components/
├── ui/          Shadcn-based primitives
├── layout/      Navbar, Footer, Providers (ThemeProvider — dark forced)
├── movie/       MovieCard, MovieGrid, MovieRow, MovieHero, EpisodeList, MovieInfoPanel
├── player/      PlayerWrapper, VideoPlayer (dynamic import), EmbedPlayer (iframe fallback)
├── search/      SearchInput, Pagination
└── favorites/   FavoriteButton, HistoryList
```

`VideoPlayer` is loaded with `next/dynamic` (SSR disabled) because Video.js is browser-only. If an M3U8 stream URL is unavailable, `PlayerWrapper` falls back to `EmbedPlayer`.

### Styling

Tailwind CSS 4 with dark theme forced via `forcedTheme="dark"`. Brand accent color is `#e8d5b7`. Fonts: Playfair Display (display) and DM Sans (body) from Google Fonts.

### Image Optimization

Remote images are allowed from `ophim1.com` and `img.ophim.live` — configured in `next.config.ts`.

### Path Alias

`@/*` maps to `src/*` (configured in `tsconfig.json`).

### API Documentation

See `api-doc.md` for the complete OPhim18 API reference.
