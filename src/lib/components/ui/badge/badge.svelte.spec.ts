import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { createRawSnippet } from 'svelte';
import Badge from './badge.svelte';

describe('badge.svelte', () => {
	it('renders its children', async () => {
		render(Badge, {
			children: createRawSnippet(() => ({ render: () => '<span>In Process</span>' }))
		});

		await expect.element(page.getByText('In Process')).toBeInTheDocument();
	});
});
