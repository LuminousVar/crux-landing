<script lang="ts">
	// Colour-codes an HTTP method like a real API console: read = blue, create =
	// green, mutate = amber, delete = red. Uses the design tokens, no hardcoded hex.
	let { method, class: className = '' }: { method: string; class?: string } = $props();

	const styles: Record<string, string> = {
		GET: 'text-accent border-accent/40 bg-accent/10',
		POST: 'text-success border-success/40 bg-success/10',
		PUT: 'text-warning border-warning/40 bg-warning/10',
		PATCH: 'text-warning border-warning/40 bg-warning/10',
		DELETE: 'text-danger border-danger/40 bg-danger/10'
	};
	let cls = $derived(styles[method] ?? 'text-muted border-edge bg-elevated');
</script>

<span
	class="inline-block rounded border px-2 py-0.5 text-center font-mono text-[11px] font-semibold tracking-wide {cls} {className}"
>
	{method}
</span>
