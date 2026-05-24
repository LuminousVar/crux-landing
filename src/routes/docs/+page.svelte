<script lang="ts">
	/* eslint-disable @typescript-eslint/no-explicit-any */
	import { docGroups } from '$lib/docs';
	import * as Icons from 'lucide-svelte';
</script>

<svelte:head>
	<title>Documentation — Crux</title>
	<meta name="description" content="Documentation for all Crux platform modules." />
</svelte:head>

<main class="mx-auto max-w-6xl px-6 py-16">
	<!-- Header -->
	<div class="mb-14">
		<h1 class="mb-2 text-4xl font-bold tracking-tight text-content">Crux Documentation</h1>
		<p class="mb-6 text-lg text-muted">Everything you need to use the platform.</p>
		<div
			class="inline-flex items-center gap-2 rounded border border-edge bg-surface px-3 py-1.5 font-mono text-xs text-muted/50"
		>
			Press <kbd
				class="rounded border border-edge bg-elevated px-1.5 py-0.5 font-mono text-[11px] text-muted"
				>/</kbd
			> to search
		</div>
	</div>

	<!-- Groups -->
	{#each docGroups as group, gi (group.key)}
		<div class="mt-10 {gi === 0 ? 'mt-0' : ''}">
			<div
				class="mb-4 flex items-center gap-4 {gi !== 0
					? 'border-t border-edge pt-10'
					: ''}"
			>
				<span class="font-mono text-xs uppercase tracking-[0.2em] text-muted/50">{group.label}</span>
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
</main>
