import { expect, test } from '@playwright/test';

test('dashboard-01 renders header, sidebar and data table', async ({ page }) => {
	await page.goto('/dashboard-01');

	await expect(page.getByRole('heading', { name: 'Documents' })).toBeVisible();
	await expect(page.getByRole('table')).toBeVisible();
	await expect(page.getByText('Cover page').first()).toBeVisible();
});
