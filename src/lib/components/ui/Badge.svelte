<script lang="ts">
	let { label }: { label: string } = $props();
</script>

<span
	class="inline-block rounded-full border border-edge bg-elevated px-3 py-1 font-mono text-xs text-muted"
>
	{label}
</span>
