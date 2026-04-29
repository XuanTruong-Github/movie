---
name: Build & Dev Commands
description: Project build, dev, and deployment commands
type: project
---

## Development

```bash
pnpm dev       # Next.js dev server at localhost:3000
pnpm build     # Production Next.js build
pnpm start     # Start production server (binds 0.0.0.0)
pnpm lint      # Run ESLint (next/core-web-vitals + typescript rules)
```

## Cloudflare Deployment

```bash
pnpm preview      # opennextjs-cloudflare build then local Cloudflare preview
pnpm deploy       # opennextjs-cloudflare build then deploy to Cloudflare Workers
pnpm upload       # opennextjs-cloudflare build then upload assets only
pnpm cf-typegen   # Generate Cloudflare env types → cloudflare-env.d.ts
```

**How to apply:** Start with `pnpm dev` for local development. Use `pnpm preview` to test Cloudflare deployment locally before running `pnpm deploy` to production.
