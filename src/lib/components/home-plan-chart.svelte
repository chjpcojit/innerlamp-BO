<script lang="ts">
	import { PieChart } from 'layerchart';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Chart from '$lib/components/ui/chart/index.js';

	let { data }: { data: { plan: string; users: number; color: string }[] } = $props();

	const total = $derived(data.reduce((sum, d) => sum + d.users, 0));
	const chartConfig = $derived(
		Object.fromEntries(data.map((d) => [d.plan, { label: d.plan, color: d.color }]))
	) as Chart.ChartConfig;
</script>

<Card.Root class="@container/card">
	<Card.Header>
		<Card.Title>Users by plan</Card.Title>
		<Card.Description>{total.toLocaleString('en-US')} users in total</Card.Description>
	</Card.Header>
	<Card.Content>
		<Chart.Container config={chartConfig} class="mx-auto aspect-square h-[240px]">
			<PieChart
				{data}
				key="plan"
				value="users"
				c="color"
				innerRadius={60}
				props={{ pie: { motion: 'tween' } }}
			>
				{#snippet tooltip()}
					<Chart.Tooltip hideLabel />
				{/snippet}
			</PieChart>
		</Chart.Container>
		<ul class="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
			{#each data as d (d.plan)}
				<li class="flex items-center gap-1.5">
					<span class="size-2.5 rounded-sm" style:background-color={d.color}></span>
					{d.plan}
				</li>
			{/each}
		</ul>
	</Card.Content>
</Card.Root>
