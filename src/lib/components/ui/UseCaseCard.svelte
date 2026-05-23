<script lang="ts">
	let {
		tag,
		role,
		description,
		color,
		watermark
	}: {
		tag: string;
		role: string;
		description: string;
		color: string;
		watermark: string;
	} = $props();
</script>

<div
	class="relative flex h-full flex-col overflow-hidden p-6"
	style="background-color: {color}; border-radius: 3px;"
>
	<!-- Background watermark letter -->
	<span
		class="pointer-events-none absolute bottom-0 right-0 translate-x-3 translate-y-3 select-none font-black italic leading-none text-black opacity-[0.07]"
		aria-hidden="true"
		style="font-size: 130px; line-height: 1;"
	>
		{watermark}
	</span>

	<span class="relative z-10 mb-6 font-mono text-[9px] uppercase tracking-[0.18em] text-black/40">
		# {tag}
	</span>
	<p
		class="relative z-10 whitespace-pre-line text-[1.65rem] font-black uppercase leading-[1] tracking-tight text-black"
	>
		{role}
	</p>
	<p class="relative z-10 mt-auto text-sm leading-relaxed text-black/60">
		{description}
	</p>
</div>
