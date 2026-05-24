<script lang="ts">
	/* eslint-disable @typescript-eslint/no-explicit-any */
	import { untrack } from 'svelte';
	import * as Icons from 'lucide-svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let module = $derived(data.module);
	let groups = $derived(data.groups);

	// untrack: intentionally read once at mount — openGroups tracks user expand/collapse state
	let openGroups = $state<Set<string>>(new Set([untrack(() => data.module.groupKey)]));

	function toggleGroup(key: string) {
		if (openGroups.has(key)) {
			openGroups.delete(key);
		} else {
			openGroups.add(key);
		}
	}
</script>

<svelte:head>
	<title>{module.label} — Crux Docs</title>
	<meta name="description" content={module.description} />
</svelte:head>

<div class="flex">
	<!-- Sidebar -->
	<aside class="hidden w-60 shrink-0 border-r border-edge md:block">
		<nav class="sticky top-12 h-[calc(100vh-3rem)] overflow-y-auto px-4 py-8">
			{#each groups as group (group.key)}
				<!-- Group header / toggle -->
				<button
					class="mb-1 flex w-full items-center justify-between py-1 text-left"
					onclick={() => toggleGroup(group.key)}
				>
					<span class="font-mono text-[11px] uppercase tracking-[0.18em] text-muted/50"
						>{group.label}</span
					>
					<span class="text-xs text-muted/30">{openGroups.has(group.key) ? '−' : '+'}</span>
				</button>

				{#if openGroups.has(group.key)}
					<ul class="mb-4 space-y-0.5">
						{#each group.modules as mod (mod.slug)}
							<li>
								<a
									href="/docs/{mod.slug}"
									class="block rounded px-2 py-1.5 text-sm transition-colors duration-100
										{mod.slug === module.slug
										? 'font-medium text-accent'
										: 'text-muted hover:text-content'}"
								>
									{mod.label}
								</a>
							</li>
						{/each}
					</ul>
				{:else}
					<div class="mb-4"></div>
				{/if}
			{/each}
		</nav>
	</aside>

	<!-- Main content -->
	<main class="min-w-0 flex-1 px-8 py-12 md:px-14">
		<div class="max-w-2xl">
			<!-- Breadcrumb -->
			<p class="mb-8 font-mono text-xs uppercase tracking-widest text-muted/50">
				Docs / {module.groupLabel} / {module.label}
			</p>

			<!-- Title -->
			<h1 class="mb-4 text-4xl font-bold tracking-tight text-content">{module.label}</h1>

			<!-- Description -->
			<p class="mb-10 text-lg leading-relaxed text-muted">{module.description}</p>

			<!-- Capabilities -->
			<p class="mb-4 font-mono text-xs uppercase tracking-widest text-muted/50">Capabilities</p>
			<ul class="mb-12 space-y-3">
				{#each module.capabilities as cap (cap)}
					<li class="flex items-start gap-3">
						<span class="mt-1 shrink-0 text-sm text-muted/40">–</span>
						<span class="text-base leading-relaxed text-content">{cap}</span>
					</li>
				{/each}
			</ul>

			<!-- Access in the platform -->
			<p class="mb-4 font-mono text-xs uppercase tracking-widest text-muted/50">
				Access in the Platform
			</p>
			<p class="text-base text-muted">
				Available at
				<code
					class="rounded border border-edge bg-elevated px-2 py-0.5 font-mono text-sm text-accent"
					>{module.appRoute}</code
				>
				in the Crux application.
			</p>
		</div>
	</main>
</div>
