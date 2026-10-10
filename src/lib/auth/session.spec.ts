import { describe, expect, it } from 'vitest';
import { loadRememberedEmail, saveRememberedEmail } from './session';

function memoryStorage() {
	const m = new Map<string, string>();
	return {
		getItem: (k: string) => m.get(k) ?? null,
		setItem: (k: string, v: string) => void m.set(k, v),
		removeItem: (k: string) => void m.delete(k)
	};
}

describe('remembered email', () => {
	it('stores and loads the email when remember is on', () => {
		const s = memoryStorage();
		saveRememberedEmail('a@b.c', true, s);
		expect(loadRememberedEmail(s)).toBe('a@b.c');
	});

	it('clears the email when remember is off', () => {
		const s = memoryStorage();
		saveRememberedEmail('a@b.c', true, s);
		saveRememberedEmail('a@b.c', false, s);
		expect(loadRememberedEmail(s)).toBe('');
	});

	it('returns empty when storage throws', () => {
		const broken = {
			getItem: () => {
				throw new Error('blocked');
			}
		};
		expect(loadRememberedEmail(broken)).toBe('');
	});
});
