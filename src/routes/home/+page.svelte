<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import HomeActivityChart from '$lib/components/home-activity-chart.svelte';
	import HomeKpiCards from '$lib/components/home-kpi-cards.svelte';
	import HomePlanChart from '$lib/components/home-plan-chart.svelte';
	import HomeRecentActivity from '$lib/components/home-recent-activity.svelte';
	import HomeRevenueChart from '$lib/components/home-revenue-chart.svelte';
	import SiteHeader from '$lib/components/site-header.svelte';
	import { activity, kpis, recent, revenueByMonth, usersByPlan } from './data';
</script>

<svelte:head><title>Home</title></svelte:head>

<Sidebar.Provider
	style="--sidebar-width: calc(var(--spacing) * 72); --header-height: calc(var(--spacing) * 12);"
>
	<AppSidebar variant="inset" />
	<Sidebar.Inset>
		<SiteHeader title="Home" />
		<div class="flex flex-1 flex-col">
			<div class="@container/main flex flex-1 flex-col gap-2">
				<div class="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
					<HomeKpiCards items={kpis} />
					<div class="px-4 lg:px-6">
						<HomeActivityChart data={activity} />
					</div>
					<div class="grid gap-4 px-4 lg:px-6 @3xl/main:grid-cols-5">
						<div class="@3xl/main:col-span-3"><HomeRevenueChart data={revenueByMonth} /></div>
						<div class="@3xl/main:col-span-2"><HomePlanChart data={usersByPlan} /></div>
					</div>
					<div class="px-4 lg:px-6">
						<HomeRecentActivity items={recent} />
					</div>
				</div>
			</div>
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>
