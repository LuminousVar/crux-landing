<script lang="ts">
	import { Lock } from 'lucide-svelte';
	import ApiExample from '$lib/components/ui/ApiExample.svelte';
	import MethodBadge from '$lib/components/ui/MethodBadge.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let { collection, endpoints } = $derived(data);

	function statusTone(status: string): string {
		if (status.startsWith('2')) return 'text-success';
		if (status.startsWith('4')) return 'text-warning';
		if (status.startsWith('5')) return 'text-danger';
		return 'text-muted';
	}
</script>

<svelte:head>
	<title>{collection.label} API — Crux Docs</title>
	<meta
		name="description"
		content={collection.description ?? `${collection.label} endpoints in the Crux REST API.`}
	/>
</svelte:head>

<main class="px-8 py-12 md:px-14">
	<div class="max-w-3xl">
		<p class="mb-8 font-mono text-xs uppercase tracking-widest text-muted/50">
			Docs / <a href="/docs/api" class="transition-colors hover:text-muted">API Reference</a> / {collection.label}
		</p>

		<h1 class="mb-4 text-4xl font-bold tracking-tight text-content">{collection.label}</h1>
		{#if collection.description}
			<p class="mb-6 text-lg leading-relaxed text-muted">{collection.description}</p>
		{/if}

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
					<div class="mb-3 flex flex-wrap items-center gap-2.5">
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

					<h2 class="mb-2 text-xl font-semibold text-content">{ep.summary}</h2>
					{#if ep.description && ep.description !== ep.summary}
						<p class="mb-4 leading-relaxed text-muted">{ep.description}</p>
					{/if}

					<!-- Parameters -->
					{#if ep.params.length > 0}
						<h3 class="mt-6 mb-2 text-sm font-semibold text-content">Parameters</h3>
						<div class="overflow-hidden rounded-lg border border-edge">
							<div class="overflow-x-auto">
								<table class="w-full border-collapse text-sm">
									<thead>
										<tr class="bg-elevated">
											{#each ['Name', 'In', 'Type', 'Required'] as h (h)}
												<th
													class="border-b border-edge px-4 py-2.5 text-left font-mono text-[11px] font-medium uppercase tracking-wide text-muted/60"
													>{h}</th
												>
											{/each}
										</tr>
									</thead>
									<tbody>
										{#each ep.params as p (p.name + p.location)}
											<tr class="border-b border-edge last:border-b-0">
												<td class="px-4 py-2.5 align-top font-mono text-xs text-accent">
													{p.name}
													{#if p.constraints}
														<span class="mt-0.5 block font-sans text-[11px] text-muted/60"
															>{p.constraints}</span
														>
													{/if}
												</td>
												<td class="px-4 py-2.5 align-top font-mono text-xs text-muted"
													>{p.location}</td
												>
												<td class="px-4 py-2.5 align-top font-mono text-xs text-content/80"
													>{p.type}</td
												>
												<td class="px-4 py-2.5 align-top text-xs">
													{#if p.required}
														<span class="text-danger">required</span>
													{:else}
														<span class="text-muted/50">optional</span>
													{/if}
												</td>
											</tr>
										{/each}
									</tbody>
								</table>
							</div>
						</div>
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
						<div class="overflow-hidden rounded-lg border border-edge">
							<div class="overflow-x-auto">
								<table class="w-full border-collapse text-sm">
									<thead>
										<tr class="bg-elevated">
											{#each ['Field', 'Type', 'Required'] as h (h)}
												<th
													class="border-b border-edge px-4 py-2.5 text-left font-mono text-[11px] font-medium uppercase tracking-wide text-muted/60"
													>{h}</th
												>
											{/each}
										</tr>
									</thead>
									<tbody>
										{#each ep.body.fields as f (f.name)}
											<tr class="border-b border-edge last:border-b-0">
												<td class="px-4 py-2.5 align-top font-mono text-xs text-accent">
													{f.name}
													{#if f.constraints}
														<span class="mt-0.5 block font-sans text-[11px] text-muted/60"
															>{f.constraints}</span
														>
													{/if}
												</td>
												<td class="px-4 py-2.5 align-top font-mono text-xs text-content/80"
													>{f.type}</td
												>
												<td class="px-4 py-2.5 align-top text-xs">
													{#if f.required}
														<span class="text-danger">required</span>
													{:else}
														<span class="text-muted/50">optional</span>
													{/if}
												</td>
											</tr>
										{/each}
									</tbody>
								</table>
							</div>
						</div>
					{/if}

					<!-- Responses -->
					{#if ep.responses.length > 0}
						<h3 class="mt-6 mb-2 text-sm font-semibold text-content">Responses</h3>
						<div class="mb-4 overflow-hidden rounded-lg border border-edge">
							<div class="overflow-x-auto">
								<table class="w-full border-collapse text-sm">
									<tbody>
										{#each ep.responses as r (r.status)}
											<tr class="border-b border-edge last:border-b-0">
												<td
													class="px-4 py-2.5 align-top font-mono text-xs font-semibold {statusTone(
														r.status
													)}">{r.status}</td
												>
												<td class="px-4 py-2.5 align-top text-xs text-content/80">
													{r.description}
													{#if r.schemaName}
														<code class="ml-1 font-mono text-[11px] text-muted/60"
															>{r.schemaName}</code
														>
													{/if}
												</td>
											</tr>
										{/each}
									</tbody>
								</table>
							</div>
						</div>
					{/if}

					<!-- Example -->
					<h3 class="mt-6 mb-2 text-sm font-semibold text-content">Example</h3>
					<ApiExample
						curl={ep.curl}
						curlHtml={ep.curlHtml}
						fetchJs={ep.fetchJs}
						fetchHtml={ep.fetchHtml}
					/>
				</section>
			{/each}
		</div>
	</div>
</main>
