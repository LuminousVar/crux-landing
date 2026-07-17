<script lang="ts">
	import CodeBlock from './code-block.svelte';

	interface Props {
		curl: string;
		curlHtml: string;
		fetchJs: string;
		fetchHtml: string;
	}
	let { curl, curlHtml, fetchJs, fetchHtml }: Props = $props();

	let lang = $state<'curl' | 'js'>('curl');
</script>

<div>
	<div class="mb-2 flex gap-1">
		<button
			type="button"
			onclick={() => (lang = 'curl')}
			class="rounded px-2.5 py-1 font-mono text-[11px] transition-colors
				{lang === 'curl' ? 'bg-elevated text-accent' : 'text-muted/60 hover:text-muted'}"
		>
			cURL
		</button>
		<button
			type="button"
			onclick={() => (lang = 'js')}
			class="rounded px-2.5 py-1 font-mono text-[11px] transition-colors
				{lang === 'js' ? 'bg-elevated text-accent' : 'text-muted/60 hover:text-muted'}"
		>
			JavaScript
		</button>
	</div>
	{#if lang === 'curl'}
		<CodeBlock label="Request" code={curl} html={curlHtml} />
	{:else}
		<CodeBlock label="Request" code={fetchJs} html={fetchHtml} />
	{/if}
</div>
