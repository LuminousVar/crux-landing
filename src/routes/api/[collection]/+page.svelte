<script lang="ts">
	import { Lock } from 'lucide-svelte';
	import ApiExample from '$lib/components/ui/ApiExample.svelte';
	import MethodBadge from '$lib/components/ui/MethodBadge.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let { collection, endpoints, meta, clientLibraries } = $derived(data);

	function statusTone(status: string): string {
		if (status.startsWith('2')) return 'text-success';
		if (status.startsWith('4')) return 'text-warning';
		if (status.startsWith('5')) return 'text-danger';
		return 'text-muted';
	}
</script>

<svelte:head>
	<title>{collection.label} API — Crux</title>
	<meta
		name="description"
		content={collection.description ?? `${collection.label} endpoints in the Crux REST API.`}
	/>
</svelte:head>

<main class="px-8 py-12 md:px-14">
	<div class="max-w-4xl">
		<p class="mb-8 font-mono text-xs uppercase tracking-widest text-muted/50">
			<a href="/api" class="transition-colors hover:text-muted">API Reference</a> / {collection.label}
		</p>

		<h1 class="mb-4 text-4xl font-bold tracking-tight text-content">{collection.label}</h1>
		{#if collection.description}
			<p class="mb-6 max-w-2xl text-lg leading-relaxed text-muted">{collection.description}</p>
		{/if}

		<!-- Collection meta strip -->
		<dl class="mb-10 flex flex-wrap gap-x-10 gap-y-3 border-y border-edge py-4">
			<div>
				<dt class="text-xs text-muted/60">Endpoints</dt>
				<dd class="mt-0.5 font-mono text-sm text-content">{endpoints.length}</dd>
			</div>
			<div>
				<dt class="text-xs text-muted/60">Base path</dt>
				<dd class="mt-0.5 font-mono text-sm text-content">/api/v1</dd>
			</div>
			<div>
				<dt class="text-xs text-muted/60">API version</dt>
				<dd class="mt-0.5 font-mono text-sm text-content">{meta.version}</dd>
			</div>
			<div>
				<dt class="text-xs text-muted/60">Auth</dt>
				<dd class="mt-0.5 font-mono text-sm text-content">Bearer token</dd>
			</div>
		</dl>

		<!-- Client libraries -->
		<section class="mb-12">
			<h2 class="mb-2 text-sm font-semibold text-content">Client libraries</h2>
			<p class="mb-4 max-w-2xl text-sm leading-relaxed text-muted">
				Crux ships a standard OpenAPI&nbsp;3 spec, so a fully typed client for any language below is
				generated from it — always in lock-step with API&nbsp;{meta.version}. Grab the spec from the
				<a href="/api" class="text-accent hover:underline">API overview</a>.
			</p>
			<div class="api-table-wrap">
				<table class="api-table">
					<thead>
						<tr>
							<th>Language</th>
							<th>Generator</th>
						</tr>
					</thead>
					<tbody>
						{#each clientLibraries as lib (lib.language)}
							<tr>
								<td class="name-cell">{lib.language}</td>
								<td class="font-mono text-xs text-muted">{lib.generator}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</section>

		<!-- Endpoint index -->
		<div class="mb-12 rounded-lg border border-edge bg-surface p-4">
			<p class="mb-3 font-mono text-[11px] uppercase tracking-wide text-muted/50">
				{endpoints.length} endpoints
			</p>
			<ul class="space-y-1">
				{#each endpoints as ep (ep.id)}
					<li>
						<a href="#{ep.id}" class="flex items-center gap-2.5 text-sm hover:text-accent">
							<MethodBadge method={ep.method} class="w-16 shrink-0" />
							<code class="truncate font-mono text-xs text-muted">{ep.path}</code>
						</a>
					</li>
				{/each}
			</ul>
		</div>

		<!-- Endpoints -->
		<div class="space-y-16">
			{#each endpoints as ep (ep.id)}
				<section id={ep.id} class="scroll-mt-20">
					<!-- Method + path -->
					<div class="mb-4 flex flex-wrap items-center gap-2.5">
						<MethodBadge method={ep.method} />
						<code class="font-mono text-sm break-all text-content">{ep.path}</code>
						{#if ep.auth}
							<span
								class="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wide text-muted/50"
								title="Requires a Bearer token"
							>
								<Lock size={10} /> auth
							</span>
						{/if}
					</div>

					<h2 class="mb-3 text-xl font-semibold text-content">{ep.summary}</h2>

					<!-- Endpoint meta (scope · consumes/produces · operation id) -->
					<dl class="mb-4 grid grid-cols-[7rem_1fr] gap-y-2 border-y border-edge py-4 text-sm">
						<dt class="text-xs text-muted/60">Scope</dt>
						<dd class="font-mono text-xs text-content">{ep.scope}</dd>

						<dt class="text-xs text-muted/60">
							{ep.consumes ? 'Consumes · Produces' : 'Produces'}
						</dt>
						<dd class="font-mono text-xs text-content">
							{ep.consumes ? `${ep.consumes} · ${ep.produces}` : ep.produces}
						</dd>

						<dt class="text-xs text-muted/60">Operation ID</dt>
						<dd class="font-mono text-xs text-accent">{ep.operationId}</dd>
					</dl>

					{#if ep.description && ep.description !== ep.summary}
						<p class="mb-4 max-w-2xl leading-relaxed text-muted">{ep.description}</p>
					{/if}

					<!-- Parameters -->
					{#if ep.params.length > 0}
						<h3 class="mt-6 mb-2 text-sm font-semibold text-content">Parameters</h3>
						<div class="api-table-wrap">
							<table class="api-table">
								<thead>
									<tr>
										<th>Name</th>
										<th>Type</th>
										<th>Data type</th>
										<th>Description</th>
									</tr>
								</thead>
								<tbody>
									{#each ep.params as p (p.name + p.location)}
										<tr>
											<td class="name-cell">
												{p.name}{#if p.required}<span
														class="ml-0.5 text-danger"
														title="Required">*</span
													>{/if}
											</td>
											<td class="text-muted">{p.location}</td>
											<td class="italic text-muted">{p.type}</td>
											<td class="text-content/75">
												{p.description ?? ''}{#if p.constraints}<span class="text-muted/60">
														{p.description ? ' ' : ''}[{p.constraints}]</span
													>{/if}
											</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
						{#if ep.params.some((p) => p.required)}
							<p class="mt-2 text-xs text-muted/50"><span class="text-danger">*</span> Required</p>
						{/if}
					{/if}

					<!-- Request body -->
					{#if ep.body && ep.body.fields.length > 0}
						<h3 class="mt-6 mb-2 flex items-center gap-2 text-sm font-semibold text-content">
							Request body
							{#if ep.body.schemaName}
								<code class="font-mono text-[11px] font-normal text-muted/60"
									>{ep.body.schemaName}</code
								>
							{/if}
						</h3>
						<div class="api-table-wrap">
							<table class="api-table">
								<thead>
									<tr>
										<th>Field</th>
										<th>Data type</th>
										<th>Description</th>
									</tr>
								</thead>
								<tbody>
									{#each ep.body.fields as f (f.name)}
										<tr>
											<td class="name-cell">
												{f.name}{#if f.required}<span
														class="ml-0.5 text-danger"
														title="Required">*</span
													>{/if}
											</td>
											<td class="italic text-muted">{f.type}</td>
											<td class="text-content/75">
												{f.description ?? ''}{#if f.constraints}<span class="text-muted/60">
														{f.description ? ' ' : ''}[{f.constraints}]</span
													>{/if}
											</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
						{#if ep.body.fields.some((f) => f.required)}
							<p class="mt-2 text-xs text-muted/50"><span class="text-danger">*</span> Required</p>
						{/if}
					{/if}

					<!-- Responses -->
					{#if ep.responses.length > 0}
						<h3 class="mt-6 mb-2 text-sm font-semibold text-content">Responses</h3>
						<div class="api-table-wrap mb-4">
							<table class="api-table">
								<thead>
									<tr>
										<th class="w-24">Status</th>
										<th>Description</th>
									</tr>
								</thead>
								<tbody>
									{#each ep.responses as r (r.status)}
										<tr>
											<td class="font-mono text-xs font-semibold {statusTone(r.status)}">{r.status}</td>
											<td class="text-content/75">
												{r.description}
												{#if r.schemaName}
													<code class="ml-1 font-mono text-[11px] text-muted/60">{r.schemaName}</code>
												{/if}
											</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					{/if}

					<!-- Example -->
					<h3 class="mt-6 mb-2 text-sm font-semibold text-content">Example</h3>
					<ApiExample samples={ep.samples} />
				</section>
			{/each}
		</div>
	</div>
</main>

<style>
	/* Parameters/data table — matched to the CrowdStrike reference: a framed, rounded
	   box; a filled header row with bold light labels; subtle vertical dividers between
	   columns and thin horizontal rules between rows. No zebra, no glow. */
	.api-table-wrap {
		overflow-x: auto;
		border: 1px solid var(--color-edge);
		border-radius: 12px;
	}

	.api-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.875rem;
	}

	.api-table thead th {
		/* Subtle top-to-bottom gradient on the header row (no flat fill). */
		background: linear-gradient(
			180deg,
			color-mix(in oklab, var(--color-elevated) 78%, var(--color-content) 6%),
			var(--color-elevated)
		);
		padding: 0.85rem 1.25rem;
		text-align: left;
		font-weight: 600;
		color: var(--color-content);
		white-space: nowrap;
		border-bottom: 1px solid var(--color-edge);
	}

	.api-table tbody td {
		padding: 0.9rem 1.25rem;
		vertical-align: top;
		line-height: 1.5;
		border-bottom: 1px solid color-mix(in oklab, var(--color-edge) 55%, transparent);
	}

	/* Zebra striping — even rows get a faint tint so odd/even differ. */
	.api-table tbody tr:nth-child(even) td {
		background: color-mix(in oklab, var(--color-surface) 60%, transparent);
	}

	.api-table tbody tr:last-child td {
		border-bottom: none;
	}

	/* Subtle vertical column dividers (every cell except the last in its row). */
	.api-table th:not(:last-child),
	.api-table td:not(:last-child) {
		border-right: 1px solid color-mix(in oklab, var(--color-edge) 45%, transparent);
	}

	/* First-column identifier — bold, high-contrast, like the reference. */
	.api-table :global(.name-cell) {
		font-weight: 600;
		color: var(--color-content);
		white-space: nowrap;
	}
</style>
