<script lang="ts">
	import { Check, Copy, Terminal } from 'lucide-svelte';
	import { cn } from '$lib/utils';

	interface Props {
		label: string;
		html: string;
		code: string;
		class?: string;
	}

	let { label, html, code, class: className }: Props = $props();

	let copied = $state(false);

	function handleCopy() {
		navigator.clipboard.writeText(code).then(() => {
			copied = true;
			setTimeout(() => (copied = false), 1800);
		});
	}
</script>

<div class={cn('overflow-hidden rounded-lg border border-edge', className)}>
	<!-- Header bar -->
	<div class="flex items-center justify-between border-b border-edge bg-elevated px-4 py-2.5">
		<div class="flex items-center gap-3">
			<!-- Traffic lights -->
			<div class="flex items-center gap-1.5">
				<span class="h-2.5 w-2.5 rounded-full bg-danger/40"></span>
				<span class="h-2.5 w-2.5 rounded-full bg-warning/40"></span>
				<span class="h-2.5 w-2.5 rounded-full bg-success/40"></span>
			</div>
			<!-- Label -->
			<div class="flex items-center gap-1.5 text-muted/50">
				<Terminal size={11} />
				<span class="font-mono text-[11px] tracking-wide">{label}</span>
			</div>
		</div>

		<!-- Copy button -->
		<button
			onclick={handleCopy}
			class="flex items-center gap-1.5 rounded px-2 py-1 font-mono text-[11px] text-muted/40 transition-all duration-150 hover:bg-canvas hover:text-muted"
			aria-label="Copy code"
		>
			{#if copied}
				<Check size={11} class="text-success" />
				<span class="text-success">copied</span>
			{:else}
				<Copy size={11} />
				<span>copy</span>
			{/if}
		</button>
	</div>

	<!-- Code body — shiki renders a <pre><code> inside the div -->
	<div class="shiki-wrap overflow-x-auto px-5 py-4">
		{@html html}
	</div>
</div>

<style>
	/* Strip shiki's own background so our container bg shows through */
	.shiki-wrap :global(pre) {
		background: transparent !important;
		padding: 0;
		margin: 0;
		tab-size: 2;
	}

	.shiki-wrap :global(code) {
		font-family: 'Fira Code', 'Cascadia Code', 'SF Mono', 'JetBrains Mono', 'Menlo', 'Consolas',
			monospace;
		font-size: 0.8125rem;
		line-height: 1.75;
		counter-reset: none;
	}

	/* Smooth selection highlight */
	.shiki-wrap :global(code ::selection) {
		background: rgba(59, 130, 246, 0.25);
	}
</style>
