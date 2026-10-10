import { describe, expect, it } from 'vitest';
import { ApiError } from './api';
import { changePassword, login } from './login';

function fakeFetch(status: number, body: unknown) {
	const calls: { url: string; init: RequestInit }[] = [];
	const fn = (async (url: string, init: RequestInit) => {
		calls.push({ url, init });
		return new Response(JSON.stringify(body), { status });
	}) as unknown as typeof fetch;
	return { fn, calls };
}

const ok = {
	success: true,
	data: {
		access_token: 'tok',
		admin: { id: 1, email: 'admin', name: 'A', role: 'admin' },
		must_change_password: true
	}
};

describe('login', () => {
	it('posts credentials and maps the response', async () => {
		const { fn, calls } = fakeFetch(200, ok);
		const r = await login('admin', 'admin', fn);
		expect(calls[0].url).toMatch(/\/v1\/admin\/auth\/login$/);
		expect(JSON.parse(calls[0].init.body as string)).toEqual({ email: 'admin', password: 'admin' });
		expect(r).toMatchObject({ accessToken: 'tok', mustChangePassword: true });
	});

	it('throws ApiError with backend code on 401', async () => {
		const { fn } = fakeFetch(401, { success: false, error: { code: 'INVALID_CREDENTIALS' } });
		const err = await login('x', 'y', fn).catch((e) => e);
		expect(err).toBeInstanceOf(ApiError);
		expect(err.code).toBe('INVALID_CREDENTIALS');
	});

	it('maps network failure', async () => {
		const fn = (async () => {
			throw new TypeError('fail');
		}) as unknown as typeof fetch;
		const err = await login('x', 'y', fn).catch((e) => e);
		expect(err.code).toBe('NETWORK_ERROR');
	});
});

describe('changePassword', () => {
	it('sends snake_case body with Bearer token', async () => {
		const { fn, calls } = fakeFetch(200, ok);
		await changePassword('tok', 'old', 'newnewnewnew1', fn);
		const headers = calls[0].init.headers as Record<string, string>;
		expect(headers.Authorization).toBe('Bearer tok');
		expect(JSON.parse(calls[0].init.body as string)).toEqual({
			current_password: 'old',
			new_password: 'newnewnewnew1'
		});
	});
});
