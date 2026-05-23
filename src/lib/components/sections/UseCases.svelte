<script lang="ts">
	import { Network, Shield, TriangleAlert, Server } from 'lucide-svelte';
	import UseCaseCard from '$lib/components/ui/UseCaseCard.svelte';

	const cases = [
		{
			role: 'Network Engineer',
			description:
				'Automate daily backup and health-check jobs across hundreds of devices without writing custom scripts.',
			icon: Network
		},
		{
			role: 'IT Administrator',
			description:
				'Manage device credentials centrally, enforce role-based access, and audit every configuration change.',
			icon: Shield
		},
		{
			role: 'SOC Analyst',
			description:
				'Get instant AI-generated root-cause summaries for SNMP trap floods and interface-down events.',
			icon: TriangleAlert
		},
		{
			role: 'DevOps / Infra',
			description:
				'Deploy Crux entirely on-premise via Podman Compose. No cloud dependencies, no telemetry.',
			icon: Server
		}
	];
</script>

<section
	id="use-cases"
	class="border-t border-edge bg-surface py-24"
	aria-labelledby="use-cases-heading"
>
	<div class="mx-auto max-w-6xl px-6">
		<p class="mb-3 font-mono text-xs uppercase tracking-widest text-muted">03 // USE CASES</p>
		<h2 id="use-cases-heading" class="mb-4 text-3xl font-bold text-content md:text-4xl">
			Built for the people who keep networks running
		</h2>
		<p class="mb-12 max-w-2xl text-muted">
			Whether you're automating jobs, managing access, responding to incidents, or running
			infrastructure — Crux fits the workflow you already have.
		</p>

		<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
			{#each cases as c}
				<UseCaseCard role={c.role} description={c.description} icon={c.icon} />
			{/each}
		</div>
	</div>
</section>
