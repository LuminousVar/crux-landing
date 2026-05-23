<script lang="ts">
	import { Server, Cloud } from 'lucide-svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
</script>

<section id="introduction" aria-labelledby="intro-heading" class="bg-canvas py-24">
	<div class="mx-auto max-w-4xl px-6">
		<p class="mb-4 font-mono text-[10px] uppercase tracking-[0.25em] text-muted/60">
			Open Source · Self-Hosted or Cloud
		</p>

		<h2 id="intro-heading" class="mb-6 text-4xl font-bold tracking-tight text-content md:text-5xl">
			The Open Source<br />Network Intelligence Platform.
		</h2>

		<p class="mb-12 max-w-2xl text-base leading-relaxed text-muted">
			Crux is a network ops platform that centrally manages hundreds of network devices, automates
			configuration jobs, and delivers AI-generated root-cause summaries for every incident — deploy
			on your infrastructure or start on the cloud.
		</p>

		<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
			<div class="rounded-lg border border-edge bg-surface p-6">
				<div class="mb-4 flex items-center gap-3">
					<Server size={18} class="text-muted" />
					<span class="text-sm font-semibold text-content">Self-Hosted</span>
				</div>
				<p class="mb-4 text-xs leading-relaxed text-muted">
					Full control over your infrastructure, credentials, and data.
				</p>
				<ul class="space-y-2 text-xs text-muted">
					<li class="flex items-start gap-2">
						<span class="mt-0.5 text-success">✓</span>
						Deploy via Podman Compose or Docker Compose
					</li>
					<li class="flex items-start gap-2">
						<span class="mt-0.5 text-success">✓</span>
						Your secrets never leave your network
					</li>
					<li class="flex items-start gap-2">
						<span class="mt-0.5 text-success">✓</span>
						Bring your own AI provider (Groq, Ollama, Gemini)
					</li>
				</ul>
			</div>

			<div class="rounded-lg border border-accent/30 bg-accent/5 p-6">
				<div class="mb-4 flex items-center gap-3">
					<Cloud size={18} class="text-accent" />
					<span class="text-sm font-semibold text-content">Cloud</span>
					<Badge label="Coming Soon" />
				</div>
				<p class="mb-4 text-xs leading-relaxed text-muted">
					Hosted infrastructure, secured over WireGuard VPN. Email us to get your device added to
					the network.
				</p>
				<ul class="space-y-2 text-xs text-muted">
					<li class="flex items-start gap-2">
						<span class="mt-0.5 text-success">✓</span>
						Connect via WireGuard — compatible with any WireGuard client
					</li>
					<li class="flex items-start gap-2">
						<span class="mt-0.5 text-success">✓</span>
						Email Crux Enterprise to request VPN access
					</li>
					<li class="flex items-start gap-2">
						<span class="mt-0.5 text-success">✓</span>
						We handle infrastructure, updates, and uptime
					</li>
					<li class="flex items-start gap-2">
						<span class="mt-0.5 text-success">✓</span>
						Same open-source core — no feature lock-in
					</li>
				</ul>
			</div>
		</div>
	</div>
</section>
