// Mock data for the home dashboard layout. Replace with API data once endpoints exist.
// Deterministic (no Math.random) so SSR and hydration render the same values.

export type Kpi = {
	label: string;
	value: string;
	delta: number; // percent vs previous period
	hint: string;
};

export const kpis: Kpi[] = [
	{ label: 'Total users', value: '12,480', delta: 8.2, hint: 'vs previous 30 days' },
	{ label: 'Active today', value: '1,946', delta: 3.1, hint: 'vs yesterday' },
	{ label: 'Revenue (30d)', value: '$48,200', delta: -2.4, hint: 'vs previous 30 days' },
	{ label: 'Open tickets', value: '37', delta: -12.5, hint: 'vs last week' }
];

const DAY = 86_400_000;
const start = Date.UTC(2026, 8, 9);

export const activity = Array.from({ length: 30 }, (_, i) => {
	const wave = Math.sin(i / 3) * 40 + Math.cos(i / 5) * 25;
	return {
		date: new Date(start + i * DAY),
		signups: Math.round(120 + i * 2.5 + wave),
		sessions: Math.round(260 + i * 4 + wave * 1.6)
	};
});

export const revenueByMonth = [
	{ month: 'May', revenue: 31200 },
	{ month: 'Jun', revenue: 35800 },
	{ month: 'Jul', revenue: 33900 },
	{ month: 'Aug', revenue: 42100 },
	{ month: 'Sep', revenue: 48200 },
	{ month: 'Oct', revenue: 21400 }
];

export const usersByPlan = [
	{ plan: 'Free', users: 7420, color: 'var(--chart-1)' },
	{ plan: 'Basic', users: 3180, color: 'var(--chart-2)' },
	{ plan: 'Pro', users: 1420, color: 'var(--chart-3)' },
	{ plan: 'Team', users: 460, color: 'var(--chart-4)' }
];

export type RecentItem = {
	id: number;
	who: string;
	action: string;
	status: 'success' | 'pending' | 'failed';
	time: string;
};

export const recent: RecentItem[] = [
	{
		id: 1,
		who: 'linh.tran@example.com',
		action: 'Upgraded to Pro',
		status: 'success',
		time: '2 min ago'
	},
	{
		id: 2,
		who: 'minh.le@example.com',
		action: 'Refund requested',
		status: 'pending',
		time: '18 min ago'
	},
	{
		id: 3,
		who: 'an.nguyen@example.com',
		action: 'Payment failed',
		status: 'failed',
		time: '41 min ago'
	},
	{
		id: 4,
		who: 'hoa.pham@example.com',
		action: 'Account created',
		status: 'success',
		time: '1 h ago'
	},
	{
		id: 5,
		who: 'khoa.vo@example.com',
		action: 'Password reset',
		status: 'success',
		time: '3 h ago'
	}
];
