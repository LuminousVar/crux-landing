<script lang="ts">
	import GithubIcon from '$lib/components/ui/GithubIcon.svelte';
	import StatItem from '$lib/components/ui/StatItem.svelte';

	const stats = [
		{ value: '6', label: 'Automation job types' },
		{ value: 'AES-256', label: 'Credential encryption' },
		{ value: '100%', label: 'On-premise deployment' },
		{ value: 'OpenAI-compatible', label: 'AI provider support' }
	];
</script>

<section
	class="relative flex min-h-screen flex-col items-center justify-center px-6 pt-24 pb-16 text-center"
	aria-labelledby="hero-heading"
>
	<p class="mb-4 font-mono text-xs uppercase tracking-widest text-muted">
		Open-Source Network Operations Platform
	</p>

	<h1
		id="hero-heading"
		class="mb-6 max-w-3xl text-5xl font-bold leading-tight tracking-tight text-content md:text-6xl"
	>
		Automate.<br />Monitor.<br />Respond.
	</h1>

	<p class="mb-10 max-w-2xl text-lg leading-relaxed text-muted">
		Crux is an on-premise platform for network engineers to automate configuration jobs, monitor
		device health via SNMP, and respond to incidents with AI-assisted analysis.
	</p>

	<div class="mb-16 flex flex-wrap items-center justify-center gap-4">
		<a
			href="#features"
			class="rounded-md bg-accent px-6 py-3 font-medium text-white transition-colors hover:bg-accent-muted"
		>
			Get Started
		</a>
		<a
			href="https://github.com"
			target="_blank"
			rel="noopener noreferrer"
			class="flex items-center gap-2 rounded-md border border-edge px-6 py-3 font-medium text-content transition-colors hover:bg-elevated"
		>
			<GithubIcon size={18} />
			View on GitHub
		</a>
	</div>

	<div
		class="mb-16 flex w-full max-w-2xl flex-wrap justify-center gap-10 border-y border-edge py-8"
	>
		{#each stats as stat}
			<StatItem value={stat.value} label={stat.label} />
		{/each}
	</div>

	<div
		class="w-full max-w-4xl overflow-hidden rounded-lg border border-edge bg-surface"
		role="img"
		aria-label="Crux terminal interface preview"
	>
		<div class="flex items-center gap-2 border-b border-edge bg-elevated px-4 py-3">
			<span class="h-3 w-3 rounded-full bg-danger opacity-70"></span>
			<span class="h-3 w-3 rounded-full bg-warning opacity-70"></span>
			<span class="h-3 w-3 rounded-full bg-success opacity-70"></span>
			<span class="ml-3 font-mono text-xs text-muted">crux — network ops dashboard</span>
		</div>
		<div class="p-6 font-mono text-sm text-left">
			<p class="text-success">$ crux status --all-devices</p>
			<p class="mt-2 text-muted">Polling 24 devices via SNMP v3...</p>
			<p class="mt-1 text-content">
				<span class="text-success">●</span> core-sw-01 <span class="ml-4 text-muted">up · 2ms · 12 interfaces active</span>
			</p>
			<p class="mt-1 text-content">
				<span class="text-success">●</span> edge-rtr-02 <span class="ml-4 text-muted">up · 4ms · 8 interfaces active</span>
			</p>
			<p class="mt-1 text-content">
				<span class="text-warning">●</span> access-sw-07 <span class="ml-4 text-muted">degraded · high CPU · SNMP trap received</span>
			</p>
			<p class="mt-3 text-muted">AI analysis: <span class="text-content">Possible STP loop on Gi0/3 — recommend isolating port.</span></p>
			<p class="mt-2 text-muted">Automation job <span class="font-medium text-accent">backup-all</span> scheduled in 00:14:32</p>
			<p class="mt-2 animate-pulse text-muted">▋</p>
		</div>
	</div>
</section>
