<script lang="ts">
	// Concentric "signal rings" — echoes the reference fingerprint visual,
	// reframed as a network coverage/radar motif. Deterministic, no animation.
	const rings = Array.from({ length: 16 }, (_, i) => ({
		id: i,
		r: 14 + i * 11.5,
		cx: 200 + Math.sin(i * 1.3) * 7,
		cy: 200 + Math.cos(i * 0.9) * 6,
		o: Math.max(0.06, 0.4 - i * 0.02)
	}));

	const stats = [
		{ value: '100+', label: 'Vendor platforms supported' },
		{ value: 'AES-256', label: 'Encrypted credential vault' },
		{ value: '29', label: 'Integrated platform modules' },
		{ value: '24/7', label: 'Continuous SNMP monitoring' }
	];

	const vendors = ['aruba', 'checkpoint', 'sophos', 'vyos'];
</script>

<section id="demo" aria-labelledby="demo-heading" class="bg-canvas py-24">
	<div class="mx-auto max-w-6xl space-y-5 px-6">
		<!-- ── Hero box ───────────────────────────────── -->
		<div class="relative grid border border-edge bg-surface lg:grid-cols-2">
			<span class="tick-tl"></span><span class="tick-tr"></span>
			<span class="tick-bl"></span><span class="tick-br"></span>

			<!-- Left: copy -->
			<div class="flex flex-col justify-center gap-5 p-6 sm:p-8 md:p-12">
				<span
					class="inline-flex w-fit items-center gap-2 border border-edge px-3 py-1.5 font-mono text-[11px] tracking-wide text-muted"
				>
					<span class="dfx-dot"></span>
					Open-source network operations platform
				</span>

				<h2
					id="demo-heading"
					class="font-mono text-3xl font-bold uppercase leading-[0.95] tracking-tight [word-spacing:-0.22em] text-content md:text-[2.6rem]"
				>
					One platform to automate, monitor, and secure your network
				</h2>

				<p class="max-w-md text-sm leading-relaxed text-muted">
					Crux unifies configuration automation, real-time SNMP monitoring, and AI-assisted incident
					response — hosted and managed for you, with no infrastructure to provision or maintain.
				</p>

				<div class="flex flex-wrap items-center gap-4">
					<a href="/demo" class="dfx-btn"> Get a Demo </a>
					<a href="#introduction" class="dfx-ghost">
						<span class="tick-tl"></span><span class="tick-tr"></span>
						<span class="tick-bl"></span><span class="tick-br"></span>
						Learn More
					</a>
				</div>
			</div>

			<!-- Right: visual + trusted strip -->
			<div class="relative flex flex-col border-edge max-lg:border-t lg:border-l">
				<!-- Signal-rings visual -->
				<div class="relative min-h-[260px] flex-1 overflow-hidden bg-canvas">
					<svg
						class="absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2"
						viewBox="0 0 400 400"
						fill="none"
						aria-hidden="true"
						style="color: var(--color-content)"
					>
						{#each rings as ring (ring.id)}
							<circle
								cx={ring.cx}
								cy={ring.cy}
								r={ring.r}
								stroke="currentColor"
								stroke-width="1"
								stroke-opacity={ring.o}
							/>
						{/each}
					</svg>
				</div>

				<!-- Trusted strip -->
				<div
					class="flex flex-col gap-3 border-t border-edge px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
				>
					<span class="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Works with</span
					>
					<div class="flex flex-wrap items-center gap-4">
						{#each vendors as vendor (vendor)}
							<img src="/logos/{vendor}.svg" alt="{vendor} logo" class="h-4 w-auto vendor-logo" />
						{/each}
					</div>
				</div>
			</div>
		</div>

		<!-- ── Stats row ──────────────────────────────── -->
		<div
			class="relative grid grid-cols-2 border border-edge bg-surface md:grid-cols-4 md:divide-x md:divide-edge"
		>
			<span class="tick-tl"></span><span class="tick-tr"></span>
			<span class="tick-bl"></span><span class="tick-br"></span>

			{#each stats as stat (stat.label)}
				<div class="relative overflow-hidden p-6 max-md:border-b max-md:border-edge md:border-b-0">
					<span class="dots" aria-hidden="true"></span>
					<p class="relative font-mono text-3xl font-bold text-content">{stat.value}</p>
					<p class="relative mt-2 text-xs leading-relaxed text-muted">{stat.label}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	/* Accent — uses the global blue tokens; scoped helpers only */
	section {
		--dfx-accent: var(--color-accent);
		--dfx-accent-hover: var(--color-accent-muted);
		--tick: var(--grid-tick);
	}

	/* Accent status dot in the badge */
	.dfx-dot {
		width: 6px;
		height: 6px;
		border-radius: 999px;
		background: var(--dfx-accent);
	}

	/* Primary CTA — filled accent, sharp corners */
	.dfx-btn {
		display: inline-flex;
		align-items: center;
		padding: 12px 22px;
		background: var(--dfx-accent);
		color: #fff;
		font-family:
			ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace;
		font-size: 0.8125rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		text-decoration: none;
		transition: background 0.15s;
	}

	.dfx-btn:hover {
		background: var(--dfx-accent-hover);
	}

	/* Secondary CTA — outline with corner ticks */
	.dfx-ghost {
		position: relative;
		display: inline-flex;
		align-items: center;
		padding: 12px 22px;
		border: 1px solid var(--color-edge);
		color: var(--color-content);
		font-family:
			ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace;
		font-size: 0.8125rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		text-decoration: none;
		transition:
			border-color 0.15s,
			background 0.15s;
	}

	.dfx-ghost:hover {
		border-color: var(--color-muted);
		background: var(--color-elevated);
	}

	/* Corner ticks (crop-mark aesthetic) */
	.tick-tl,
	.tick-tr,
	.tick-bl,
	.tick-br {
		position: absolute;
		width: 8px;
		height: 8px;
		pointer-events: none;
	}

	.tick-tl {
		top: -1px;
		left: -1px;
		border-top: 1px solid var(--tick);
		border-left: 1px solid var(--tick);
	}

	.tick-tr {
		top: -1px;
		right: -1px;
		border-top: 1px solid var(--tick);
		border-right: 1px solid var(--tick);
	}

	.tick-bl {
		bottom: -1px;
		left: -1px;
		border-bottom: 1px solid var(--tick);
		border-left: 1px solid var(--tick);
	}

	.tick-br {
		bottom: -1px;
		right: -1px;
		border-bottom: 1px solid var(--tick);
		border-right: 1px solid var(--tick);
	}

	.vendor-logo {
		filter: var(--logo-filter);
		opacity: 0.7;
	}

	/* Halftone dot texture on stat cards (static) */
	.dots {
		position: absolute;
		inset: 0 0 0 auto;
		width: 55%;
		background-image: radial-gradient(var(--color-edge) 1.1px, transparent 1.1px);
		background-size: 9px 9px;
		opacity: 0.7;
		pointer-events: none;
		-webkit-mask-image: linear-gradient(to right, transparent, #000 85%);
		mask-image: linear-gradient(to right, transparent, #000 85%);
	}
</style>
