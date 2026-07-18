<script lang="ts">
	import {
		ArrowRight,
		Box,
		Boxes,
		Container,
		KeyRound,
		Server,
		ShieldCheck,
		Terminal,
		Workflow
	} from 'lucide-svelte';
	import Footer from '$lib/components/sections/Footer.svelte';
	import FaqItem from '$lib/components/ui/FaqItem.svelte';

	const REPO = 'https://github.com/LuminousVar/crux-landing';

	// Mirrors Penpot's three "Why self-hosting?" cards — Privacy, Ownership,
	// Interoperability — reworded for Crux's network-ops context.
	const reasons = [
		{
			icon: ShieldCheck,
			title: 'Privacy',
			text: 'Keep your network data private. Credentials, configs, and audit logs stay on your own servers — encrypted with AES-256 and never phoning home. You decide who has access.'
		},
		{
			icon: KeyRound,
			title: 'Ownership',
			text: 'Own your platform. MIT-licensed and fully open source — no vendor lock-in and no forced upgrades. Make your own decisions, on your own timeline.'
		},
		{
			icon: Workflow,
			title: 'Interoperability',
			text: 'No limits to scale. A full REST API, webhooks, and 100+ vendor drivers interconnect Crux with your existing teams, tools, and workflows.'
		}
	];

	// Honest deploy paths for Crux (one Compose stack). Tool logos aren't bundled, so
	// each option uses a matching lucide icon rather than a copied brand mark.
	const installOptions = [
		{
			icon: Container,
			name: 'Docker Compose',
			text: 'The industry-standard container runtime. A single compose.yaml brings up the whole Crux stack — Postgres, Valkey, Celery, the FastAPI backend, and the SvelteKit frontend.',
			cta: 'Self-host with Docker',
			href: '/docs/installation'
		},
		{
			icon: Box,
			name: 'Podman Compose',
			text: 'A daemonless, rootless alternative to Docker. The exact same compose file runs unchanged — a natural fit for hardened or SELinux-enforced hosts.',
			cta: 'Self-host with Podman',
			href: '/docs/installation'
		},
		{
			icon: Server,
			name: 'Any Linux VPS',
			text: 'Bring your own Linux server. The bootstrap script installs the container runtime, TLS, and Crux in one pass — from a bare box to a running platform.',
			cta: 'Self-host on a VPS',
			href: '/docs/installation'
		}
	];

	const faqs = [
		{
			question: 'What do I need to run Crux?',
			answer:
				'A Linux host with Docker or Podman and Compose. The stack (Postgres, Valkey, Celery, FastAPI, SvelteKit) is orchestrated by a single compose.yaml — no manual service wiring.'
		},
		{
			question: 'How are device credentials protected?',
			answer:
				'SSH keys, passwords, and SNMP community strings are encrypted at rest with Fernet (AES-256) and decrypted only inside the execution layer at the moment a job runs. Secrets are never returned by the API.'
		},
		{
			question: 'Can it run fully offline / air-gapped?',
			answer:
				'Yes. Point the AI provider at a local Ollama model and Crux works with no outbound connectivity — no diagnostic data or device state leaves your network.'
		},
		{
			question: 'Which AI providers are supported?',
			answer:
				'Any OpenAI-compatible endpoint: Groq, DeepSeek, Gemini (via OpenRouter), or a local model through Ollama. Switch providers with three environment variables — no code changes.'
		},
		{
			question: 'How do I get updates?',
			answer:
				'Pull the latest tag and re-run compose. Because you host it, you decide when to upgrade — nothing is forced. Prefer we handle upgrades? That is what Crux Cloud is for.'
		}
	];
</script>

<svelte:head>
	<title>Self-host Crux — run it on your own infrastructure</title>
	<meta
		name="description"
		content="Self-host Crux for free and open source. Full control over your network data, credentials, and infrastructure — deploy anywhere Docker or Podman runs."
	/>
</svelte:head>

<!-- ── Hero ───────────────────────────────────────────── -->
<section class="bg-canvas px-6 pt-[4.25rem]">
	<div class="mx-auto max-w-3xl pb-16 pt-20 text-center md:pt-28">
		<p class="mb-4 font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
			Open Source · You Host
		</p>
		<h1 class="mb-5 text-4xl font-bold tracking-tight text-content sm:text-5xl md:text-6xl">
			Self-host <span class="text-accent">Crux</span>
		</h1>
		<p class="mx-auto mb-8 max-w-xl text-lg leading-relaxed text-muted">
			Crux is a fully open-source network operations platform you can run anywhere you control —
			your data centre, a private cloud, or a single box on-premise. Your network never leaves your
			network.
		</p>
		<div class="flex flex-wrap items-center justify-center gap-3">
			<a href="#deploy" class="btn-primary">
				See install options
				<ArrowRight size={16} />
			</a>
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
			<a href="/docs/installation" class="btn-ghost">Read the docs</a>
		</div>
	</div>
</section>

<!-- ── Why self-host ──────────────────────────────────── -->
<section class="border-t border-edge bg-surface py-20" aria-labelledby="why-heading">
	<div class="mx-auto max-w-4xl px-6">
		<h2
			id="why-heading"
			class="mb-3 text-center text-2xl font-bold tracking-tight text-content md:text-3xl"
		>
			Why self-host Crux?
		</h2>
		<p class="mx-auto mb-12 max-w-xl text-center text-sm leading-relaxed text-muted">
			When you run the platform, the whole network stays on your side of the wire.
		</p>

		<div class="grid grid-cols-1 gap-10 sm:grid-cols-3">
			{#each reasons as reason (reason.title)}
				{@const Icon = reason.icon}
				<div class="flex flex-col items-center text-center">
					<div class="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10">
						<Icon size={26} class="text-accent" />
					</div>
					<h3 class="mb-2 text-lg font-semibold text-content">{reason.title}</h3>
					<p class="text-sm leading-relaxed text-muted">{reason.text}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- ── Problem context ────────────────────────────────── -->
<section class="border-t border-edge bg-canvas py-20">
	<div class="mx-auto max-w-3xl px-6">
		<h2
			class="mb-6 max-w-2xl text-2xl font-bold leading-snug tracking-tight text-content md:text-4xl"
		>
			A new era of more complex needs for network infrastructure
		</h2>
		<p class="max-w-2xl text-base leading-relaxed text-muted">
			For too long, running a network has meant pricey proprietary suites or cloud-only dashboards
			that ship your device data off-site. Crux gives you total freedom through self-hosted
			deployment. Apply your own security and backup policies, keep every credential inside your
			perimeter, and extend the platform to fit your own topology. Run Crux in a private cloud or on
			a box in the rack — the experience stays the same.
		</p>
	</div>
</section>

<!-- ── Deploy steps ───────────────────────────────────── -->
<section id="deploy" class="scroll-mt-20 border-t border-edge bg-surface py-20">
	<div class="mx-auto max-w-3xl px-6">
		<p class="mb-3 font-mono text-xs uppercase tracking-widest text-muted">Install</p>
		<h2 class="mb-3 text-2xl font-bold tracking-tight text-content md:text-3xl">
			Crux self-host install options
		</h2>
		<p class="mb-10 max-w-xl text-sm leading-relaxed text-muted">
			Crux ships as one Compose stack, so it runs on anything Docker-compatible. Pick the path that
			fits your environment.
		</p>

		<!-- eslint-disable svelte/no-navigation-without-resolve -->
		<div class="flex flex-col gap-4">
			{#each installOptions as opt (opt.name)}
				{@const Icon = opt.icon}
				<a
					href={opt.href}
					class="group block rounded-xl border border-edge bg-canvas p-6 transition-colors hover:border-accent/50"
				>
					<div class="flex items-start gap-4">
						<div
							class="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent/10"
						>
							<Icon size={22} class="text-accent" />
						</div>
						<div class="min-w-0 flex-1">
							<h3 class="text-base font-semibold text-content">{opt.name}</h3>
							<p class="mt-1 text-sm leading-relaxed text-muted">{opt.text}</p>
							<span class="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
								{opt.cta}
								<ArrowRight size={15} class="transition-transform group-hover:translate-x-0.5" />
							</span>
						</div>
					</div>
				</a>
			{/each}
		</div>

		<p class="mt-6 text-xs leading-relaxed text-muted/70">
			Any Docker-compatible host works. Running Crux under Kubernetes or other orchestrators is
			possible, but not officially supported yet.
		</p>

		<div class="mt-8 flex items-center gap-3 rounded-lg border border-edge bg-canvas px-5 py-4">
			<Terminal size={18} class="shrink-0 text-accent" />
			<p class="text-sm text-muted">
				Full walkthrough — environment variables, reverse proxy, and backups — is in the
				<a href="/docs/installation" class="text-accent hover:underline">installation guide</a>.
			</p>
		</div>
		<!-- eslint-enable svelte/no-navigation-without-resolve -->
	</div>
</section>

<!-- ── What you get ───────────────────────────────────── -->
<section class="border-t border-edge bg-canvas py-20">
	<div class="mx-auto max-w-3xl px-6 text-center">
		<Boxes size={22} class="mx-auto mb-4 text-accent" />
		<h2 class="mb-3 text-2xl font-bold tracking-tight text-content md:text-3xl">
			The full platform — nothing held back
		</h2>
		<p class="mx-auto mb-6 max-w-xl text-sm leading-relaxed text-muted">
			SNMP monitoring, SSH config automation across 100+ vendors, IPAM, topology, RBAC, immutable
			audit logs, and AI incident analysis — every feature ships in the open-source build. The
			self-hosted edition is the complete product, free forever.
		</p>
		<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
		<a href="/pricing/self-host" class="btn-ghost">Compare with Cloud <ArrowRight size={16} /></a>
	</div>
</section>

<!-- ── FAQ ────────────────────────────────────────────── -->
<section class="border-t border-edge bg-surface py-20" aria-labelledby="sh-faq-heading">
	<div class="mx-auto max-w-3xl px-6">
		<p class="mb-3 font-mono text-xs uppercase tracking-widest text-muted">FAQ</p>
		<h2 id="sh-faq-heading" class="mb-12 text-3xl font-bold tracking-tight text-content md:text-4xl">
			Self-hosting questions
		</h2>
		<div>
			{#each faqs as faq (faq.question)}
				<FaqItem question={faq.question} answer={faq.answer} />
			{/each}
		</div>
	</div>
</section>

<!-- ── Final CTA ──────────────────────────────────────── -->
<section class="border-t border-edge bg-canvas py-24">
	<div class="mx-auto max-w-2xl px-6 text-center">
		<h2 class="mb-4 text-3xl font-bold tracking-tight text-content md:text-4xl">
			Run your network on your terms
		</h2>
		<p class="mx-auto mb-8 max-w-lg text-base leading-relaxed text-muted">
			Free, open source, and yours to control. Deploy Crux today — or let us host it for you.
		</p>
		<div class="flex flex-wrap items-center justify-center gap-3">
			<a href={REPO} target="_blank" rel="noopener noreferrer" class="btn-primary">
				Deploy now
				<ArrowRight size={16} />
			</a>
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
			<a href="/cloud" class="btn-ghost">Explore Crux Cloud</a>
		</div>
	</div>
</section>

<Footer />

<style>
	.btn-primary {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 12px 20px;
		border-radius: 10px;
		border: 1px solid var(--color-accent);
		background: var(--color-accent);
		color: #fff;
		font-size: 0.9375rem;
		font-weight: 500;
		text-decoration: none;
		transition:
			background 0.15s,
			border-color 0.15s;
	}

	.btn-primary:hover {
		background: var(--color-accent-muted);
		border-color: var(--color-accent-muted);
	}

	.btn-ghost {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 12px 20px;
		border-radius: 10px;
		border: 1px solid var(--color-edge);
		background: transparent;
		color: var(--color-content);
		font-size: 0.9375rem;
		font-weight: 500;
		text-decoration: none;
		transition:
			background 0.15s,
			border-color 0.15s;
	}

	.btn-ghost:hover {
		background: var(--color-elevated);
		border-color: var(--color-muted);
	}
</style>
