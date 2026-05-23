<script lang="ts">
	let { value, label }: { value: string; label: string } = $props();
</script>

<div class="flex flex-col items-center gap-1">
	<span class="font-mono text-3xl font-bold text-accent">{value}</span>
	<span class="text-sm text-muted">{label}</span>
</div>
