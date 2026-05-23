<script lang="ts">
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let { role, description, icon: Icon }: { role: string; description: string; icon: any } = $props();
</script>

<div
	class="rounded-lg border border-edge bg-surface p-6 transition-colors duration-200 hover:bg-elevated"
>
	<div class="mb-4 flex items-center gap-3">
		<span class="text-accent">
			<Icon size={22} />
		</span>
		<span class="font-medium text-content">{role}</span>
	</div>
	<p class="text-sm leading-relaxed text-muted">{description}</p>
</div>
