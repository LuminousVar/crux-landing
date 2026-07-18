<script lang="ts">
	import CodeBlock from './code-block.svelte';
	import type { ApiSample } from '$lib/api-reference';

	// Each sample arrives with its Shiki-rendered HTML already attached (see the
	// collection page's +page.server.ts).
	type RenderedSample = ApiSample & { html: string };

	let { samples }: { samples: RenderedSample[] } = $props();

	// Empty until the user picks a tab; falls back to the first sample.
	let active = $state('');
	let currentId = $derived(active || (samples[0]?.id ?? ''));
	let current = $derived(samples.find((s) => s.id === currentId) ?? samples[0]);
</script>

<div>
	<div class="mb-2 flex flex-wrap gap-1">
		{#each samples as s (s.id)}
			<button
				type="button"
				onclick={() => (active = s.id)}
				class="rounded px-2.5 py-1 font-mono text-[11px] transition-colors
					{currentId === s.id ? 'bg-elevated text-accent' : 'text-muted/60 hover:text-muted'}"
			>
				{s.label}
			</button>
		{/each}
	</div>
	{#if current}
		<CodeBlock label="Request" code={current.code} html={current.html} />
	{/if}
</div>
