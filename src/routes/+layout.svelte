<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/components/sections/Navbar.svelte';
	import AIChatWidget from '$lib/components/AIChatWidget.svelte';
	import { page } from '$app/state';

	let { children } = $props();

	let isDocs = $derived(page.url.pathname.startsWith('/docs'));

	$effect(() => {
		history.scrollRestoration = 'manual';
		window.scrollTo(0, 0);
	});
</script>

<svelte:head>
	<title>Crux — Network Operations Platform</title>
	<meta
		name="description"
		content="Open-source on-premise platform for network engineers to automate jobs, monitor devices via SNMP, and respond to incidents with AI analysis."
	/>
</svelte:head>

{#if !isDocs}
	<Navbar />
{/if}
{@render children()}
<AIChatWidget />
