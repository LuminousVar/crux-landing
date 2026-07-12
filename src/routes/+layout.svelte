<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/components/sections/Navbar.svelte';
	import AIChatWidget from '$lib/components/AIChatWidget.svelte';
	import { page } from '$app/state';

	let { children } = $props();

	let isDocs = $derived(page.url.pathname.startsWith('/docs'));

	// Absolute URLs, because Open Graph consumers do not resolve relative ones — a bare
	// "/og-image.png" is silently dropped and the card renders with no image at all.
	const SITE_URL = 'https://crux.watch';
	const TITLE = 'Crux — Network Operations Platform';
	const DESCRIPTION =
		'Open-source on-premise platform for network engineers to automate jobs, monitor devices via SNMP, and respond to incidents with AI analysis.';

	let canonical = $derived(`${SITE_URL}${page.url.pathname}`);

	$effect(() => {
		history.scrollRestoration = 'manual';
		window.scrollTo(0, 0);
	});
</script>

<svelte:head>
	<title>{TITLE}</title>
	<meta name="description" content={DESCRIPTION} />
	<link rel="canonical" href={canonical} />

	<!-- Open Graph / Twitter. Without these, sharing crux.watch anywhere — WhatsApp,
	     LinkedIn, Slack — rendered as a bare URL with no title, no summary and no image.
	     Deeper pages override title/description in their own <svelte:head>; these tags are
	     the site-wide fallback. -->
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="Crux" />
	<meta property="og:url" content={canonical} />
	<meta property="og:title" content={TITLE} />
	<meta property="og:description" content={DESCRIPTION} />
	<meta property="og:image" content="{SITE_URL}/og-image.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content="Crux — Network Operations Platform" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={TITLE} />
	<meta name="twitter:description" content={DESCRIPTION} />
	<meta name="twitter:image" content="{SITE_URL}/og-image.png" />
</svelte:head>

{#if !isDocs}
	<Navbar />
{/if}
{@render children()}
<AIChatWidget />
