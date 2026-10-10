const BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8081';

export type Admin = { id: number; email: string; name: string; role: string };
export type AuthResult = { accessToken: string; admin: Admin; mustChangePassword: boolean };

export class ApiError extends Error {
	constructor(
		readonly code: string,
		message: string,
		readonly status: number
	) {
		super(message);
	}
}

const MESSAGES: Record<string, string> = {
	VALIDATION_ERROR: 'Please check the information you entered.',
	INVALID_CREDENTIALS: 'Invalid email or password.',
	PASSWORD_EXPIRED: 'Your temporary password has expired. Ask an administrator to reset it.',
	UNAUTHORIZED: 'Your session has expired. Please sign in again.',
	FORBIDDEN: 'You do not have permission to do that.',
	WRONG_CURRENT_PASSWORD: 'Current password is incorrect.',
	WEAK_PASSWORD: 'New password is too weak.',
	INTERNAL_ERROR: 'Something went wrong on our side. Please try again.',
	NETWORK_ERROR: 'Cannot reach the server. Please try again.'
};

export function messageFor(code: string): string {
	return MESSAGES[code] ?? 'Request failed. Please try again.';
}

type Envelope = {
	success: boolean;
	data?: Record<string, unknown>;
	error?: { code?: string; message?: string };
};

export async function post(
	path: string,
	body: unknown,
	token?: string,
	fetchFn: typeof fetch = fetch
): Promise<Record<string, unknown>> {
	let res: Response;
	try {
		res = await fetchFn(`${BASE_URL}${path}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				...(token ? { Authorization: `Bearer ${token}` } : {})
			},
			body: JSON.stringify(body)
		});
	} catch {
		throw new ApiError('NETWORK_ERROR', messageFor('NETWORK_ERROR'), 0);
	}
	let env: Envelope | null = null;
	try {
		env = (await res.json()) as Envelope;
	} catch {
		// non-JSON body; handled below
	}
	if (!res.ok || !env?.success || !env.data) {
		const code = env?.error?.code ?? 'INTERNAL_ERROR';
		throw new ApiError(code, messageFor(code), res.status);
	}
	return env.data;
}

export function toAuthResult(data: Record<string, unknown>): AuthResult {
	return {
		accessToken: String(data.access_token),
		admin: data.admin as Admin,
		mustChangePassword: Boolean(data.must_change_password)
	};
}
