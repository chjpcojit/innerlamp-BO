<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import AlertCircleIcon from '@tabler/icons-svelte/icons/alert-circle';
	import EyeIcon from '@tabler/icons-svelte/icons/eye';
	import EyeOffIcon from '@tabler/icons-svelte/icons/eye-off';
	import InnerShadowTopIcon from '@tabler/icons-svelte/icons/inner-shadow-top';
	import LoaderIcon from '@tabler/icons-svelte/icons/loader-2';
	import LockIcon from '@tabler/icons-svelte/icons/lock';
	import UserIcon from '@tabler/icons-svelte/icons/user';
	import ThemeToggle from '$lib/components/theme-toggle.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { login } from '$lib/auth/login';
	import { loadRememberedEmail, saveRememberedEmail, saveSession } from '$lib/auth/session';

	const rememberedEmail = loadRememberedEmail();
	let email = $state(rememberedEmail);
	let remember = $state(rememberedEmail !== '');
	let showForgot = $state(false);
	let password = $state('');
	let showPassword = $state(false);
	let error = $state('');
	let loading = $state(false);
	const dev = import.meta.env.DEV;
	let usernameEl = $state<HTMLInputElement | null>(null);

	$effect(() => {
		usernameEl?.focus();
	});

	// Dev shortcut: bypasses the API entirely, so no session is stored.
	function skipLogin() {
		void goto(resolve('/home'));
	}

	async function onsubmit(e: SubmitEvent) {
		e.preventDefault();
		error = '';
		loading = true;
		try {
			const { accessToken, admin, mustChangePassword } = await login(email, password);
			saveSession({ accessToken, admin });
			saveRememberedEmail(email, remember);
			await goto(resolve(mustChangePassword ? '/change-password' : '/home'));
		} catch (err) {
			error = err instanceof Error ? err.message : 'Login failed';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head><title>Sign in</title></svelte:head>

<main class="grid min-h-svh lg:grid-cols-2">
	<section class="flex flex-col p-6 md:p-10">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-2 font-semibold">
				<span
					class="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"
				>
					<InnerShadowTopIcon class="size-5" />
				</span>
				<span class="text-lg tracking-tight">Innerlamp</span>
			</div>
			<ThemeToggle />
		</div>

		<div class="flex flex-1 items-center justify-center">
			<div class="w-full max-w-sm animate-in duration-500 fade-in slide-in-from-bottom-2">
				<div class="mb-8 flex flex-col gap-2">
					<h1 class="text-2xl font-semibold tracking-tight">Welcome back</h1>
					<p class="text-sm text-muted-foreground">
						Sign in to your account to access the backoffice.
					</p>
				</div>

				<form {onsubmit} class="flex flex-col gap-5">
					{#if error}
						<div
							role="alert"
							class="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
						>
							<AlertCircleIcon class="mt-0.5 size-4 shrink-0" />
							<span>{error}</span>
						</div>
					{/if}

					<div class="grid gap-2">
						<Label for="email">Email</Label>
						<div class="relative">
							<UserIcon
								class="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
							/>
							<Input
								id="email"
								bind:ref={usernameEl}
								class="h-10 ps-9"
								placeholder="Enter your email"
								autocomplete="username"
								required
								bind:value={email}
							/>
						</div>
					</div>

					<div class="grid gap-2">
						<Label for="password">Password</Label>
						<div class="relative">
							<LockIcon
								class="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
							/>
							<Input
								id="password"
								type={showPassword ? 'text' : 'password'}
								class="h-10 px-9"
								placeholder="Enter your password"
								autocomplete="current-password"
								required
								bind:value={password}
							/>
							<Button
								type="button"
								variant="ghost"
								size="icon"
								class="absolute end-1 top-1/2 size-8 -translate-y-1/2 text-muted-foreground"
								aria-label={showPassword ? 'Hide password' : 'Show password'}
								onclick={() => (showPassword = !showPassword)}
							>
								{#if showPassword}
									<EyeOffIcon class="size-4" />
								{:else}
									<EyeIcon class="size-4" />
								{/if}
							</Button>
						</div>
					</div>

					<div class="flex items-center justify-between gap-2">
						<div class="flex items-center gap-2">
							<Checkbox id="remember" bind:checked={remember} />
							<Label for="remember" class="font-normal">Remember me</Label>
						</div>
						<Button
							type="button"
							variant="link"
							class="h-auto p-0 text-sm"
							aria-expanded={showForgot}
							aria-controls="forgot-hint"
							onclick={() => (showForgot = !showForgot)}
						>
							Forgot password?
						</Button>
					</div>

					{#if showForgot}
						<p id="forgot-hint" class="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
							Please contact an administrator to reset your password.
						</p>
					{/if}

					<Button type="submit" class="h-10 w-full" disabled={loading}>
						{#if loading}
							<LoaderIcon class="size-4 animate-spin" />
							Signing in…
						{:else}
							Sign in
						{/if}
					</Button>

					{#if dev}
						<Button type="button" variant="outline" class="h-10 w-full" onclick={skipLogin}>
							Skip sign in (dev only)
						</Button>
					{/if}
				</form>
			</div>
		</div>

		<p class="text-xs text-muted-foreground">
			© {new Date().getFullYear()} Innerlamp. Access restricted to authorized administrators.
		</p>
	</section>

	<aside
		class="relative hidden overflow-hidden bg-zinc-950 p-10 text-zinc-50 lg:flex lg:flex-col lg:justify-end"
		aria-hidden="true"
	>
		<div
			class="absolute inset-0 bg-[radial-gradient(60%_50%_at_20%_15%,--alpha(var(--color-amber-400)/28%),transparent),radial-gradient(50%_45%_at_85%_85%,--alpha(var(--color-indigo-500)/25%),transparent)]"
		></div>
		<div
			class="absolute inset-0 bg-[linear-gradient(to_right,--alpha(white/6%)_1px,transparent_1px),linear-gradient(to_bottom,--alpha(white/6%)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)] bg-[size:48px_48px]"
		></div>

		<figure class="relative flex max-w-md flex-col gap-4">
			<blockquote class="text-2xl leading-snug font-medium tracking-tight">
				Everything you need to manage Innerlamp, in one place.
			</blockquote>
			<figcaption class="text-sm text-zinc-400">Innerlamp Backoffice</figcaption>
		</figure>
	</aside>
</main>
