<script lang="ts">
	import type { DocTable } from '$lib/docs';

	let { title, headers, rows }: DocTable = $props();
</script>

<div class="overflow-hidden rounded-lg border border-edge">
	{#if title}
		<p
			class="border-b border-edge bg-elevated px-4 py-2 font-mono text-[11px] uppercase tracking-wide text-muted/60"
		>
			{title}
		</p>
	{/if}
	<div class="overflow-x-auto">
		<table class="w-full border-collapse text-sm">
			<thead>
				<tr class="bg-elevated">
					{#each headers as header (header)}
						<th
							class="border-b border-edge px-4 py-2.5 text-left font-mono text-[11px] font-medium uppercase tracking-wide text-muted/60"
						>
							{header}
						</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each rows as row, ri (ri)}
					<tr class="border-b border-edge last:border-b-0">
						{#each row as cell, ci (ci)}
							<td
								class="px-4 py-2.5 align-top leading-relaxed {ci === 0
									? 'font-mono text-xs text-accent'
									: 'text-content/80'}"
							>
								{cell}
							</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
