<script lang="ts">
	import { Info, AlertTriangle, Lightbulb } from 'lucide-svelte';
	import type { DocCallout } from '$lib/docs';

	let { type, text }: DocCallout = $props();

	const config = {
		note: { Icon: Info, label: 'Note', accent: 'var(--color-accent)' },
		warning: { Icon: AlertTriangle, label: 'Warning', accent: 'var(--color-warning)' },
		tip: { Icon: Lightbulb, label: 'Tip', accent: 'var(--color-success)' }
	} as const;

	let c = $derived(config[type]);
</script>

<div
	class="flex gap-3 rounded-lg border border-edge bg-elevated px-4 py-3"
	style="border-left: 2px solid {c.accent}"
>
	<c.Icon size={15} class="mt-0.5 shrink-0" style="color: {c.accent}" />
	<div class="min-w-0">
		<p class="mb-0.5 text-xs font-semibold" style="color: {c.accent}">{c.label}</p>
		<p class="text-sm leading-relaxed text-content/80">{text}</p>
	</div>
</div>
