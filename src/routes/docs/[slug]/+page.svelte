<script lang="ts">
	import { AlertCircle, Check, ExternalLink } from 'lucide-svelte';
	import CodeBlock from '$lib/components/ui/code-block.svelte';
	import Callout from '$lib/components/ui/Callout.svelte';
	import DocTable from '$lib/components/ui/DocTable.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let module = $derived(data.module);
</script>

<svelte:head>
	<title>{module.label} — Crux Docs</title>
	<meta name="description" content={module.description} />
</svelte:head>

<!-- Sidebar navigation is provided by docs/+layout.svelte -->
<main class="px-8 py-12 md:px-14">
	<div class="max-w-3xl">
		<!-- Breadcrumb -->
		<p class="mb-8 font-mono text-xs uppercase tracking-widest text-muted/50">
			Docs / {module.groupLabel} / {module.label}
		</p>

		<!-- Title -->
		<h1 class="mb-4 text-4xl font-bold tracking-tight text-content">{module.label}</h1>

		<!-- Subtitle -->
		<p class="mb-6 text-lg leading-relaxed text-muted">{module.description}</p>

		<!-- Meta row: API base + access -->
		{#if module.apiBase || module.access}
			<div class="mb-12 flex flex-col gap-2 border-y border-edge py-4">
				{#if module.apiBase}
					<div class="flex items-center gap-2 text-sm">
						<span class="w-16 shrink-0 font-mono text-xs uppercase tracking-wide text-muted/50"
							>API</span
						>
						<code
							class="rounded border border-edge bg-elevated px-2 py-0.5 font-mono text-xs text-accent"
							>{module.apiBase}</code
						>
					</div>
				{/if}
				{#if module.access}
					<div class="flex items-start gap-2 text-sm">
						<span
							class="w-16 shrink-0 pt-0.5 font-mono text-xs uppercase tracking-wide text-muted/50"
							>Access</span
						>
						<span class="leading-relaxed text-content/80">{module.access}</span>
					</div>
				{/if}
			</div>
		{/if}

		<!-- Overview -->
		<p class="mb-3 font-mono text-xs uppercase tracking-widest text-muted/50">Overview</p>
		<p class="mb-12 text-base leading-relaxed text-content/80">{module.overview}</p>

		<!-- Callouts -->
		{#if module.callouts?.length}
			<div class="mb-12 space-y-3">
				{#each module.callouts as callout (callout.text)}
					<Callout type={callout.type} text={callout.text} />
				{/each}
			</div>
		{/if}

		<!-- Prerequisites -->
		{#if module.prerequisites?.length}
			<p class="mb-4 font-mono text-xs uppercase tracking-widest text-muted/50">Prerequisites</p>
			<ul class="mb-12 space-y-3">
				{#each module.prerequisites as pre (pre)}
					<li class="flex items-start gap-3">
						<Check size={15} class="mt-0.5 shrink-0 text-success/70" />
						<span class="text-base leading-relaxed text-content/80">{pre}</span>
					</li>
				{/each}
			</ul>
		{/if}

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

		<!-- Diagram -->
		{#if module.diagram}
			{#if module.diagram.title}
				<p class="mb-4 font-mono text-xs uppercase tracking-widest text-muted/50">
					{module.diagram.title}
				</p>
			{/if}
			<div class="mb-12 overflow-x-auto rounded-lg border border-edge bg-elevated px-5 py-4">
				<pre class="font-mono text-xs leading-relaxed text-content/80">{module.diagram.ascii}</pre>
			</div>
		{/if}

		<!-- Tables -->
		{#if module.tables?.length}
			<div class="mb-12 space-y-6">
				{#each module.tables as table (table.title ?? table.headers.join())}
					<DocTable title={table.title} headers={table.headers} rows={table.rows} />
				{/each}
			</div>
		{/if}

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
				{module.commandsLabel ?? 'MikroTik Commands'}
			</p>
			{#if !module.commandsLabel}
				<p class="mb-6 text-xs text-muted/40">
					Run these on your MikroTik device to enable this feature.
				</p>
			{/if}
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

		<!-- Troubleshooting -->
		{#if module.troubleshooting?.length}
			<p class="mb-4 font-mono text-xs uppercase tracking-widest text-muted/50">Troubleshooting</p>
			<div class="mb-12 space-y-3">
				{#each module.troubleshooting as item (item.problem)}
					<div class="rounded-lg border border-edge bg-surface p-5">
						<p class="flex items-start gap-2 text-sm font-semibold text-content">
							<AlertCircle size={15} class="mt-0.5 shrink-0 text-warning/70" />
							{item.problem}
						</p>
						<p class="mt-2 pl-[23px] text-sm leading-relaxed text-muted">
							<span class="text-muted/50">Cause:</span>
							{item.cause}
						</p>
						<p class="mt-1.5 pl-[23px] text-sm leading-relaxed text-content/80">
							<span class="text-success/60">Fix:</span>
							{item.fix}
						</p>
					</div>
				{/each}
			</div>
		{/if}

		<!-- FAQ -->
		{#if module.faq?.length}
			<p class="mb-4 font-mono text-xs uppercase tracking-widest text-muted/50">FAQ</p>
			<div class="mb-12 space-y-4">
				{#each module.faq as item (item.q)}
					<div>
						<p class="text-sm font-semibold text-content">{item.q}</p>
						<p class="mt-1.5 text-sm leading-relaxed text-muted">{item.a}</p>
					</div>
				{/each}
			</div>
		{/if}

		{#if module.appRoute}
			<!-- Divider -->
			<div class="mb-12 border-t border-edge"></div>

			<!-- Access in the Platform -->
			<p class="mb-3 font-mono text-xs uppercase tracking-widest text-muted/50">
				Access in the Platform
			</p>
			<p class="flex items-center gap-2 text-base text-muted">
				<ExternalLink size={13} class="shrink-0 text-muted/40" />
				Available at
				<code
					class="rounded border border-edge bg-elevated px-2 py-0.5 font-mono text-sm text-accent"
					>{module.appRoute}</code
				>
				in the Crux application.
			</p>
		{/if}

		<!-- Related Modules -->
		{#if data.relatedModules.length}
			<p class="mb-4 mt-12 font-mono text-xs uppercase tracking-widest text-muted/50">
				Related Modules
			</p>
			<div class="grid gap-3 sm:grid-cols-2">
				{#each data.relatedModules as rel (rel.slug)}
					<a
						href="/docs/{rel.slug}"
						class="group flex items-center justify-between rounded-lg border border-edge bg-surface p-4 transition-colors hover:bg-elevated"
					>
						<div class="min-w-0">
							<span
								class="block text-sm font-semibold text-content transition-colors group-hover:text-accent"
								>{rel.label}</span
							>
							<span class="text-xs text-muted/50">{rel.groupLabel}</span>
						</div>
						<span
							class="shrink-0 text-muted/30 transition-colors group-hover:text-accent"
							aria-hidden="true">→</span
						>
					</a>
				{/each}
			</div>
		{/if}

		<!-- Prev / Next navigation -->
		<div class="mt-16 grid grid-cols-2 gap-3">
			{#if data.prevModule}
				<a
					href="/docs/{data.prevModule.slug}"
					class="group flex flex-col rounded-lg border border-edge bg-surface p-5 transition-colors hover:bg-elevated"
				>
					<span class="mb-2 text-xs text-muted/50">← Previous</span>
					<span class="text-sm font-semibold text-content transition-colors group-hover:text-accent"
						>{data.prevModule.label}</span
					>
					<span class="mt-0.5 text-xs text-muted/50">{data.prevModule.groupLabel}</span>
				</a>
			{:else}
				<div></div>
			{/if}

			{#if data.nextModule}
				<a
					href="/docs/{data.nextModule.slug}"
					class="group flex flex-col items-end rounded-lg border border-edge bg-surface p-5 text-right transition-colors hover:bg-elevated"
				>
					<span class="mb-2 text-xs text-muted/50">Next →</span>
					<span class="text-sm font-semibold text-content transition-colors group-hover:text-accent"
						>{data.nextModule.label}</span
					>
					<span class="mt-0.5 text-xs text-muted/50">{data.nextModule.groupLabel}</span>
				</a>
			{/if}
		</div>
	</div>
</main>
