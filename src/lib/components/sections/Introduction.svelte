<script lang="ts">
	import { Bot, Globe, Layers, ListChecks, Lock, RefreshCw, Shield, Zap } from 'lucide-svelte';

	const selfHostedFeatures = [
		{ icon: Layers, text: 'One compose.yaml — Postgres, Valkey, Celery, FastAPI, SvelteKit' },
		{ icon: Lock, text: 'Credentials encrypted with AES-256 — never leave your network' },
		{
			icon: Bot,
			text: 'Bring your own AI provider — Groq, Ollama, DeepSeek, Gemini, or any other'
		},
		{ icon: ListChecks, text: 'Immutable audit log — every change attributed and timestamped' }
	];

	const cloudFeatures = [
		{
			icon: Zap,
			text: 'Zero infrastructure to manage — no Compose files, no Postgres, no on-call'
		},
		{
			icon: Shield,
			text: 'WireGuard tunnel managed by Crux — install only the client on your devices'
		},
		{
			icon: Globe,
			text: 'Works across NAT and firewalls — no port forwarding or static IP required'
		},
		{ icon: RefreshCw, text: 'Always on the latest version — updates applied automatically' }
	];
</script>

<section id="introduction" aria-labelledby="intro-heading" class="bg-canvas py-24">
	<div class="mx-auto max-w-4xl px-6">
		<p class="mb-4 font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
			Open Source · Self-Hosted or Cloud
		</p>

		<h2 id="intro-heading" class="mb-6 text-4xl font-bold tracking-tight text-content md:text-5xl">
			The Open Source<br />Network Intelligence Platform.
		</h2>

		<p class="mb-12 max-w-2xl text-base leading-relaxed text-muted">
			Crux is a network ops platform that centrally manages hundreds of network devices, automates
			configuration jobs, and delivers AI-generated root-cause summaries for every incident — deploy
			on your infrastructure or start on the cloud.
		</p>

		<!-- Vercel-style column grid -->
		<div
			class="relative grid grid-cols-1 divide-y divide-edge border border-edge md:grid-cols-2 md:divide-x md:divide-y-0"
		>
			<!-- ── Self-Hosted ───────────────────────────── -->
			<div class="flex flex-col gap-8 p-8">
				<!-- Header -->
				<div>
					<h3 class="mb-3 text-3xl font-bold tracking-tight text-content">Self-Hosted</h3>
					<p class="text-sm leading-relaxed text-muted">
						Full control over your infrastructure, credentials, and data.
						<strong class="font-semibold text-content">Free forever.</strong>
					</p>
				</div>

				<!-- Features -->
				<ul class="flex flex-1 flex-col gap-4">
					{#each selfHostedFeatures as feature (feature.text)}
						{@const Icon = feature.icon}
						<li class="flex items-start gap-3.5">
							<div
								class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-edge bg-elevated"
							>
								<Icon size={14} class="text-muted" />
							</div>
							<span class="pt-1 text-sm leading-relaxed text-muted">{feature.text}</span>
						</li>
					{/each}
				</ul>

				<!-- CTA -->
				<a
					href="https://github.com/LuminousVar/crux-landing"
					target="_blank"
					rel="noopener noreferrer"
					class="vercel-btn vercel-btn--ghost"
				>
					Deploy Now
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

			<!-- ── Cloud ─────────────────────────────────── -->
			<div class="relative flex flex-col gap-8 p-8">
				<!-- "Coming Soon" badge — sits on top border like Vercel "Popular" -->
				<div class="absolute -top-3.5 left-1/2 -translate-x-1/2">
					<span class="coming-soon-badge">Coming Soon</span>
				</div>

				<!-- Header -->
				<div>
					<h3 class="mb-3 text-3xl font-bold tracking-tight text-content">Cloud</h3>
					<p class="text-sm leading-relaxed text-muted">
						Managed infrastructure over WireGuard VPN. Zero server setup on your end.
						<strong class="font-semibold text-content">Early access opening soon.</strong>
					</p>
				</div>

				<!-- Features -->
				<ul class="flex flex-1 flex-col gap-4">
					{#each cloudFeatures as feature (feature.text)}
						{@const Icon = feature.icon}
						<li class="flex items-start gap-3.5">
							<div
								class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-edge bg-elevated"
							>
								<Icon size={14} class="text-muted" />
							</div>
							<span class="pt-1 text-sm leading-relaxed text-muted">{feature.text}</span>
						</li>
					{/each}
				</ul>

				<!-- CTA -->
				<a href="mailto:luminousv@disroot.org" class="vercel-btn vercel-btn--accent">
					Contact Us
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
		</div>
	</div>
</section>

<style>
	/* ── Coming Soon badge (Vercel "Popular" style) ─── */
	.coming-soon-badge {
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

	/* ── Full-width pill buttons (Vercel style) ─────── */
	.vercel-btn {
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

	.vercel-btn--ghost {
		border: 1px solid var(--color-edge);
		background: transparent;
		color: var(--color-content);
	}

	.vercel-btn--ghost:hover {
		background: var(--color-elevated);
		border-color: var(--color-muted);
	}

	.vercel-btn--accent {
		border: 1px solid var(--color-accent);
		background: var(--color-accent);
		color: #fff;
	}

	.vercel-btn--accent:hover {
		background: var(--color-accent-muted);
		border-color: var(--color-accent-muted);
	}
</style>
