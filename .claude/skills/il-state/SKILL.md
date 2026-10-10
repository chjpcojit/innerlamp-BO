---
name: il-state
description: Write client-side state, viewmodels and pure logic for innerlamp-bo with Svelte 5 runes (.svelte.ts classes, $state/$derived, context). Use when UI needs filtering, selection, form state, derived values or any logic that should be testable outside a component. No server/API concerns.
---

# Client state & viewmodels

Goal: components render; **logic lives in plain TS that can be tested without a browser DOM**.

## Choose the layer
1. **Pure functions** (`*.ts`) — formatting, sorting, validation, calculations. No runes. Preferred whenever state is not needed.
2. **Viewmodel class** (`*.svelte.ts`) — owns `$state`, exposes `$derived` and intent methods (`select(id)`, `setFilter(x)`). One viewmodel per screen/feature.
3. **Shared/global state** — only when two distant components need it. Provide via `setContext`/`getContext` from the layout; avoid module-level singletons (they leak between tests and SSR requests).
4. **Component-local `$state`** — trivial UI toggles (open/closed) only.

## Viewmodel template
```ts
// src/lib/viewmodels/task-list.svelte.ts
import { SvelteSet } from 'svelte/reactivity';
import type { Schema } from '$lib/components/schemas';

export class TaskListViewModel {
	items = $state<Schema[]>([]);
	query = $state('');
	selectedIds = new SvelteSet<number>();

	visible = $derived(
		this.items.filter((i) => i.header.toLowerCase().includes(this.query.toLowerCase()))
	);
	selectedCount = $derived(this.selectedIds.size);

	constructor(items: Schema[]) {
		this.items = items;
	}

	toggle(id: number) {
		if (this.selectedIds.has(id)) this.selectedIds.delete(id);
		else this.selectedIds.add(id); // SvelteSet is deeply reactive
	}
}
```
Use in a component: `const vm = new TaskListViewModel(data);` then bind `vm.visible`, call `vm.toggle(id)`.

## Rules
- File must be named `*.svelte.ts` to use runes outside components. Import it without the `.ts` (`'./task-list.svelte'`).
- Data in, data out: take initial data via the constructor/args (from props or mock). Never call `fetch` here; the API layer is a separate concern.
- `$derived` for anything computable from state; never sync two `$state`s with `$effect`. Reserve `$effect` for side effects (DOM, timers, storage) and clean up what it starts.
- For `Set`/`Map` use `SvelteSet`/`SvelteMap` from `svelte/reactivity` (ESLint `svelte/prefer-svelte-reactivity` rejects the built-ins). Arrays and plain objects in `$state` are deeply reactive; mutate or reassign.
- Validate untrusted shapes with `zod` (`src/lib/components/schemas.ts` is the pattern) at the boundary, keep inner logic typed and trusting.
- Browser-only APIs (`window`, `localStorage`, `matchMedia`) go behind `$effect` or `svelte/reactivity` helpers (see `hooks/is-mobile.svelte.ts`) so SSR does not crash.
- Any viewmodel or pure logic file **must ship with tests** — see `il-testing`.
