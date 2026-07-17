<script lang="ts">
	import { ArrowRight, KeyRound } from 'lucide-svelte';
	import Callout from '$lib/components/ui/Callout.svelte';
	import MethodBadge from '$lib/components/ui/MethodBadge.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>API Reference — Crux Docs</title>
	<meta
		name="description"
		content="Complete REST API reference for the Crux network automation platform — {data.meta
			.totalEndpoints} endpoints across {data.collections.length} collections."
	/>
</svelte:head>

<main class="px-8 py-12 md:px-14">
	<div class="max-w-3xl">
		<p class="mb-8 font-mono text-xs uppercase tracking-widest text-muted/50">
			Docs / API Reference
		</p>

		<h1 class="mb-4 text-4xl font-bold tracking-tight text-content">API Reference</h1>
		<p class="mb-6 text-lg leading-relaxed text-muted">
			The complete REST API for Crux — {data.meta.totalEndpoints} endpoints across
			{data.collections.length} collections. Every route is versioned under
			<code class="rounded bg-elevated px-1.5 py-0.5 font-mono text-sm text-accent">/api/v1</code>.
		</p>

		<!-- Base URL + auth -->
		<div class="mb-6 flex flex-col gap-2 border-y border-edge py-4">
			<div class="flex items-center gap-2 text-sm">
				<span class="w-24 shrink-0 font-mono text-xs uppercase tracking-wide text-muted/50">
					Base URL
				</span>
				<code class="font-mono text-sm text-content">{data.meta.baseUrl}</code>
			</div>
			<div class="flex items-center gap-2 text-sm">
				<span class="w-24 shrink-0 font-mono text-xs uppercase tracking-wide text-muted/50">
					Version
				</span>
				<code class="font-mono text-sm text-content">{data.meta.version}</code>
			</div>
		</div>

		<div class="mb-10">
			<Callout
				type="note"
				text="Crux is self-hosted, so the base URL is your own deployment's address — replace crux.example.com with your host. Every endpoint except login and health requires a Bearer token in the Authorization header."
			/>
		</div>

		<!-- Authentication quick-start -->
		<section class="mb-12">
			<div class="mb-3 flex items-center gap-2">
				<KeyRound size={16} class="text-accent" />
				<h2 class="text-lg font-semibold text-content">Authenticating</h2>
			</div>
			<p class="mb-3 text-sm leading-relaxed text-muted">
				Obtain a token from <code
					class="rounded bg-elevated px-1.5 py-0.5 font-mono text-xs text-accent"
					>POST /api/v1/auth/login</code
				>, then send it on every subsequent request:
			</p>
			<pre
				class="overflow-x-auto rounded-lg border border-edge bg-elevated px-4 py-3 font-mono text-xs leading-relaxed text-content/80">Authorization: Bearer &lt;your-token&gt;</pre>
		</section>

		<!-- Collections grid -->
		<h2 class="mb-4 text-lg font-semibold text-content">Collections</h2>
		<div class="grid gap-3 sm:grid-cols-2">
			{#each data.collections as col (col.slug)}
				<a
					href="/docs/api/{col.slug}"
					class="group flex flex-col rounded-lg border border-edge bg-surface p-4 transition-colors hover:border-accent/50"
				>
					<div class="mb-1.5 flex items-center justify-between gap-2">
						<span class="font-semibold text-content group-hover:text-accent">{col.label}</span>
						<span class="font-mono text-[11px] text-muted/50">{col.count}</span>
					</div>
					{#if col.description}
						<p class="mb-3 line-clamp-2 text-xs leading-relaxed text-muted">{col.description}</p>
					{/if}
					<div class="mt-auto flex items-center justify-between">
						<div class="flex flex-wrap gap-1">
							{#each col.methods as m (m)}
								<MethodBadge method={m} />
							{/each}
						</div>
						<ArrowRight
							size={14}
							class="text-muted/30 transition-transform group-hover:translate-x-0.5 group-hover:text-accent"
						/>
					</div>
				</a>
			{/each}
		</div>
	</div>
</main>
