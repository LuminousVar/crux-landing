<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<div use:reveal class="reveal">{@render children()}</div>
