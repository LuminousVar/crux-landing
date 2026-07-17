<script lang="ts">
	import { page } from '$app/state';
	import { slide } from 'svelte/transition';
	import { docGroups } from '$lib/docs';
	import { docIcon } from '$lib/doc-icons';
	import { ChevronDown, FileText, Search, X } from 'lucide-svelte';
	import type { LayoutData } from './$types';

	let { children, data }: { children: import('svelte').Snippet; data: LayoutData } = $props();

	let isSlug = $derived(page.url.pathname !== '/docs');
	let currentSlug = $derived(page.params.slug ?? '');
	// Slug of the API collection currently open, e.g. /docs/api/devices → "devices".
	let currentApi = $derived(
		page.url.pathname.startsWith('/docs/api/') ? (page.params.collection ?? '') : ''
	);
	let onApi = $derived(page.url.pathname.startsWith('/docs/api'));

	// The group whose module is currently open — used to auto-expand it.
	let activeGroupKey = $derived(
		docGroups.find((g) => g.modules.some((m) => m.slug === currentSlug))?.key ?? ''
	);

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
	let filteredApi = $derived(
		q.trim() === ''
			? data.apiNav
			: data.apiNav.filter((c) => c.label.toLowerCase().includes(q.toLowerCase()))
	);

	// Collapsed sections. A section is open when: the user is filtering (show every
	// match), the user explicitly opened it, or — by default — it holds the active
	// page. Doc groups default open; the long API list defaults closed unless active.
	let overrides = $state<Record<string, boolean>>({});
	function defaultOpen(key: string): boolean {
		if (key === 'api') return onApi;
		return true;
	}
	function isOpen(key: string): boolean {
		if (q.trim() !== '') return true;
		if (key === activeGroupKey && key !== '') return overrides[key] ?? true;
		return overrides[key] ?? defaultOpen(key);
	}
	function toggle(key: string): void {
		overrides = { ...overrides, [key]: !isOpen(key) };
	}
</script>

<div class="min-h-screen bg-canvas">
	<header class="sticky top-0 z-50 border-b border-edge bg-canvas/95 backdrop-blur-sm">
		<div class="flex items-center justify-between px-5 py-2.5">
			<!-- Logo + breadcrumb -->
			<div class="flex items-center gap-3">
				<a href="/" aria-label="Crux home" class="flex items-center gap-2">
					<img src="/crux-logo.png" alt="" class="h-9 w-auto" aria-hidden="true" />
					<span class="font-mono text-base font-bold leading-none text-accent">Crux</span>
				</a>
				<span class="text-sm text-muted/30">/</span>
				<a href="/docs" class="text-sm text-muted transition-colors hover:text-content">
					Documentation
				</a>
			</div>

			<!-- Back link -->
			{#if isSlug}
				<a href="/docs" class="text-sm text-muted transition-colors hover:text-content">
					← Back to docs
				</a>
			{:else}
				<a href="/" class="text-sm text-muted transition-colors hover:text-content">
					← Back to site
				</a>
			{/if}
		</div>
	</header>

	<div class="flex">
		<!-- Global navigation — persists across the index and every module page -->
		<aside class="hidden w-72 shrink-0 border-r border-edge bg-surface/20 md:block">
			<nav
				class="sticky top-[3.25rem] h-[calc(100vh-3.25rem)] overflow-y-auto px-4 py-6 [scrollbar-width:thin]"
			>
				<!-- Filter -->
				<div class="relative mb-6">
					<Search
						size={14}
						class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted/50"
					/>
					<input
						bind:value={q}
						type="text"
						placeholder="Filter documentation…"
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

				{#if filteredGroups.length === 0 && filteredApi.length === 0}
					<p class="px-2 text-sm text-muted/50">No matches for "{q}"</p>
				{:else}
					<div class="space-y-1">
						{#each filteredGroups as group (group.key)}
							{@const open = isOpen(group.key)}
							<section>
								<button
									type="button"
									onclick={() => toggle(group.key)}
									class="flex w-full items-center justify-between rounded-md px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted/60 transition-colors hover:text-content"
								>
									<span>{group.label}</span>
									<ChevronDown
										size={13}
										class="shrink-0 text-muted/40 transition-transform duration-200 {open
											? ''
											: '-rotate-90'}"
									/>
								</button>
								{#if open}
									<ul class="mt-0.5 mb-3 space-y-0.5" transition:slide={{ duration: 160 }}>
										{#each group.modules as mod (mod.slug)}
											{@const Icon = docIcon(mod.icon)}
											{@const active = mod.slug === currentSlug}
											<li>
												<a
													href="/docs/{mod.slug}"
													class="group flex items-center gap-2.5 rounded-md py-1.5 pl-2.5 pr-2 text-sm transition-colors duration-100
														{active
														? 'bg-accent/10 font-medium text-accent'
														: 'text-muted hover:bg-elevated hover:text-content'}"
												>
													{#if Icon}
														<Icon
															size={15}
															class="shrink-0 {active
																? 'text-accent'
																: 'text-muted/50 group-hover:text-muted'}"
														/>
													{/if}
													<span class="truncate">{mod.label}</span>
												</a>
											</li>
										{/each}
									</ul>
								{/if}
							</section>
						{/each}

						<!-- API Reference — its own collapsible section -->
						{#if filteredApi.length > 0}
							{@const open = isOpen('api')}
							<section>
								<button
									type="button"
									onclick={() => toggle('api')}
									class="flex w-full items-center justify-between rounded-md px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors hover:text-content
										{onApi ? 'text-accent/80' : 'text-muted/60'}"
								>
									<span>API Reference</span>
									<ChevronDown
										size={13}
										class="shrink-0 text-muted/40 transition-transform duration-200 {open
											? ''
											: '-rotate-90'}"
									/>
								</button>
								{#if open}
									<ul class="mt-0.5 mb-3 space-y-0.5" transition:slide={{ duration: 160 }}>
										<li>
											<a
												href="/docs/api"
												class="group flex items-center gap-2.5 rounded-md py-1.5 pl-2.5 pr-2 text-sm transition-colors duration-100
													{page.url.pathname === '/docs/api'
													? 'bg-accent/10 font-medium text-accent'
													: 'text-muted hover:bg-elevated hover:text-content'}"
											>
												<FileText
													size={15}
													class="shrink-0 {page.url.pathname === '/docs/api'
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
													href="/docs/api/{col.slug}"
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
							</section>
						{/if}
					</div>
				{/if}
			</nav>
		</aside>

		<div class="min-w-0 flex-1">{@render children()}</div>
	</div>
</div>
