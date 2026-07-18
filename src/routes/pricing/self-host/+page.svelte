<script lang="ts">
	import { fly } from 'svelte/transition';
	import { Infinity as InfinityIcon, Lock, ShieldCheck, Unlock } from 'lucide-svelte';
	import { selfHostPlan } from '$lib/pricing';
	import PlanCard from '$lib/components/ui/PlanCard.svelte';

	// Mirrors Penpot's "Why Self-Host?" — four reasons, adapted to Crux's network-ops context.
	const reasons = [
		{
			icon: Lock,
			title: 'Data privacy & security',
			text: 'Device credentials, configs, and audit records stay on your own servers — encrypted with AES-256 and governed by your own policies.'
		},
		{
			icon: ShieldCheck,
			title: 'Access & compliance',
			text: 'Run fully air-gapped with a local AI model — no device state or diagnostics ever leave your network. Fits GDPR, ISO 27001, or internal IT policy.'
		},
		{
			icon: InfinityIcon,
			title: 'Unlimited scale',
			text: 'No seat caps, no device limits, no usage fees. Manage tens or thousands of devices on hardware you already control.'
		},
		{
			icon: Unlock,
			title: 'Business continuity',
			text: 'MIT-licensed and fully open source. Even if Crux Cloud ever changes, you keep both your data and the code — forever.'
		}
	];
</script>

<svelte:head>
	<title>Pricing — Self-host Crux</title>
	<meta
		name="description"
		content="Self-host Crux for free — the open-source, you-host-it option. Full control over your infrastructure, credentials, and data."
	/>
</svelte:head>

<section class="px-6 pb-16">
	<div class="mx-auto max-w-lg" in:fly={{ y: 8, duration: 200 }}>
		<PlanCard plan={selfHostPlan} />
	</div>
</section>

<!-- ── Why self-host Crux? ────────────────────────────── -->
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
