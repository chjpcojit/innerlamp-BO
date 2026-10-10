import type { Admin } from './api';

const KEY = 'innerlamp-bo.session';
export type Session = { accessToken: string; admin: Admin };

// sessionStorage: token is short-lived (30 min) and there is no refresh/logout endpoint.
export function saveSession(s: Session): void {
	try {
		sessionStorage.setItem(KEY, JSON.stringify(s));
	} catch {
		// storage unavailable; user will have to sign in again
	}
}

export function loadSession(): Session | null {
	try {
		const raw = sessionStorage.getItem(KEY);
		return raw ? (JSON.parse(raw) as Session) : null;
	} catch {
		return null;
	}
}

export function clearSession(): void {
	try {
		sessionStorage.removeItem(KEY);
	} catch {
		// ignore
	}
}

const REMEMBER_KEY = 'innerlamp-bo.remembered-email';

// Remember-me only stores the sign-in identifier, never the password or token.
export function loadRememberedEmail(storage: Pick<Storage, 'getItem'> = localStorage): string {
	try {
		return storage.getItem(REMEMBER_KEY) ?? '';
	} catch {
		return '';
	}
}

export function saveRememberedEmail(
	email: string,
	remember: boolean,
	storage: Pick<Storage, 'setItem' | 'removeItem'> = localStorage
): void {
	try {
		if (remember) storage.setItem(REMEMBER_KEY, email);
		else storage.removeItem(REMEMBER_KEY);
	} catch {
		// storage unavailable; nothing to remember
	}
}
