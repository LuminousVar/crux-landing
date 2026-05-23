<script lang="ts">
	import type { Snippet } from 'svelte';
	let {
		number,
		tag,
		title,
		description,
		imageSide = 'right',
		visual
	}: {
		number: string;
		tag: string;
		title: string;
		description: string;
		imageSide?: 'left' | 'right';
		visual: Snippet;
	} = $props();
</script>

<div
	class="grid grid-cols-1 items-center gap-12 py-16 lg:grid-cols-2 lg:gap-20"
	class:lg:flex-row-reverse={imageSide === 'left'}
>
	<div class={imageSide === 'left' ? 'lg:order-2' : 'lg:order-1'}>
		<p class="mb-3 font-mono text-xs uppercase tracking-widest text-muted">
			{number} // {tag}
		</p>
		<h3 class="mb-4 text-2xl font-semibold text-content">{title}</h3>
		<p class="leading-relaxed text-muted">{description}</p>
	</div>
	<div class={imageSide === 'left' ? 'lg:order-1' : 'lg:order-2'}>
		{@render visual()}
	</div>
</div>
