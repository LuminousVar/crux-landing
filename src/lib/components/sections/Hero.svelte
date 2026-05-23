<script lang="ts">
	const words = ['Automate.', 'Monitor.', 'Analyze.'];

	function makePaths(position: number) {
		return Array.from({ length: 36 }, (_, i) => ({
			id: i,
			d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
				380 - i * 5 * position
			} -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
				152 - i * 5 * position
			} ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
				684 - i * 5 * position
			} ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
			strokeOpacity: 0.08 + i * 0.02,
			strokeWidth: 0.4 + i * 0.015,
			duration: 20 + (i % 10),
			delay: -(i * 0.6)
		}));
	}

	const pathsPos = makePaths(1);
	const pathsNeg = makePaths(-1);
</script>

<section
	class="relative flex min-h-screen items-center justify-center overflow-hidden"
	aria-labelledby="hero-heading"
>
	<!-- Animated background paths -->
	<div class="pointer-events-none absolute inset-0" aria-hidden="true">
		{#each [pathsPos, pathsNeg] as paths, si (si)}
			<svg
				class="absolute inset-0 h-full w-full"
				viewBox="0 0 696 316"
				fill="none"
				overflow="visible"
				style="color: var(--color-content)"
			>
				{#each paths as path (path.id)}
					<path
						d={path.d}
						stroke="currentColor"
						stroke-width={path.strokeWidth}
						stroke-opacity={path.strokeOpacity}
						pathLength="1"
						stroke-dasharray="0.35 0.65"
						vector-effect="non-scaling-stroke"
						style="animation: path-travel {path.duration}s {path.delay}s linear infinite"
					/>
				{/each}
			</svg>
		{/each}
	</div>

	<!-- Hero content -->
	<div class="relative z-10 px-6 text-center">
		<h1
			id="hero-heading"
			class="mb-8 text-6xl font-bold tracking-tighter text-content sm:text-7xl md:text-8xl"
		>
			{#each words as word, wi (wi)}
				<span class="block">
					{#each word.split('') as letter, li (li)}
						<span
							class="inline-block"
							style="animation: letter-in 0.6s {wi * 0.15 +
								li * 0.05}s both cubic-bezier(0.34,1.56,0.64,1)">{letter}</span
						>
					{/each}
				</span>
			{/each}
		</h1>

		<div style="animation: fade-up 0.6s 0.8s both">
			<a
				href="#features"
				class="inline-flex items-center gap-2 rounded-2xl bg-surface px-8 py-4 text-base font-semibold text-content transition-all duration-300 hover:-translate-y-0.5 hover:bg-elevated"
			>
				Explore Crux
				<span class="text-muted transition-transform duration-300 group-hover:translate-x-0.5"
					>→</span
				>
			</a>
		</div>
	</div>
</section>
