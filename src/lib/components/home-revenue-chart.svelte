<script lang="ts">
	import { scaleBand } from 'd3-scale';
	import { BarChart } from 'layerchart';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Chart from '$lib/components/ui/chart/index.js';

	let { data }: { data: { month: string; revenue: number }[] } = $props();

	const chartConfig = {
		revenue: { label: 'Revenue', color: 'var(--primary)' }
	} satisfies Chart.ChartConfig;
</script>

<Card.Root class="@container/card">
	<Card.Header>
		<Card.Title>Revenue</Card.Title>
		<Card.Description>Monthly, last 6 months (current month in progress)</Card.Description>
	</Card.Header>
	<Card.Content>
		<Chart.Container config={chartConfig} class="aspect-auto h-[240px] w-full">
			<BarChart
				{data}
				xScale={scaleBand().padding(0.3)}
				x="month"
				axis="x"
				rule={false}
				series={[{ key: 'revenue', label: 'Revenue', color: chartConfig.revenue.color }]}
				props={{ bars: { stroke: 'none', rounded: 'all', radius: 6 } }}
			>
				{#snippet tooltip()}
					<Chart.Tooltip hideLabel />
				{/snippet}
			</BarChart>
		</Chart.Container>
	</Card.Content>
</Card.Root>
