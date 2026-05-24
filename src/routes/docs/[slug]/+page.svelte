<script lang="ts">
	/* eslint-disable @typescript-eslint/no-explicit-any */
	import * as Icons from 'lucide-svelte';
	import CodeBlock from '$lib/components/ui/code-block.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let module = $derived(data.module);
	let activeGroup = $derived(data.groups.find((g) => g.key === module.groupKey)!);
</script>

<svelte:head>
	<title>{module.label} — Crux Docs</title>
	<meta name="description" content={module.description} />
</svelte:head>

<div class="flex">
	<!-- Sidebar -->
	<aside class="hidden w-56 shrink-0 border-r border-edge md:block">
		<nav class="sticky top-12 h-[calc(100vh-3rem)] overflow-y-auto px-4 py-8">
			<p class="mb-3 px-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted/50">
				{activeGroup.label}
			</p>
			<ul class="space-y-0.5">
				{#each activeGroup.modules as mod (mod.slug)}
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

			<!-- Subtitle -->
			<p class="mb-12 text-lg leading-relaxed text-muted">{module.description}</p>

			<!-- Overview -->
			<p class="mb-3 font-mono text-xs uppercase tracking-widest text-muted/50">Overview</p>
			<p class="mb-12 text-base leading-relaxed text-content/80">{module.overview}</p>

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

			<!-- How It Works -->
			<p class="mb-4 font-mono text-xs uppercase tracking-widest text-muted/50">How It Works</p>
			<ul class="mb-12 space-y-4">
				{#each module.howItWorks as item (item)}
					<li class="flex items-start gap-3">
						<span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/40" aria-hidden="true"
						></span>
						<span class="text-base leading-relaxed text-content/80">{item}</span>
					</li>
				{/each}
			</ul>

			<!-- Step-by-Step -->
			<p class="mb-4 font-mono text-xs uppercase tracking-widest text-muted/50">Step-by-Step</p>
			<ol class="mb-12 space-y-4">
				{#each module.steps as step, i (step)}
					<li class="flex items-start gap-4">
						<span
							class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-accent/30 font-mono text-xs font-semibold text-accent"
						>
							{i + 1}
						</span>
						<span class="text-base leading-relaxed text-content">{step}</span>
					</li>
				{/each}
			</ol>

			<!-- MikroTik Commands -->
			{#if data.highlightedCommands.length > 0}
				<p class="mb-1 font-mono text-xs uppercase tracking-widest text-muted/50">
					MikroTik Commands
				</p>
				<p class="mb-6 text-xs text-muted/40">
					Run these on your MikroTik device to enable this feature.
				</p>
				<div class="mb-12 space-y-4">
					{#each data.highlightedCommands as cmd (cmd.label)}
						<CodeBlock label={cmd.label} html={cmd.html} code={cmd.code} />
					{/each}
				</div>
			{/if}

			<!-- Technical Notes -->
			<p class="mb-4 font-mono text-xs uppercase tracking-widest text-muted/50">Technical Notes</p>
			<ul class="mb-12 space-y-3">
				{#each module.technicalNotes as note (note)}
					<li class="flex items-start gap-3">
						<span class="mt-0.5 shrink-0 font-mono text-xs text-muted/30">→</span>
						<span class="text-sm leading-relaxed text-muted">{note}</span>
					</li>
				{/each}
			</ul>

			<!-- Divider -->
			<div class="mb-12 border-t border-edge"></div>

			<!-- Access in the Platform -->
			<p class="mb-3 font-mono text-xs uppercase tracking-widest text-muted/50">
				Access in the Platform
			</p>
			<p class="flex items-center gap-2 text-base text-muted">
				<Icons.ExternalLink size={13} class="shrink-0 text-muted/40" />
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
