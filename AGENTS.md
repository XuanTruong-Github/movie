# Repository Guidelines

## Project Overview

This repository is a KKPhim movie streaming web app built with Next.js `16.2.6`, React 19, TypeScript, Tailwind CSS v4, and shadcn-style local UI components. Package manager is `pnpm`.

The KKPhim API reference is in `api-doc.md`. The API base URL is `https://phimapi.com`.

## Important Commands

- Install dependencies: `pnpm install`
- Start dev server: `pnpm dev`
- Lint: `pnpm lint`
- Production build: `pnpm build`

Next/Turbopack builds may need to run outside restrictive sandboxes because CSS processing can create worker processes.

## Architecture Notes

- App Router pages live under `app/`.
- KKPhim server-side API wrapper and normalizers live in `lib/kkphim.ts`.
- Shared data types live in `lib/types.ts`.
- Local reusable UI components live in `components/` and `components/ui/`.
- Client playback logic lives in `components/movie-player.tsx`.
- Client-accessible API proxy route is `app/api/kkphim/route.ts`.

KKPhim list endpoints have two response shapes:
- `/danh-sach/phim-moi-cap-nhat` returns `items` at the root.
- `/v1/api/...` returns `data.items` and `data.params.pagination`.

Keep both shapes supported when changing `lib/kkphim.ts`.

## Player Constraints

The user explicitly required `@videojs/react`; do not silently replace it with another Video.js React wrapper. Current package is `@videojs/react@10.0.0-beta.23`.

The player uses `@videojs/react` for native HLS-capable browsers and falls back to KKPhim `link_embed` when HLS is not supported natively. Do not add `hls.js` unless the user approves installing that dependency.

Playback features expected:
- playback rate controls,
- progress resume via `localStorage`,
- keyboard shortcuts,
- fullscreen,
- next episode/autoplay where supported.

## UI Guidelines

- UI language is Vietnamese.
- Theme is dark cinema by default.
- Prefer existing local shadcn-style components before adding new markup.
- Use semantic Tailwind token classes and keep spacing with `gap-*`.
- Avoid introducing a light/dark theme toggle unless requested.

## Verification

Before handing off changes, run:

```bash
pnpm lint
pnpm build
```

For runtime checks, verify representative routes:
- `/`
- `/danh-sach/phim-le?page=1`
- `/tim-kiem?keyword=naruto`
- `/phim/[slug]`
- `/xem/[slug]?server=0&episode=0`
