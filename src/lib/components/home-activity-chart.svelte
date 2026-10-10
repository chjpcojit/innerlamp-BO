<script lang="ts">
	import { scaleUtc } from 'd3-scale';
	import { curveNatural } from 'd3-shape';
	import { Area, AreaChart } from 'layerchart';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Chart from '$lib/components/ui/chart/index.js';

	let { data }: { data: { date: Date; signups: number; sessions: number }[] } = $props();

	const chartConfig = {
		sessions: { label: 'Sessions', color: 'var(--chart-2)' },
		signups: { label: 'Sign-ups', color: 'var(--primary)' }
	} satisfies Chart.ChartConfig;

	const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
</script>

<Card.Root class="@container/card">
	<Card.Header>
		<Card.Title>Activity</Card.Title>
		<Card.Description>Sign-ups and sessions, last 30 days</Card.Description>
	</Card.Header>
	<Card.Content class="px-2 pt-4 sm:px-6">
		<Chart.Container config={chartConfig} class="aspect-auto h-[260px] w-full">
			<AreaChart
				legend
				{data}
				x="date"
				xScale={scaleUtc()}
				series={[
					{ key: 'sessions', label: chartConfig.sessions.label, color: chartConfig.sessions.color },
					{ key: 'signups', label: chartConfig.signups.label, color: chartConfig.signups.color }
				]}
				props={{ xAxis: { format: fmt }, yAxis: { format: () => '' } }}
			>
				{#snippet marks({ context })}
					{#each context.series.visibleSeries as s (s.key)}
						<Area
							seriesKey={s.key}
							curve={curveNatural}
							fillOpacity={0.25}
							line={{ class: 'stroke-1' }}
							motion="tween"
							{...s.props}
						/>
					{/each}
				{/snippet}
				{#snippet tooltip()}
					<Chart.Tooltip labelFormatter={fmt} indicator="line" />
				{/snippet}
			</AreaChart>
		</Chart.Container>
	</Card.Content>
</Card.Root>
