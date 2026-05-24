<script lang="ts">
	import { page } from '$app/state';

	let { children } = $props();

	let isSlug = $derived(page.url.pathname !== '/docs');
</script>

<div class="min-h-screen bg-canvas">
	<header class="sticky top-0 z-50 border-b border-edge bg-canvas/95 backdrop-blur-sm">
		<div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-2">
			<!-- Logo + breadcrumb -->
			<div class="flex items-center gap-3">
				<a href="/" aria-label="Crux home" class="flex items-center gap-2">
					<img src="/crux-logo-nobg.svg" alt="" class="h-10 w-auto" aria-hidden="true" />
					<span class="font-mono text-lg font-bold leading-none text-accent">Crux</span>
				</a>
				<span class="text-sm text-muted/30">/</span>
				<a href="/docs" class="text-sm text-muted transition-colors hover:text-content"
					>Documentation</a
				>
			</div>

			<!-- Back link -->
			{#if isSlug}
				<a href="/docs" class="text-sm text-muted transition-colors hover:text-content"
					>← Back to docs</a
				>
			{:else}
				<a href="/" class="text-sm text-muted transition-colors hover:text-content"
					>← Back to site</a
				>
			{/if}
		</div>
	</header>

	{@render children()}
</div>
