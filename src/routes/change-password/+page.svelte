<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';

	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { ApiError } from '$lib/auth/api';
	import { changePassword } from '$lib/auth/login';
	import { clearSession, loadSession, saveSession } from '$lib/auth/session';

	const MIN_LENGTH = 12;

	let currentPassword = $state('');
	let newPassword = $state('');
	let confirm = $state('');
	let error = $state('');
	let loading = $state(false);
	let mismatch = $derived(confirm !== '' && newPassword !== confirm);
	let tooShort = $derived(newPassword !== '' && newPassword.length < MIN_LENGTH);

	$effect(() => {
		if (!loadSession()) void goto(resolve('/login'));
	});

	async function onsubmit(e: SubmitEvent) {
		e.preventDefault();
		const session = loadSession();
		if (!session) return void goto(resolve('/login'));
		error = '';
		loading = true;
		try {
			const r = await changePassword(session.accessToken, currentPassword, newPassword);
			saveSession({ accessToken: r.accessToken, admin: r.admin });
			await goto(resolve('/home'));
		} catch (err) {
			if (err instanceof ApiError && err.code === 'UNAUTHORIZED') {
				clearSession();
				await goto(resolve('/login'));
				return;
			}
			error = err instanceof Error ? err.message : 'Change password failed';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head><title>Change password</title></svelte:head>

<main class="flex min-h-svh items-center justify-center bg-muted/40 p-4">
	<Card.Root class="w-full max-w-sm">
		<Card.Header>
			<Card.Title>Change password</Card.Title>
			<Card.Description>You must set a new password before continuing.</Card.Description>
		</Card.Header>
		<form {onsubmit}>
			<Card.Content class="flex flex-col gap-4">
				{#if error}
					<p role="alert" class="text-sm text-destructive">{error}</p>
				{/if}
				<div class="flex flex-col gap-2">
					<Label for="current-password">Current password</Label>
					<Input
						id="current-password"
						type="password"
						autocomplete="current-password"
						required
						bind:value={currentPassword}
					/>
				</div>
				<div class="flex flex-col gap-2">
					<Label for="new-password">New password</Label>
					<Input
						id="new-password"
						type="password"
						autocomplete="new-password"
						required
						aria-invalid={tooShort}
						bind:value={newPassword}
					/>
					{#if tooShort}
						<p role="alert" class="text-sm text-destructive">
							Must be at least {MIN_LENGTH} characters.
						</p>
					{/if}
				</div>
				<div class="flex flex-col gap-2">
					<Label for="confirm-password">Confirm password</Label>
					<Input
						id="confirm-password"
						type="password"
						autocomplete="new-password"
						required
						aria-invalid={mismatch}
						bind:value={confirm}
					/>
					{#if mismatch}
						<p role="alert" class="text-sm text-destructive">Passwords do not match.</p>
					{/if}
				</div>
			</Card.Content>
			<Card.Footer class="mt-4">
				<Button
					type="submit"
					class="w-full"
					disabled={loading || mismatch || tooShort || !newPassword || !currentPassword}
				>
					Change password
				</Button>
			</Card.Footer>
		</form>
	</Card.Root>
</main>
