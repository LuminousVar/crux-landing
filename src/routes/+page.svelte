<script lang="ts">
	import Hero from '$lib/components/sections/Hero.svelte';
	import VendorStrip from '$lib/components/sections/VendorStrip.svelte';
	import Introduction from '$lib/components/sections/Introduction.svelte';
	import FeatureOrbit from '$lib/components/sections/FeatureOrbit.svelte';
	import UseCases from '$lib/components/sections/UseCases.svelte';
	import AgentFeatures from '$lib/components/sections/AgentFeatures.svelte';
	import NetworkHub from '$lib/components/sections/NetworkHub.svelte';
	import Faq from '$lib/components/sections/Faq.svelte';
	import Footer from '$lib/components/sections/Footer.svelte';
</script>

<main>
	<Hero />
	<VendorStrip />
	<Introduction />
	<FeatureOrbit />
	<NetworkHub />
	<UseCases />
	<AgentFeatures />
	<Faq />
	<Footer />
</main>
