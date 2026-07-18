<script lang="ts">
	import { ArrowRight, Cloud, Gauge, RefreshCw, ServerCog, ShieldCheck, Zap } from 'lucide-svelte';
	import Footer from '$lib/components/sections/Footer.svelte';
	import FaqItem from '$lib/components/ui/FaqItem.svelte';

	const CONTACT = 'mailto:luminousv@disroot.org';

	const reasons = [
		{
			icon: Zap,
			title: 'Zero infrastructure',
			text: 'No Compose files, no Postgres to tune, no Celery workers to babysit. Sign in and start managing devices — we run the whole platform for you.'
		},
		{
			icon: ServerCog,
			title: 'Fully managed',
			text: 'Backups, TLS certificates, database provisioning, and platform upgrades are all handled by Crux. You focus on your network, not the servers under it.'
		},
		{
			icon: ShieldCheck,
			title: 'Secure by tunnel',
			text: 'Crux manages a WireGuard tunnel to your sites. Devices stay on your own network and credentials stay on your side — Cloud never stores your device secrets.'
		},
		{
			icon: RefreshCw,
			title: 'Always current',
			text: 'Every new feature and fix lands automatically. No upgrade windows, no version drift — you are always on the latest Crux.'
		}
	];

	const steps = [
		{
			n: '01',
			title: 'Install the client',
			text: 'Drop the lightweight WireGuard client on one machine per site. No port forwarding, no static IP, no firewall changes.'
		},
		{
			n: '02',
			title: 'Connect your devices',
			text: 'Crux discovers and reaches your routers, switches, and firewalls through the encrypted tunnel — across NAT and any firewall.'
		},
		{
			n: '03',
			title: 'We keep it running',
			text: 'Monitoring, automation, and AI incident analysis run on managed infrastructure. Backups and upgrades happen behind the scenes.'
		}
	];

	const faqs = [
		{
			question: 'When will Crux Cloud be available?',
			answer:
				'Cloud is in active development and opening for early access soon. The self-hosted edition is available today and free — Cloud is for teams who would rather not run the infrastructure themselves.'
		},
		{
			question: 'Where do my device credentials live?',
			answer:
				'On your side of the WireGuard tunnel. Crux Cloud manages the platform and the tunnel, but your device secrets are never stored in Cloud infrastructure.'
		},
		{
			question: 'Do I need to open ports or expose my network?',
			answer:
				'No. The managed WireGuard tunnel works outbound from a client you install, so it traverses NAT and firewalls without any inbound exposure or static IP.'
		},
		{
			question: 'Is Cloud the same product as Self-host?',
			answer:
				'Same features, same platform — SNMP monitoring, config automation, IPAM, topology, RBAC, and AI analysis. The only difference is who runs the servers and handles backups, TLS, and upgrades.'
		},
		{
			question: 'Can I start self-hosted and move to Cloud later?',
			answer:
				'Yes. Start free on your own hardware today; when Cloud opens you can migrate without re-onboarding your inventory.'
		}
	];
</script>

<svelte:head>
	<title>Crux Cloud — managed network operations</title>
	<meta
		name="description"
		content="Crux Cloud is the fully managed, we-host-it-for-you edition. Zero infrastructure to run, secure over a managed WireGuard tunnel. Early access opening soon."
	/>
</svelte:head>

<!-- ── Hero ───────────────────────────────────────────── -->
<section class="bg-canvas px-6 pt-[4.25rem]">
	<div class="mx-auto max-w-3xl pb-16 pt-20 text-center md:pt-28">
		<p class="mb-4 font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
			Managed · We Host
		</p>
		<h1 class="mb-3 text-4xl font-bold tracking-tight text-content sm:text-5xl md:text-6xl">
			<span class="text-accent">Crux</span> Cloud
		</h1>
		<div class="mb-5 flex justify-center">
			<span class="badge">Coming soon</span>
		</div>
		<p class="mx-auto mb-8 max-w-xl text-lg leading-relaxed text-muted">
			The same Crux platform, fully managed. We run the servers, handle the backups and upgrades,
			and connect to your sites over a secure WireGuard tunnel — so you can manage your network with
			zero infrastructure of your own.
		</p>
		<div class="flex flex-wrap items-center justify-center gap-3">
			<a href={CONTACT} class="btn-primary">
				Get early access
				<ArrowRight size={16} />
			</a>
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
			<a href="/demo" class="btn-ghost">Request a demo</a>
		</div>
	</div>
</section>

<!-- ── Why Cloud ──────────────────────────────────────── -->
<section class="border-t border-edge bg-surface py-20" aria-labelledby="why-heading">
	<div class="mx-auto max-w-4xl px-6">
		<h2
			id="why-heading"
			class="mb-3 text-center text-2xl font-bold tracking-tight text-content md:text-3xl"
		>
			Why Crux Cloud?
		</h2>
		<p class="mx-auto mb-12 max-w-xl text-center text-sm leading-relaxed text-muted">
			All the capability of Crux, none of the infrastructure to run it.
		</p>

		<div class="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2">
			{#each reasons as reason (reason.title)}
				{@const Icon = reason.icon}
				<div class="flex gap-4">
					<div
						class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-edge bg-canvas"
					>
						<Icon size={18} class="text-accent" />
					</div>
					<div>
						<h3 class="mb-1.5 text-base font-semibold text-content">{reason.title}</h3>
						<p class="text-sm leading-relaxed text-muted">{reason.text}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- ── How it works ───────────────────────────────────── -->
<section class="border-t border-edge bg-canvas py-20">
	<div class="mx-auto max-w-3xl px-6">
		<p class="mb-3 font-mono text-xs uppercase tracking-widest text-muted">How it works</p>
		<h2 class="mb-3 text-2xl font-bold tracking-tight text-content md:text-3xl">
			Your devices stay put — the platform comes to them
		</h2>
		<p class="mb-12 max-w-xl text-sm leading-relaxed text-muted">
			No re-architecting your network. Crux Cloud reaches your equipment through an encrypted tunnel
			you install in minutes.
		</p>

		<ol class="flex flex-col gap-8">
			{#each steps as step (step.n)}
				<li class="grid grid-cols-[auto_1fr] gap-x-5">
					<span class="font-mono text-sm text-accent">{step.n}</span>
					<div class="min-w-0">
						<h3 class="mb-1 text-base font-semibold text-content">{step.title}</h3>
						<p class="text-sm leading-relaxed text-muted">{step.text}</p>
					</div>
				</li>
			{/each}
		</ol>
	</div>
</section>

<!-- ── Cloud vs Self-host pointer ─────────────────────── -->
<section class="border-t border-edge bg-surface py-20">
	<div class="mx-auto max-w-3xl px-6 text-center">
		<Gauge size={22} class="mx-auto mb-4 text-accent" />
		<h2 class="mb-3 text-2xl font-bold tracking-tight text-content md:text-3xl">
			Prefer to run it yourself?
		</h2>
		<p class="mx-auto mb-6 max-w-xl text-sm leading-relaxed text-muted">
			Crux is open source and free to self-host — the exact same features on your own hardware. Cloud
			simply takes the operations off your plate.
		</p>
		<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
		<a href="/self-host" class="btn-ghost">Explore self-hosting <ArrowRight size={16} /></a>
	</div>
</section>

<!-- ── FAQ ────────────────────────────────────────────── -->
<section class="border-t border-edge bg-canvas py-20" aria-labelledby="cloud-faq-heading">
	<div class="mx-auto max-w-3xl px-6">
		<p class="mb-3 font-mono text-xs uppercase tracking-widest text-muted">FAQ</p>
		<h2
			id="cloud-faq-heading"
			class="mb-12 text-3xl font-bold tracking-tight text-content md:text-4xl"
		>
			Cloud questions
		</h2>
		<div>
			{#each faqs as faq (faq.question)}
				<FaqItem question={faq.question} answer={faq.answer} />
			{/each}
		</div>
	</div>
</section>

<!-- ── Final CTA ──────────────────────────────────────── -->
<section class="border-t border-edge bg-surface py-24">
	<div class="mx-auto max-w-2xl px-6 text-center">
		<Cloud size={26} class="mx-auto mb-4 text-accent" />
		<h2 class="mb-4 text-3xl font-bold tracking-tight text-content md:text-4xl">
			Be first on Crux Cloud
		</h2>
		<p class="mx-auto mb-8 max-w-lg text-base leading-relaxed text-muted">
			Early access is opening soon. Tell us about your network and we'll reach out when it's ready.
		</p>
		<div class="flex flex-wrap items-center justify-center gap-3">
			<a href={CONTACT} class="btn-primary">
				Get early access
				<ArrowRight size={16} />
			</a>
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
			<a href="/pricing" class="btn-ghost">See pricing</a>
		</div>
	</div>
</section>

<Footer />

<style>
	.badge {
		display: inline-flex;
		align-items: center;
		padding: 3px 14px;
		border-radius: 999px;
		border: 1px solid var(--color-edge);
		background: var(--color-surface);
		font-size: 11px;
		font-weight: 500;
		color: var(--color-muted);
		white-space: nowrap;
	}

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
