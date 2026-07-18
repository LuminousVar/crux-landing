<script lang="ts">
	import { page } from '$app/state';
	import { Check } from 'lucide-svelte';
	import { featureCategories, pricingFaqs } from '$lib/pricing';
	import Footer from '$lib/components/sections/Footer.svelte';
	import FaqItem from '$lib/components/ui/FaqItem.svelte';

	let { children }: { children: import('svelte').Snippet } = $props();

	// Cloud lives at /pricing; Self-host at /pricing/self-host. The toggle navigates
	// between the two pages rather than swapping content in place.
	let onSelfHost = $derived(page.url.pathname.startsWith('/pricing/self-host'));
</script>

<main class="bg-canvas pt-[4.25rem]">
	<!-- Shared header: heading + page-switch toggle (with subtle gradient glow) -->
	<div class="hero">
		<div class="hero-glow" aria-hidden="true"></div>
		<div class="relative mx-auto max-w-3xl px-6">
			<div class="pb-12 pt-20 text-center md:pt-28">
				<h1
					class="mx-auto max-w-2xl text-4xl font-bold tracking-tight text-content sm:text-5xl md:text-6xl"
				>
					Simple and transparent <span class="hl">pricing</span>
				</h1>
			<p class="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted">
				Everything you need to monitor, automate, and secure your network, free from limits and
				paywalls.
			</p>
		</div>

		<div class="mb-10 flex justify-center">
			<div class="toggle" role="tablist" aria-label="Choose a hosting option">
				<!-- eslint-disable svelte/no-navigation-without-resolve -->
				<a
					href="/pricing"
					role="tab"
					aria-selected={!onSelfHost}
					class="toggle-btn {!onSelfHost ? 'is-active' : ''}"
				>
					Cloud <span class="toggle-sub">(We Host)</span>
				</a>
				<a
					href="/pricing/self-host"
					role="tab"
					aria-selected={onSelfHost}
					class="toggle-btn {onSelfHost ? 'is-active' : ''}"
				>
					Self-host <span class="toggle-sub">(You Host)</span>
				</a>
				<!-- eslint-enable svelte/no-navigation-without-resolve -->
			</div>
		</div>
		</div>
	</div>

	<!-- Page-specific body: plan card + any page-only sections -->
	{@render children()}

	<!-- ── Core features shared by every plan ─────────────── -->
	<section class="border-t border-edge bg-canvas py-20" aria-labelledby="core-heading">
		<div class="mx-auto max-w-3xl px-6">
			<h2
				id="core-heading"
				class="mb-3 text-center text-2xl font-bold tracking-tight text-content md:text-3xl"
			>
				The same core features are included with every plan
			</h2>
			<p class="mx-auto mb-12 max-w-xl text-center text-sm leading-relaxed text-muted">
				The network-ops core is identical on both plans. Only the infrastructure — who runs, backs
				up, and maintains it — differs.
			</p>

			<!-- Comparison table (Penpot-style) -->
			<div class="feature-table-wrap">
				<table class="feature-table">
					<thead>
						<tr>
							<th scope="col" class="th-feature">Feature</th>
							<th scope="col" class="th-plan">Self-host</th>
							<th scope="col" class="th-plan">Cloud</th>
						</tr>
					</thead>
					<tbody>
						{#each featureCategories as group (group.category)}
							<tr class="cat-row">
								<th scope="colgroup" colspan="3">{group.category}</th>
							</tr>
							{#each group.features as feature (feature.name)}
								<tr class="feat-row">
									<td class="td-feature">{feature.name}</td>
									<td class="td-check">
										{#if feature.selfHost}
											<Check size={16} class="mx-auto text-accent" aria-label="Included" />
										{:else}
											<span class="dash" aria-label="Not included">—</span>
										{/if}
									</td>
									<td class="td-check">
										{#if feature.cloud}
											<Check size={16} class="mx-auto text-accent" aria-label="Included" />
										{:else}
											<span class="dash" aria-label="Not included">—</span>
										{/if}
									</td>
								</tr>
							{/each}
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</section>

	<!-- ── Pricing FAQs ───────────────────────────────────── -->
	<section class="border-t border-edge bg-surface py-20" aria-labelledby="pricing-faq-heading">
		<div class="mx-auto max-w-3xl px-6">
			<p class="mb-3 font-mono text-xs uppercase tracking-widest text-muted">Pricing FAQs</p>
			<h2
				id="pricing-faq-heading"
				class="mb-12 text-3xl font-bold tracking-tight text-content md:text-4xl"
			>
				Questions about plans & pricing
			</h2>
			<div>
				{#each pricingFaqs as faq (faq.question)}
					<FaqItem question={faq.question} answer={faq.answer} />
				{/each}
			</div>
		</div>
	</section>
</main>

<Footer />

<style>
	/* ── Hero: subtle two-tone gradient glow behind heading ── */
	.hero {
		position: relative;
		overflow: hidden;
	}

	.hero-glow {
		position: absolute;
		inset: -8rem 0 auto 0;
		height: 32rem;
		pointer-events: none;
		background:
			radial-gradient(
				40rem 20rem at 40% 18%,
				color-mix(in oklab, var(--color-accent) 20%, transparent),
				transparent 62%
			),
			radial-gradient(
				34rem 20rem at 66% 12%,
				color-mix(in oklab, var(--color-accent-muted) 16%, transparent),
				transparent 62%
			);
		opacity: 0.5;
		filter: blur(6px);
	}

	/* Softer in light mode so it stays a hint, never a glare. */
	:global(:root[data-theme='light']) .hero-glow {
		opacity: 0.38;
	}

	/* Highlighted word — solid accent, enterprise restraint (no gradient) */
	.hl {
		color: var(--color-accent);
	}

	.toggle {
		display: inline-flex;
		gap: 4px;
		padding: 4px;
		border-radius: 12px;
		border: 1px solid var(--color-edge);
		background: var(--color-surface);
	}

	.toggle-btn {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 8px 20px;
		border-radius: 8px;
		background: transparent;
		color: var(--color-muted);
		font-family: inherit;
		font-size: 0.9375rem;
		font-weight: 500;
		text-decoration: none;
		white-space: nowrap;
		transition:
			background 0.18s,
			color 0.18s;
	}

	.toggle-btn:hover {
		color: var(--color-content);
	}

	.toggle-btn.is-active {
		background: var(--color-accent);
		color: #fff;
	}

	.toggle-sub {
		font-weight: 400;
		opacity: 0.7;
	}

	/* ── Feature comparison table (Penpot-style) ──────── */
	.feature-table-wrap {
		overflow: hidden;
		border: 1px solid var(--color-edge);
		border-radius: 14px;
		background: var(--color-surface);
	}

	.feature-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.875rem;
	}

	/* Header row — plan columns */
	.feature-table thead th {
		padding: 14px 20px;
		font-weight: 600;
		color: var(--color-content);
		border-bottom: 1px solid var(--color-edge);
	}

	.th-feature {
		text-align: left;
	}

	.th-plan {
		width: 120px;
		text-align: center;
	}

	/* Category subheader row */
	.cat-row th {
		padding: 10px 20px;
		text-align: left;
		background: var(--color-elevated);
		border-bottom: 1px solid var(--color-edge);
		font-family:
			ui-monospace, 'SF Mono', 'Cascadia Code', 'Roboto Mono', Menlo, Consolas, monospace;
		font-size: 11px;
		font-weight: 500;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--color-muted);
	}

	/* Feature rows */
	.feat-row {
		transition: background 0.12s;
	}

	.feat-row:hover {
		background: var(--color-elevated);
	}

	.feat-row:not(:last-child) td {
		border-bottom: 1px solid color-mix(in oklab, var(--color-edge) 60%, transparent);
	}

	.td-feature {
		padding: 13px 20px;
		color: var(--color-content);
	}

	.td-check {
		padding: 13px 20px;
		text-align: center;
	}

	.dash {
		color: var(--color-muted);
		opacity: 0.35;
	}

	@media (max-width: 480px) {
		.feature-table {
			font-size: 0.8125rem;
		}

		.th-feature,
		.td-feature,
		.cat-row th {
			padding-left: 14px;
		}

		.th-plan {
			width: 68px;
		}

		.th-plan,
		.td-check {
			padding-left: 6px;
			padding-right: 6px;
		}
	}
</style>
