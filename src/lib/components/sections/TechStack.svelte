<script lang="ts">
	import TechGroup from '$lib/components/ui/TechGroup.svelte';

	const groups = [
		{
			layer: 'Frontend',
			items: [{ name: 'SvelteKit' }, { name: 'Tailwind CSS v4' }, { name: 'TypeScript' }]
		},
		{
			layer: 'Backend',
			items: [{ name: 'FastAPI' }, { name: 'SQLAlchemy Core' }, { name: 'Celery' }]
		},
		{
			layer: 'Data',
			items: [{ name: 'PostgreSQL 18' }, { name: 'Valkey' }]
		},
		{
			layer: 'Networking',
			items: [{ name: 'Netmiko' }, { name: 'NAPALM' }, { name: 'pysnmp' }]
		},
		{
			layer: 'AI',
			items: [
				{ name: 'OpenAI-compatible API' },
				{ name: 'Groq' },
				{ name: 'DeepSeek' },
				{ name: 'Gemini' }
			]
		},
		{
			layer: 'Deployment',
			items: [{ name: 'Podman Compose' }, { name: 'On-premise Linux' }]
		}
	];
</script>

<section id="tech" class="mx-auto max-w-6xl px-6 py-24" aria-labelledby="tech-heading">
	<p class="mb-3 font-mono text-xs uppercase tracking-widest text-muted">04 // TECH STACK</p>
	<h2 id="tech-heading" class="mb-4 text-3xl font-bold text-content md:text-4xl">
		Proven open-source components
	</h2>
	<p class="mb-12 max-w-2xl text-muted">
		No proprietary lock-in. Every layer of Crux is built on battle-tested open-source software you
		can inspect, modify, and deploy yourself.
	</p>

	<div class="flex flex-col gap-6 rounded-lg border border-edge bg-surface p-8">
		{#each groups as group, i (i)}
			<div>
				<TechGroup layer={group.layer} items={group.items} />
				{#if i < groups.length - 1}
					<div class="mt-6 border-b border-edge"></div>
				{/if}
			</div>
		{/each}
	</div>
</section>
