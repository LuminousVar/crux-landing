<script lang="ts">
	import FaqItem from '$lib/components/ui/FaqItem.svelte';

	const faqs = [
		{
			question: 'Is Crux free to use?',
			answer:
				'The self-hosted version is free under the MIT license — no usage fees, no telemetry, no limits. A managed Cloud option is coming soon with a separate pricing plan to cover infrastructure and AI costs.'
		},
		{
			question: 'What devices are supported?',
			answer:
				'Any device reachable via SNMP v2c/v3 or SSH. Netmiko supports 100+ vendor platforms including Cisco, Juniper, Arista, and MikroTik. If your device speaks SSH and has a Netmiko driver, Crux can manage it.'
		},
		{
			question: 'How are credentials stored?',
			answer:
				'Device passwords, SSH keys, and SNMP community strings are encrypted at rest using Fernet (AES-256). Secrets are never returned by the API — they are decrypted only inside the execution layer at the moment a job runs. No plaintext credential ever leaves the server.'
		},
		{
			question: 'Which AI providers work with Crux?',
			answer:
				'Any OpenAI-compatible provider: Groq, DeepSeek, Gemini (via OpenRouter), or a local model via Ollama. Set three environment variables to switch providers — no code changes required.'
		},
		{
			question: 'Can I use a local AI model?',
			answer:
				'Yes. Crux supports any OpenAI-compatible endpoint, including Ollama running on the same machine. AI features work fully air-gapped — no diagnostic data or device state leaves your network.'
		},
		{
			question: "What's the difference between AI Diagnostics and AI Incidents?",
			answer:
				'Diagnostics is on-demand: you trigger an analysis on a specific device and get an immediate root-cause assessment. Incidents is event-driven: every incoming SNMP trap is automatically passed to the LLM and logged with an AI-generated summary — no manual trigger required.'
		},
		{
			question: 'Do automation jobs run automatically or require approval?',
			answer:
				'Both. Each job type can be configured to require human approval before execution, or whitelisted for autonomous runs. Critical operations — config pushes, firmware upgrades — default to approval-required. The approval state is tracked end-to-end: pending → approved → running → success/failed.'
		},
		{
			question: 'What access roles does Crux support?',
			answer:
				'Three built-in roles: Admin (full access), Operator (execute jobs, manage resources), and Viewer (read-only). Every sensitive operation is recorded in an immutable audit log with timestamp and actor.'
		},
		{
			question: 'How is it deployed?',
			answer:
				'Via Podman Compose (or Docker Compose). A single compose.yaml starts PostgreSQL, Valkey, the FastAPI backend, Celery workers, and the SvelteKit frontend. Configuration is done entirely through environment variables — no config files to manage.'
		},
		{
			question: 'Is there a hosted Cloud option?',
			answer:
				'A managed Cloud deployment is coming soon. Crux handles the WireGuard tunnel — your devices stay on your own network, but you skip the self-hosting setup entirely. The self-hosted version remains free and open-source.'
		},
		{
			question: 'What does the Cloud version handle that I would otherwise manage myself?',
			answer:
				'Everything infrastructure-related: PostgreSQL provisioning and backups, Valkey (Redis) setup, Celery worker scaling, TLS certificates, OS patches, and platform upgrades. You connect your devices through an encrypted tunnel — no Compose file, no server to maintain, no database to babysit. Your device credentials stay encrypted on your side of the tunnel and are never stored in Crux infrastructure.'
		},
		{
			question: 'Can I contribute?',
			answer:
				'Yes. The repository accepts pull requests for bug fixes, new vendor templates, and feature additions. Check the contributing guide in the repo README for branch conventions and how to run the stack locally.'
		}
	];
</script>

<section id="faq" class="border-t border-edge bg-surface py-24" aria-labelledby="faq-heading">
	<div class="mx-auto max-w-3xl px-6">
		<p class="mb-3 font-mono text-xs uppercase tracking-widest text-muted">04 // FAQ</p>
		<h2 id="faq-heading" class="mb-12 text-3xl font-bold text-content md:text-4xl">
			Common questions
		</h2>

		<div>
			{#each faqs as faq, i (i)}
				<FaqItem question={faq.question} answer={faq.answer} />
			{/each}
		</div>
	</div>
</section>
