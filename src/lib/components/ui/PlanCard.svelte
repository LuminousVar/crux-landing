<script lang="ts">
	import { Check } from 'lucide-svelte';
	import type { Plan } from '$lib/pricing';

	let { plan }: { plan: Plan } = $props();
</script>

<div class="relative rounded-xl border border-edge bg-surface p-8">
	{#if plan.badge}
		<div class="absolute -top-3 left-8">
			<span class="badge">{plan.badge}</span>
		</div>
	{/if}

	<!-- Header -->
	<h2 class="mb-1.5 text-2xl font-bold tracking-tight text-content">{plan.name}</h2>
	<p class="mb-5 text-sm leading-relaxed text-muted">{plan.tagline}</p>

	<!-- Price -->
	<div class="mb-6 flex items-baseline gap-2 border-b border-edge pb-6">
		<span class="text-4xl font-bold tracking-tight text-content">{plan.price}</span>
		<span class="text-sm text-muted">{plan.priceNote}</span>
	</div>

	<!-- Features -->
	<ul class="mb-8 flex flex-col gap-3.5">
		{#each plan.features as feature (feature)}
			<li class="flex items-start gap-3">
				<Check size={16} class="mt-0.5 shrink-0 text-accent" />
				<span class="text-sm leading-relaxed text-muted">{feature}</span>
			</li>
		{/each}
	</ul>

	<!-- CTA -->
	<a
		href={plan.cta.href}
		target={plan.cta.external ? '_blank' : undefined}
		rel={plan.cta.external ? 'noopener noreferrer' : undefined}
		class="cta {plan.cta.accent ? 'cta--accent' : 'cta--ghost'}"
	>
		{plan.cta.label}
		<svg
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2.5"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
		</svg>
	</a>
</div>

<style>
	.badge {
		display: inline-flex;
		align-items: center;
		padding: 3px 14px;
		border-radius: 999px;
		border: 1px solid var(--color-edge);
		background: var(--color-canvas);
		font-size: 11px;
		font-weight: 500;
		color: var(--color-muted);
		white-space: nowrap;
	}

	.cta {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: 14px 20px;
		border-radius: 10px;
		font-size: 0.9375rem;
		font-weight: 500;
		text-decoration: none;
		transition:
			background 0.15s,
			border-color 0.15s,
			color 0.15s;
	}

	.cta--ghost {
		border: 1px solid var(--color-edge);
		background: transparent;
		color: var(--color-content);
	}

	.cta--ghost:hover {
		background: var(--color-elevated);
		border-color: var(--color-muted);
	}

	.cta--accent {
		border: 1px solid var(--color-accent);
		background: var(--color-accent);
		color: #fff;
	}

	.cta--accent:hover {
		background: var(--color-accent-muted);
		border-color: var(--color-accent-muted);
	}
</style>
