<script lang="ts">
	import { page } from '$app/state';
	import { slide } from 'svelte/transition';
	import { docGroups } from '$lib/docs';
	import { docIcon } from '$lib/doc-icons';
	import { ChevronDown, Code2, Search, X } from 'lucide-svelte';

	let { children }: { children: import('svelte').Snippet } = $props();

	let currentSlug = $derived(page.params.slug ?? '');

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
	// Collapsed sections. A section is open when: the user is filtering (show every
	// match), the user explicitly opened it, or — by default — it holds the active page.
	let overrides = $state<Record<string, boolean>>({});
	function isOpen(key: string): boolean {
		if (q.trim() !== '') return true;
		if (key === activeGroupKey && key !== '') return overrides[key] ?? true;
		return overrides[key] ?? true;
	}
	function toggle(key: string): void {
		overrides = { ...overrides, [key]: !isOpen(key) };
	}
</script>

<div class="min-h-screen bg-canvas pt-[4.25rem]">
	<div class="flex">
		<!-- Global navigation — persists across the index and every module page -->
		<aside class="hidden w-72 shrink-0 border-r border-edge bg-surface/20 md:block">
			<nav
				class="sticky top-[4.25rem] h-[calc(100vh-4.25rem)] overflow-y-auto px-4 py-6 [scrollbar-width:thin]"
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

				{#if filteredGroups.length === 0}
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
					</div>

					<!-- Cross-link to the separate API Reference section -->
					<a
						href="/api"
						class="mt-4 flex items-center gap-2 rounded-md border-t border-edge px-2.5 pt-4 text-sm text-muted transition-colors hover:text-content"
					>
						<Code2 size={15} class="shrink-0 text-muted/50" />
						<span>API Reference</span>
						<span class="ml-auto text-muted/30">→</span>
					</a>
				{/if}
			</nav>
		</aside>

		<div class="min-w-0 flex-1">{@render children()}</div>
	</div>
</div>
