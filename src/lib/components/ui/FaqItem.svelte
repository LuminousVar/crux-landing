<script lang="ts">
	let { question, answer }: { question: string; answer: string } = $props();
	let open = $state(false);
</script>

<div class="border-b border-edge">
	<button
		class="flex w-full items-center justify-between gap-4 py-5 text-left text-content transition-colors hover:text-accent"
		aria-expanded={open}
		onclick={() => (open = !open)}
	>
		<span class="font-medium">{question}</span>
		<span class="font-mono text-lg text-muted transition-transform duration-300" class:rotate-45={open}>
			+
		</span>
	</button>
	<div
		class="overflow-hidden transition-all duration-300"
		style="max-height: {open ? '400px' : '0px'};"
	>
		<p class="pb-5 text-muted leading-relaxed">{answer}</p>
	</div>
</div>
