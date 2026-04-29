---
name: Code Conventions
description: Naming, file structure, exports, imports, and component patterns
type: project
---

## Paths & Imports

- Path alias `@/*` maps to project root (`tsconfig.json` `paths`)
- Always use `@/` for imports from project root

## File Naming

- **Filenames:** lowercase kebab-case (`hero-slider.tsx`, `header-shell.tsx`)
- Applies to pages, layouts, and components

## Export Patterns

| Type | Pattern |
|------|---------|
| Pages/Layouts/Feature Components | Default export |
| UI Primitives (buttons, cards, etc.) | Named exports |
| Types & Constants | Named exports |

## Component Props

Feature components extend base div props:

```typescript
import { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

export default function MyComponent({ className, ...props }: ComponentProps<'div'>) {
  return <div {...props} className={cn('base-styles', className)} />
}
```

**Why:** Enables consumers to pass standard HTML attributes + custom className merging.

## Icons

- **Source of truth:** `components/ui/icons.tsx` (hand-rolled SVG components)
- **Do not install:** lucide-react or other icon libraries
- **How to add:** Define new SVG icon component in `icons.tsx` and export it

## Types

- **Shared API response types:** `lib/types.ts` only
- **No co-located type files** (e.g., don't create `product.types.ts`)
- Keep all types centralized for easy discovery

## HTML from API

Use `dangerouslySetInnerHTML` when rendering HTML from API (e.g., movie metadata).
Wrap with a container that sanitizes/contains the content when possible.
