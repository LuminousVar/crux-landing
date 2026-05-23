<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/components/sections/Navbar.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<title>Crux — Network Operations Platform</title>
	<meta
		name="description"
		content="Open-source on-premise platform for network engineers to automate jobs, monitor devices via SNMP, and respond to incidents with AI analysis."
	/>
</svelte:head>

<Navbar />
{@render children()}
