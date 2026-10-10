<script lang="ts">
	import MoonIcon from '@tabler/icons-svelte/icons/moon';
	import SunIcon from '@tabler/icons-svelte/icons/sun';
	import { Button } from '$lib/components/ui/button/index.js';
	import { theme } from '$lib/hooks/theme.svelte';
	import { onMount } from 'svelte';

	let { class: className }: { class?: string } = $props();

	onMount(() => theme.init());
</script>

<Button
	variant="ghost"
	size="icon"
	class={className}
	aria-label={theme.current === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
	onclick={() => theme.toggle()}
>
	{#if theme.current === 'dark'}
		<SunIcon class="size-4" />
	{:else}
		<MoonIcon class="size-4" />
	{/if}
</Button>
