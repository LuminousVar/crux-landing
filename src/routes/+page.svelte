<script lang="ts">
	import AgentFeatures from '$lib/components/sections/AgentFeatures.svelte';
	import Demo from '$lib/components/sections/Demo.svelte';
	import Faq from '$lib/components/sections/Faq.svelte';
	import FeatureOrbit from '$lib/components/sections/FeatureOrbit.svelte';
	import Footer from '$lib/components/sections/Footer.svelte';
	import Hero from '$lib/components/sections/Hero.svelte';
	import Introduction from '$lib/components/sections/Introduction.svelte';
	import NetworkHub from '$lib/components/sections/NetworkHub.svelte';
	import UseCases from '$lib/components/sections/UseCases.svelte';
	import VendorStrip from '$lib/components/sections/VendorStrip.svelte';
</script>

<main>
	<Hero />
	<VendorStrip />
	<Demo />
	<Introduction />
	<FeatureOrbit />
	<NetworkHub />
	<UseCases />
	<AgentFeatures />
	<Faq />
	<Footer />
</main>
