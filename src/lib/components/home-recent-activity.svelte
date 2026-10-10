<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';

	type Item = {
		id: number;
		who: string;
		action: string;
		status: 'success' | 'pending' | 'failed';
		time: string;
	};

	let { items }: { items: Item[] } = $props();

	const variant = { success: 'secondary', pending: 'outline', failed: 'destructive' } as const;
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Recent activity</Card.Title>
		<Card.Description>Latest events across the platform</Card.Description>
	</Card.Header>
	<Card.Content>
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>User</Table.Head>
					<Table.Head>Event</Table.Head>
					<Table.Head>Status</Table.Head>
					<Table.Head class="text-end">Time</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each items as item (item.id)}
					<Table.Row>
						<Table.Cell class="font-medium">{item.who}</Table.Cell>
						<Table.Cell>{item.action}</Table.Cell>
						<Table.Cell><Badge variant={variant[item.status]}>{item.status}</Badge></Table.Cell>
						<Table.Cell class="text-end text-muted-foreground">{item.time}</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</Card.Content>
</Card.Root>
