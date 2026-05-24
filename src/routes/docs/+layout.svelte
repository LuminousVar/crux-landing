<script lang="ts">
	let { children } = $props();
</script>

<div class="min-h-screen bg-canvas">
	<header class="sticky top-0 z-50 border-b border-edge bg-canvas/95 backdrop-blur-sm">
		<div class="mx-auto flex h-12 max-w-6xl items-center justify-between px-6">
			<div class="flex items-center gap-4">
				<a href="/" class="font-mono text-sm font-bold tracking-[0.1em] text-accent">CRUX</a>
				<span class="text-edge">/</span>
				<span class="text-xs text-muted">Documentation</span>
			</div>
			<a href="/" class="text-xs text-muted transition-colors hover:text-content">← Back to site</a>
		</div>
	</header>

	{@render children()}
</div>
