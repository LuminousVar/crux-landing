<script lang="ts">
	import FaqItem from '$lib/components/ui/FaqItem.svelte';

	const faqs = [
		{
			question: 'Is Crux free to use?',
			answer:
				'Yes. Crux is open-source and self-hosted. There are no SaaS tiers, usage fees, or telemetry.'
		},
		{
			question: 'What devices are supported?',
			answer:
				'Any device reachable via SNMP v2c/v3 or SSH. Netmiko supports 100+ vendor platforms including Cisco, Juniper, Arista, and MikroTik.'
		},
		{
			question: 'Which AI providers work with Crux?',
			answer:
				'Any OpenAI-compatible provider: Groq, DeepSeek, Gemini (via OpenRouter), or a local model via Ollama. Set three env vars to switch.'
		},
		{
			question: 'How is it deployed?',
			answer:
				'Via Podman Compose (or Docker Compose). A single compose.yaml starts Postgres, Valkey, the FastAPI backend, Celery workers, and the SvelteKit frontend.'
		},
		{
			question: 'Can I contribute?',
			answer:
				'Yes. The repository accepts pull requests. See the contributing guide in the repo README.'
		}
	];
</script>

<section id="faq" class="border-t border-edge bg-surface py-24" aria-labelledby="faq-heading">
	<div class="mx-auto max-w-3xl px-6">
		<p class="mb-3 font-mono text-xs uppercase tracking-widest text-muted">05 // FAQ</p>
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
