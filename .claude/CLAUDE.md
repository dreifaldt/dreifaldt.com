# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npm run dev      # Start Astro dev server
npm run build    # Type check (astro check) + production build
npm run preview  # Preview production build locally
npm run lint     # Run ESLint
```

## Stack

- **Astro 5** static site generator with **Svelte 5** for interactive components
- **TailwindCSS 4** for styling, **TypeScript 5.7** in strict mode
- **ESLint 9** flat config with @typescript-eslint, eslint-plugin-astro, eslint-plugin-svelte

## Architecture

```
src/
├── pages/        # Astro pages (file-based routing)
├── layouts/      # HTML shell layouts (BaseLayout.astro)
├── components/   # Svelte components hydrated client-side
└── styles/       # Global CSS with TailwindCSS imports
```

Static site with no backend. Astro handles page rendering; Svelte components provide client-side interactivity via `client:load` directive.

## Code Conventions

- **No `any` types** — enforced by ESLint (`@typescript-eslint/no-explicit-any: error`)
- **Svelte 5 reactivity**: use `$state()` for reactive state and `$effect()` for side effects (not `onMount`). Always clean up intervals/timers in effect cleanup functions.
- **Astro components**: frontmatter (`---`) for imports/logic, HTML below
- **Formatting**: single quotes, no semicolons, 2-space indent, 120 char width (Prettier)

## Design

Dark theme: gray-950 background, cyan-400 accents, terminal/monospace aesthetic with glow effects.
