---
name: il-quality
description: Checklist to run before calling any innerlamp-bo change done — type check, lint, tests, build. Use at the end of every task that touches code.
---

# Quality gate

Run in this order and read the output; do not report success from memory.

1. `npm run check` — svelte-check / TypeScript.
2. `npm run lint` — Prettier + ESLint. Only fix files you touched (`npx prettier --write <file>`).
3. `npm run test:unit -- --run` — Vitest (server + client projects).
4. `npm run test:e2e` — Playwright, when a route, layout or cross-component flow changed.
5. `npm run build` — must succeed.

## Known baseline (do not attribute to your change)
- `npm run check`: 1 error at `src/lib/components/data-table.svelte:216` (duplicate `@dnd-kit/geometry` versions). Any *additional* error is yours.
- `npm run lint`: ~164 Prettier warnings in generated/older files (double quotes). Do not mass-reformat; new/edited files must be clean.
- E2E logs `404 /avatars/shadcn.jpg`; harmless.

## Report
State which steps ran, results, and any step skipped with the reason. If something fails, show the failing output; do not mark the task complete.
Record non-obvious assumptions in `.assumptions.md`.
