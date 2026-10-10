import { post, toAuthResult, type AuthResult } from './api';

export type LoginResult = AuthResult;

export async function login(
	email: string,
	password: string,
	fetchFn: typeof fetch = fetch
): Promise<LoginResult> {
	return toAuthResult(await post('/v1/admin/auth/login', { email, password }, undefined, fetchFn));
}

export async function changePassword(
	token: string,
	currentPassword: string,
	newPassword: string,
	fetchFn: typeof fetch = fetch
): Promise<AuthResult> {
	return toAuthResult(
		await post(
			'/v1/admin/auth/change-password',
			{ current_password: currentPassword, new_password: newPassword },
			token,
			fetchFn
		)
	);
}
