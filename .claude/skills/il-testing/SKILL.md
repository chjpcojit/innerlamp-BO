---
name: il-testing
description: Write and run tests for innerlamp-bo client code — pure logic, rune-based viewmodels/state, Svelte components (Vitest browser mode) and E2E (Playwright). Use whenever adding or changing logic, state, a component or a page.
---

# Client testing

Two runners, configured in `vite.config.ts` and `playwright.config.ts`. **The file name decides where a test runs.**

| What | File name | Runs in |
|---|---|---|
| Pure functions, viewmodel state/derived | `foo.spec.ts` next to `foo.ts` / `foo.svelte.ts` | Vitest `server` project (Node) |
| Tests that need runes themselves (`$effect`, `$state` in the test) or a real DOM | `foo.svelte.spec.ts` | Vitest `client` project (headless Chromium) |
| Component rendering/interaction | `foo.svelte.spec.ts` next to `foo.svelte` | Vitest `client` project |
| Page flows, navigation, layout | `e2e/<name>.e2e.ts` | Playwright against `build && preview` (port 4173) |

`expect: { requireAssertions: true }` is on: a test with no `expect` fails.

## Decide what to write
- New/changed **pure logic** → unit test every branch and edge case (empty, boundary, invalid).
- New/changed **viewmodel** → test initial state, each intent method, each `$derived` after changes, and collection behaviour (e.g. SvelteSet add/delete). Node project is enough; no component needed.
- New/changed **component** → one test per meaningful behaviour (renders content, variant, click/keyboard → callback). Do not snapshot markup.
- New **page/route** or cross-component flow → one E2E happy path. Keep E2E few and stable.

## Patterns (verified working in this repo)
Viewmodel in Node:
```ts
import { expect, it } from 'vitest';
import { Counter } from './counter.svelte';

it('derives from state', () => {
	const c = new Counter();
	c.inc();
	expect(c.double).toBe(2);
});
```
Effects (needs `.svelte.spec.ts`):
```ts
import { flushSync } from 'svelte';
const cleanup = $effect.root(() => {
	const c = new Counter();
	$effect(() => { seen.push(c.count); });
	flushSync();
	c.inc();
	flushSync();
});
cleanup();
```
Component:
```ts
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';

render(Badge, { children: createRawSnippet(() => ({ render: () => '<span>Hi</span>' })) });
await expect.element(page.getByText('Hi')).toBeInTheDocument();
```
E2E: `await page.goto('/dashboard-01'); await expect(page.getByRole('table')).toBeVisible();`

## Rules
- Query by role/text (`getByRole`, `getByText`), not CSS classes.
- Await `expect.element(...)` in browser tests (auto-retry); do not use fixed sleeps.
- Tests are independent: build fresh state per test, no module-level singletons.
- No network in these tests. Anything needing a server response is out of scope for this skill.
- Reference tests: `src/lib/components/schemas.spec.ts`, `src/lib/components/ui/badge/badge.svelte.spec.ts`, `e2e/dashboard.e2e.ts`.

## Run
`npm run test:unit -- --run` (all Vitest) · `npx vitest --run <path>` (one file) · `npm run test:e2e` (Playwright; first time needs `npx playwright install chromium`) · `npm test` (both).
