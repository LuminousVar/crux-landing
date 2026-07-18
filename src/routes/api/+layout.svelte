<script lang="ts">
	import { page } from '$app/state';
	import { slide } from 'svelte/transition';
	import { BookOpen, FileText, Search, X } from 'lucide-svelte';
	import type { LayoutData } from './$types';

	let { children, data }: { children: import('svelte').Snippet; data: LayoutData } = $props();

	// Slug of the API collection currently open, e.g. /api/devices → "devices".
	let currentApi = $derived(page.params.collection ?? '');
	let onOverview = $derived(page.url.pathname === '/api');

	// Sidebar filter — quick navigation across every collection from any API page.
	let q = $state('');
	let filteredApi = $derived(
		q.trim() === ''
			? data.apiNav
			: data.apiNav.filter((c) => c.label.toLowerCase().includes(q.toLowerCase()))
	);
</script>

<div class="min-h-screen bg-canvas pt-[4.25rem]">
	<div class="flex">
		<!-- API navigation — separate from the Docs sidebar -->
		<aside class="hidden w-72 shrink-0 border-r border-edge bg-surface/20 md:block">
			<nav
				class="sticky top-[4.25rem] h-[calc(100vh-4.25rem)] overflow-y-auto px-4 py-6 [scrollbar-width:thin]"
			>
				<!-- Section switch back to the narrative docs -->
				<a
					href="/docs"
					class="mb-5 flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-muted transition-colors hover:bg-elevated hover:text-content"
				>
					<BookOpen size={15} class="shrink-0 text-muted/50" />
					<span>Documentation</span>
				</a>

				<!-- Filter -->
				<div class="relative mb-6">
					<Search
						size={14}
						class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted/50"
					/>
					<input
						bind:value={q}
						type="text"
						placeholder="Filter endpoints…"
						class="w-full rounded-lg border border-edge bg-canvas py-2 pl-9 pr-8 text-sm text-content placeholder:text-muted/40 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30"
					/>
					{#if q}
						<button
							onclick={() => (q = '')}
							aria-label="Clear filter"
							class="absolute right-3 top-1/2 -translate-y-1/2 text-muted/40 transition-colors hover:text-muted"
						>
							<X size={13} />
						</button>
					{/if}
				</div>

				<p class="mb-1 px-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-accent/80">
					API Reference
				</p>

				{#if filteredApi.length === 0}
					<p class="px-2 text-sm text-muted/50">No matches for "{q}"</p>
				{:else}
					<ul class="mt-0.5 space-y-0.5" transition:slide={{ duration: 160 }}>
						<li>
							<a
								href="/api"
								class="group flex items-center gap-2.5 rounded-md py-1.5 pl-2.5 pr-2 text-sm transition-colors duration-100
									{onOverview
									? 'bg-accent/10 font-medium text-accent'
									: 'text-muted hover:bg-elevated hover:text-content'}"
							>
								<FileText
									size={15}
									class="shrink-0 {onOverview
										? 'text-accent'
										: 'text-muted/50 group-hover:text-muted'}"
								/>
								<span class="truncate">Overview</span>
							</a>
						</li>
						{#each filteredApi as col (col.slug)}
							{@const active = col.slug === currentApi}
							<li>
								<a
									href="/api/{col.slug}"
									class="group flex items-center justify-between gap-2 rounded-md py-1.5 pl-2.5 pr-2 text-sm transition-colors duration-100
										{active
										? 'bg-accent/10 font-medium text-accent'
										: 'text-muted hover:bg-elevated hover:text-content'}"
								>
									<span class="truncate">{col.label}</span>
									<span
										class="shrink-0 font-mono text-[10px] {active
											? 'text-accent/70'
											: 'text-muted/40'}"
									>
										{col.count}
									</span>
								</a>
							</li>
						{/each}
					</ul>
				{/if}
			</nav>
		</aside>

		<div class="min-w-0 flex-1">{@render children()}</div>
	</div>
</div>
