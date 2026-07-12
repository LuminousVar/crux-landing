<script lang="ts">
	import { page } from '$app/state';
	import { docGroups } from '$lib/docs';
	import { Search, X } from 'lucide-svelte';

	let { children } = $props();

	let isSlug = $derived(page.url.pathname !== '/docs');
	let currentSlug = $derived(page.params.slug ?? '');

	// Sidebar filter — quick navigation across all modules from any docs page.
	let q = $state('');
	let filteredGroups = $derived(
		q.trim() === ''
			? docGroups
			: docGroups
					.map((g) => ({
						...g,
						modules: g.modules.filter((m) => m.label.toLowerCase().includes(q.toLowerCase()))
					}))
					.filter((g) => g.modules.length > 0)
	);
</script>

<div class="min-h-screen bg-canvas">
	<header class="sticky top-0 z-50 border-b border-edge bg-canvas/95 backdrop-blur-sm">
		<div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-2">
			<!-- Logo + breadcrumb -->
			<div class="flex items-center gap-3">
				<a href="/" aria-label="Crux home" class="flex items-center gap-2">
					<img src="/crux-logo.png" alt="" class="h-10 w-auto" aria-hidden="true" />
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

	<div class="mx-auto flex max-w-6xl">
		<!-- Global navigation — persists across the index and every module page -->
		<aside class="hidden w-60 shrink-0 border-r border-edge md:block">
			<nav
				class="sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto px-3 py-6 [scrollbar-width:thin]"
			>
				<!-- Filter -->
				<div class="relative mb-5">
					<Search
						size={14}
						class="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted/50"
					/>
					<input
						bind:value={q}
						type="text"
						placeholder="Filter docs…"
						class="w-full rounded border border-edge bg-surface py-1.5 pl-8 pr-7 text-sm text-content placeholder:text-muted/40 focus:border-accent focus:outline-none"
					/>
					{#if q}
						<button
							onclick={() => (q = '')}
							aria-label="Clear filter"
							class="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted/40 transition-colors hover:text-muted"
						>
							<X size={13} />
						</button>
					{/if}
				</div>

				{#if filteredGroups.length === 0}
					<p class="px-2 text-sm text-muted/50">No matches</p>
				{:else}
					{#each filteredGroups as group (group.key)}
						<p class="mb-2 px-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted/50">
							{group.label}
						</p>
						<ul class="mb-5 space-y-0.5">
							{#each group.modules as mod (mod.slug)}
								<li>
									<a
										href="/docs/{mod.slug}"
										class="block rounded px-2 py-1.5 text-sm transition-colors duration-100
											{mod.slug === currentSlug ? 'font-medium text-accent' : 'text-muted hover:text-content'}"
									>
										{mod.label}
									</a>
								</li>
							{/each}
						</ul>
					{/each}
				{/if}
			</nav>
		</aside>

		<div class="min-w-0 flex-1">{@render children()}</div>
	</div>
</div>
