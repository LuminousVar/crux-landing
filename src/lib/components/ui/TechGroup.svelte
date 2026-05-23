<script lang="ts">
	let { layer, items }: { layer: string; items: { name: string }[] } = $props();
</script>

<div class="flex flex-col gap-3 sm:flex-row sm:items-start">
	<span class="w-28 shrink-0 font-mono text-xs uppercase tracking-widest text-muted pt-1">
		{layer}
	</span>
	<div class="flex flex-wrap gap-2">
		{#each items as item}
			<span
				class="rounded-md border border-edge bg-elevated px-3 py-1.5 font-mono text-xs text-content"
			>
				{item.name}
			</span>
		{/each}
	</div>
</div>
