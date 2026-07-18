<script lang="ts">
	import { fly } from 'svelte/transition';
	import { cloudPlan } from '$lib/pricing';
	import PlanCard from '$lib/components/ui/PlanCard.svelte';
</script>

<svelte:head>
	<title>Pricing — Crux Cloud</title>
	<meta
		name="description"
		content="Crux Cloud pricing — the managed, we-host-it-for-you option. Zero server setup over a WireGuard VPN."
	/>
</svelte:head>

<section class="px-6 pb-20">
	<div class="mx-auto max-w-lg" in:fly={{ y: 8, duration: 200 }}>
		<PlanCard plan={cloudPlan} />
	</div>
</section>
