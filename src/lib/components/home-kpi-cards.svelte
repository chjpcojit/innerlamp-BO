<script lang="ts">
	import TrendingDownIcon from '@tabler/icons-svelte/icons/trending-down';
	import TrendingUpIcon from '@tabler/icons-svelte/icons/trending-up';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';

	type Kpi = { label: string; value: string; delta: number; hint: string };

	let { items }: { items: Kpi[] } = $props();
</script>

<div
	class="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card"
>
	{#each items as kpi (kpi.label)}
		<Card.Root class="@container/card">
			<Card.Header>
				<Card.Description>{kpi.label}</Card.Description>
				<Card.Title class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
					{kpi.value}
				</Card.Title>
				<Card.Action>
					<Badge variant="outline">
						{#if kpi.delta >= 0}
							<TrendingUpIcon />
						{:else}
							<TrendingDownIcon />
						{/if}
						{kpi.delta > 0 ? '+' : ''}{kpi.delta}%
					</Badge>
				</Card.Action>
			</Card.Header>
			<Card.Footer class="text-sm text-muted-foreground">{kpi.hint}</Card.Footer>
		</Card.Root>
	{/each}
</div>
