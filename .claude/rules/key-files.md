---
name: Key Files Map
description: Critical files and their purpose
type: project
---

## Core

| File             | Purpose                                                                                      |
| ---------------- | -------------------------------------------------------------------------------------------- |
| `configs/api.ts` | Server-side (`"use server"`) fetch wrapper; prepends `BASE_URL + "/v1/api"` to every request |
| `lib/types.ts`   | All shared TypeScript types (`MovieDetail`, `MovieListResponse`, etc.)                       |
| `lib/utils.ts`   | Utility functions, including `cn()` for className merging                                    |

## Layouts & Root

| File             | Purpose                                                                      |
| ---------------- | ---------------------------------------------------------------------------- |
| `app/layout.tsx` | Root layout: Geist fonts, `ThemeProvider` (dark default), `Header`, `Footer` |
| `tsconfig.json`  | Path aliases (`@/*`), TypeScript config                                      |
| `next.config.ts` | Only config: `remotePatterns` allowing `img.ophim.live` for `next/image`     |

## Pages

| File                            | Purpose                                                                                   |
| ------------------------------- | ----------------------------------------------------------------------------------------- |
| `app/movie/[slug]/page.tsx`     | Movie detail: breadcrumb, player or trailer, metadata card with `dangerouslySetInnerHTML` |
| `app/danh-sach/[slug]/page.tsx` | Paginated movie list; pattern reused by `the-loai/` and `quoc-gia/` routes                |

## Components

| File                          | Purpose                                                                                                     |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `components/movie/player.tsx` | Client Component (`"use client"`); m3u8 playback via `react-player`, localStorage resume, skip ±10s buttons |
| `components/ui/icons.tsx`     | Inline SVG icon components (source of truth; not lucide-react)                                              |

## Cloudflare Config

| File                  | Purpose                                                                      |
| --------------------- | ---------------------------------------------------------------------------- |
| `wrangler.jsonc`      | Cloudflare Workers config; binds `ASSETS`, `IMAGES`, `WORKER_SELF_REFERENCE` |
| `open-next.config.ts` | Cloudflare adapter config (R2 incremental cache commented out)               |
