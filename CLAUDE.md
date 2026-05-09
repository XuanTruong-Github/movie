# KKPhim Project Guidelines

## Project Stack

| Tool | Version |
|------|---------|
| Next.js | 16.2.6 |
| React | 19 |
| TypeScript | Latest |
| Tailwind CSS | v4 |
| Package Manager | pnpm |
| UI Components | shadcn-style (local) |

## API Reference

- **Base URL**: `https://phimapi.com`
- **API Doc**: See `api-doc.md` for full reference
- KKPhim API has two response formats:
  - `/danh-sach/phim-moi-cap-nhat` → `items` at root
  - `/v1/api/...` → `data.items` + `data.params.pagination`
  - Keep both shapes supported in `lib/kkphim.ts`

## Essential Commands

```bash
pnpm install      # Install dependencies
pnpm dev          # Start dev server
pnpm lint         # Run linter
pnpm build        # Production build
```

**Note**: Next/Turbopack builds may need to run outside restrictive sandboxes due to CSS processing worker processes.

## Project Structure

| Path | Purpose |
|------|---------|
| `app/` | App Router pages |
| `lib/kkphim.ts` | API wrapper & normalizers |
| `lib/types.ts` | Shared data types |
| `components/` | Reusable UI components |
| `components/ui/` | shadcn-style components |
| `components/movie-player.tsx` | Client playback logic |
| `app/api/kkphim/route.ts` | Client-accessible API proxy |

## Player Implementation

**Fixed Requirement**: Use `@videojs/react` (v10.0.0-beta.23)
- Do NOT replace without explicit user approval
- Supports native HLS in capable browsers
- Falls back to KKPhim `link_embed` for unsupported browsers
- Do NOT add `hls.js` without user approval

**Expected Features**:
- Playback rate controls
- Progress resume (localStorage)
- Keyboard shortcuts
- Fullscreen support
- Next episode/autoplay

## UI/UX Standards

- **Language**: Vietnamese
- **Theme**: Dark cinema (default)
- **Component Priority**: Use existing shadcn-style components before creating new markup
- **Styling**: Semantic Tailwind tokens + `gap-*` for spacing
- **Light/Dark Toggle**: Avoid unless explicitly requested

## Test Routes Before Handoff

Always verify these routes after changes:

```
/
/danh-sach/phim-le?page=1
/tim-kiem?keyword=naruto
/phim/[slug]
/xem/[slug]?server=0&episode=0
```

Run pre-deployment checks:
```bash
pnpm lint
pnpm build
```

## Global Rules Applied

See `~/.claude/rules/` for global standards on:
- Communication (tiếng Việt + kỹ thuật tiếng Anh)
- Code standards (DRY/KISS/YAGNI)
- Security (no hardcoded secrets)
- Tooling (pnpm, Conventional Commits)
