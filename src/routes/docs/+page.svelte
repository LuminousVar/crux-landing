<script lang="ts">
	/* eslint-disable @typescript-eslint/no-explicit-any */
	import { docGroups } from '$lib/docs';
	import * as Icons from 'lucide-svelte';

	let query = $state('');
	let inputEl = $state<HTMLInputElement | null>(null);

	let filteredGroups = $derived(
		query.trim() === ''
			? docGroups
			: docGroups
					.map((g) => ({
						...g,
						modules: g.modules.filter(
							(m) =>
								m.label.toLowerCase().includes(query.toLowerCase()) ||
								m.description.toLowerCase().includes(query.toLowerCase()) ||
								m.capabilities.some((c) => c.toLowerCase().includes(query.toLowerCase()))
						)
					}))
					.filter((g) => g.modules.length > 0)
	);

	let totalResults = $derived(filteredGroups.reduce((n, g) => n + g.modules.length, 0));

	$effect(() => {
		function onKeydown(e: KeyboardEvent) {
			if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
				e.preventDefault();
				inputEl?.focus();
			}
			if (e.key === 'Escape') {
				query = '';
				inputEl?.blur();
			}
		}
		window.addEventListener('keydown', onKeydown);
		return () => window.removeEventListener('keydown', onKeydown);
	});
</script>

<svelte:head>
	<title>Documentation — Crux</title>
	<meta name="description" content="Documentation for all Crux platform modules." />
</svelte:head>

<main class="mx-auto max-w-6xl px-6 py-16">
	<!-- Header -->
	<div class="mb-10">
		<h1 class="mb-2 text-4xl font-bold tracking-tight text-content">Crux Documentation</h1>
		<p class="mb-6 text-lg text-muted">Everything you need to use the platform.</p>

		<!-- Search input -->
		<div class="relative max-w-sm">
			<Icons.Search
				size={15}
				class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted/50"
			/>
			<input
				bind:this={inputEl}
				bind:value={query}
				type="text"
				placeholder="Search modules…"
				class="w-full rounded border border-edge bg-surface py-2 pl-9 pr-10 text-sm text-content placeholder:text-muted/40 focus:border-accent focus:outline-none"
			/>
			{#if query}
				<button
					onclick={() => (query = '')}
					class="absolute right-3 top-1/2 -translate-y-1/2 text-muted/40 transition-colors hover:text-muted"
					aria-label="Clear search"
				>
					<Icons.X size={13} />
				</button>
			{:else}
				<kbd
					class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded border border-edge bg-elevated px-1.5 py-0.5 font-mono text-[10px] text-muted/40"
					>/</kbd
				>
			{/if}
		</div>
	</div>

	<!-- No results -->
	{#if query && totalResults === 0}
		<p class="py-16 text-center text-sm text-muted/50">
			No modules found for <span class="text-muted">"{query}"</span>
		</p>

		<!-- Results -->
	{:else}
		{#if query}
			<p class="mb-8 text-xs text-muted/50">
				{totalResults} result{totalResults === 1 ? '' : 's'}
			</p>
		{/if}

		{#each filteredGroups as group, gi (group.key)}
			<div class="mt-10 {gi === 0 ? 'mt-0' : ''}">
				<div class="mb-4 flex items-center gap-4 {gi !== 0 ? 'border-t border-edge pt-10' : ''}">
					<span class="font-mono text-xs uppercase tracking-[0.2em] text-muted/50"
						>{group.label}</span
					>
				</div>

				<div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
					{#each group.modules as module (module.slug)}
						{@const Icon = (Icons as Record<string, any>)[module.icon]}
						<a
							href="/docs/{module.slug}"
							class="group flex flex-col rounded-lg border border-edge bg-surface p-5 transition-colors duration-150 hover:bg-elevated"
						>
							<Icon
								size={20}
								class="text-muted transition-colors duration-150 group-hover:text-accent"
							/>
							<p class="mt-3 text-base font-semibold text-content">{module.label}</p>
							<p class="mt-1 flex-1 text-sm leading-relaxed text-muted">{module.description}</p>
							<span
								class="mt-4 self-end text-base text-muted/30 transition-colors duration-150 group-hover:text-accent"
								>→</span
							>
						</a>
					{/each}
				</div>
			</div>
		{/each}
	{/if}
</main>
