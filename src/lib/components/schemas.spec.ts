import { describe, expect, it } from 'vitest';
import data from '../../routes/dashboard-01/data';
import { schema } from './schemas';

describe('schema', () => {
	it('accepts every row of the dashboard-01 mock data', () => {
		for (const row of data) {
			expect(schema.safeParse(row).success).toBe(true);
		}
	});

	it('rejects a row with a non-numeric id', () => {
		const result = schema.safeParse({ ...data[0], id: 'not-a-number' });
		expect(result.success).toBe(false);
	});

	it('rejects a row missing required fields', () => {
		expect(schema.safeParse({ id: 1 }).success).toBe(false);
	});
});
