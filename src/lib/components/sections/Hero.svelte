<script lang="ts">
	const lines = [
		['Automate.', 'Schedule.', 'Backup.'],
		['Monitor.', 'Visualize.', 'Alert.'],
		['Analyze.', 'Diagnose.', 'Respond.']
	];

	let indices = $state([0, 0, 0]);
	let visible = $state([true, true, true]);

	$effect(() => {
		let tick = 0;

		const timer = setInterval(() => {
			const line = tick % 3;

			visible[line] = false;

			setTimeout(() => {
				indices[line] = (indices[line] + 1) % lines[line].length;
				visible[line] = true;
			}, 300);

			tick++;
		}, 5000);

		return () => clearInterval(timer);
	});

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
			<span class="block overflow-hidden">
				<span
					class="inline-block transition-all duration-300 {visible[0]
						? 'opacity-100 translate-y-0'
						: 'opacity-0 -translate-y-3'}"
				>
					{lines[0][indices[0]]}
				</span>
			</span>
			<span class="block overflow-hidden">
				<span
					class="inline-block transition-all duration-300 {visible[1]
						? 'opacity-100 translate-y-0'
						: 'opacity-0 -translate-y-3'}"
				>
					{lines[1][indices[1]]}
				</span>
			</span>
			<span class="block overflow-hidden">
				<span
					class="inline-block transition-all duration-300 {visible[2]
						? 'opacity-100 translate-y-0'
						: 'opacity-0 -translate-y-3'}"
				>
					{lines[2][indices[2]]}
				</span>
			</span>
		</h1>

		<div>
			<a href="#features" class="hero-cta">
				Get Started
				<span class="hero-cta-arrow" aria-hidden="true">
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
					</svg>
				</span>
			</a>
		</div>
	</div>
</section>

<style>
	.hero-cta {
		display: inline-flex;
		align-items: center;
		padding: 14px 28px;
		border-radius: 999px;
		border: 1px solid rgba(255, 255, 255, 0.6);
		background: rgba(255, 255, 255, 0.13);
		color: #fff;
		font-size: 1rem;
		font-weight: 600;
		text-decoration: none;
		white-space: nowrap;
		overflow: hidden;
		transition:
			background 0.2s,
			border-color 0.2s,
			padding-right 0.2s;
	}

	.hero-cta:hover {
		background: rgba(255, 255, 255, 0.2);
		border-color: rgba(255, 255, 255, 0.8);
		padding-right: 18px;
	}

	.hero-cta-arrow {
		display: inline-flex;
		align-items: center;
		width: 0;
		margin-left: 0;
		opacity: 0;
		overflow: hidden;
		flex-shrink: 0;
		transition:
			width 0.2s ease,
			opacity 0.2s ease,
			margin-left 0.2s ease;
	}

	.hero-cta:hover .hero-cta-arrow {
		width: 16px;
		margin-left: 8px;
		opacity: 1;
	}
</style>
