<script lang="ts">
	// lucide-svelte v1.0.1 ships Svelte 4 class types, not compatible with Svelte 5 Component
	/* eslint-disable @typescript-eslint/no-explicit-any */
	import { Activity, Bot, BrainCircuit, Network, ShieldCheck, Zap } from 'lucide-svelte';

	const features: { icon: any; label: string; category: string; description: string }[] = [
		{
			icon: Activity,
			label: 'Monitor',
			category: 'MONITORING',
			description:
				'Real-time SNMP polling and device health scoring. Auto-refresh every 30s with per-device bandwidth, uptime, and interface charts.'
		},
		{
			icon: BrainCircuit,
			label: 'AI Agent',
			category: 'AI',
			description:
				'Conversational AI for network operations — natural-language queries about device state and automated runbook execution.'
		},
		{
			icon: Zap,
			label: 'Automate',
			category: 'AUTOMATION',
			description:
				'Background job execution with human-approval workflows. Cron scheduling and 100+ vendor-specific job templates.'
		},
		{
			icon: ShieldCheck,
			label: 'Secure',
			category: 'SECURITY',
			description:
				'AES-256 encrypted credential vault with live connection testing. Admin, Operator, and Viewer RBAC with immutable audit log.'
		},
		{
			icon: Network,
			label: 'Topology',
			category: 'MONITORING',
			description:
				'Live network topology with link status overlays. Drag-and-drop topology editor with MiniMap and device node management.'
		},
		{
			icon: Bot,
			label: 'Diagnose',
			category: 'AI',
			description:
				'On-demand LLM fault analysis — analyzes SNMP data and returns root cause with specific remediation commands.'
		}
	];
	/* eslint-enable @typescript-eslint/no-explicit-any */

	const RADIUS = 185;
	const SIZE = 500;
	const CX = SIZE / 2;
	const CY = SIZE / 2;
	const COUNT = features.length;

	let rotation = $state(0);
	let selectedIdx = $state<number | null>(null);

	// Non-reactive shadow used inside rAF to avoid reactive tracking in callback
	let _paused = false;
	$effect(() => {
		_paused = selectedIdx !== null;
	});

	$effect(() => {
		let rafId: number;
		let prev: number | null = null;

		const tick = (t: number) => {
			if (prev !== null && !_paused) {
				rotation = (rotation + (t - prev) * 0.006) % 360;
			}
			prev = t;
			rafId = requestAnimationFrame(tick);
		};

		rafId = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(rafId);
	});

	function getPos(i: number) {
		const deg = rotation + (360 / COUNT) * i - 90;
		const rad = (deg * Math.PI) / 180;
		return {
			x: CX + Math.cos(rad) * RADIUS,
			y: CY + Math.sin(rad) * RADIUS
		};
	}

	function select(i: number) {
		selectedIdx = selectedIdx === i ? null : i;
	}

	let devicePowered = $state(true);
</script>

<section id="features" aria-labelledby="features-heading" class="bg-canvas py-24">
	<div class="mx-auto max-w-7xl px-6">
		<!-- Section header -->
		<div>
			<p class="mb-4 font-mono text-xs uppercase tracking-widest text-muted">01 // Features</p>
			<h2
				id="features-heading"
				class="mb-4 text-4xl font-bold tracking-tight text-content md:text-5xl"
			>
				All ops. One platform.
			</h2>
			<p class="mb-16 max-w-xl text-base text-muted">
				Monitoring, automation, and AI triage — built as one system, not bolted together.
			</p>
		</div>

		<!-- Orbit — all screen sizes, scales down on mobile -->
		<div class="flex justify-center">
			<div class="orbit-scaler">
			<div class="relative" style="width: {SIZE}px; height: {SIZE}px">
				<!-- Orbit ring -->
				<svg class="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
					<circle
						cx={CX}
						cy={CY}
						r={RADIUS}
						style="stroke: var(--color-edge)"
						stroke-width="1"
						fill="none"
					/>
				</svg>

				<!-- Center -->
				<div
					class="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
				>
					{#if selectedIdx !== null}
						{@const f = features[selectedIdx]}
						<!-- Feature card -->
						<div class="pointer-events-auto w-56 rounded-lg border border-edge bg-surface p-4">
							<div class="mb-3">
								<span
									class="rounded-full border border-edge px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-muted"
								>
									{f.category}
								</span>
							</div>
							<p class="mb-2 text-sm font-semibold text-content">{f.label}</p>
							<p class="text-[11px] leading-relaxed text-muted">{f.description}</p>
							<button
								class="mt-4 font-mono text-[9px] text-muted/50 transition-colors hover:text-muted"
								onclick={() => (selectedIdx = null)}
							>
								✕ close
							</button>
						</div>
					{:else}
						<!-- 3D isometric network switch — drag to rotate, power LED to toggle -->
						<div class="pointer-events-auto flex select-none flex-col items-center gap-2">
							<div>
								<svg viewBox="0 0 195 110" width="195" height="110" aria-hidden="true">
									<!-- Right face -->
									<path
										d="M135,45 L185,15 L185,55 L135,85Z"
										style="fill: var(--color-canvas); stroke: var(--color-edge); stroke-width: 0.75"
									/>
									<!-- Top face -->
									<path
										d="M15,45 L135,45 L185,15 L65,15Z"
										style="fill: var(--color-elevated); stroke: var(--color-edge); stroke-width: 0.75"
									/>
									<!-- Vent strips on top face -->
									<line
										x1="27"
										y1="38"
										x2="147"
										y2="38"
										style="stroke: var(--color-edge); stroke-width: 1.5"
									/>
									<line
										x1="38"
										y1="31"
										x2="158"
										y2="31"
										style="stroke: var(--color-edge); stroke-width: 1.5"
									/>
									<line
										x1="50"
										y1="24"
										x2="170"
										y2="24"
										style="stroke: var(--color-edge); stroke-width: 1.5"
									/>
									<!-- Front face -->
									<rect
										x="15"
										y="45"
										width="120"
										height="40"
										style="fill: var(--color-surface); stroke: var(--color-edge); stroke-width: 0.75"
									/>
									<!-- Left bezel strip -->
									<rect x="15" y="45" width="12" height="40" style="fill: var(--color-elevated)" />
									<!-- Power LED visual -->
									<circle
										cx="21"
										cy="65"
										r="2.5"
										style="fill: {devicePowered
											? 'var(--color-success)'
											: 'var(--color-edge)'}; pointer-events: none;"
									/>
									<circle
										cx="21"
										cy="65"
										r="9"
										role="button"
										tabindex="0"
										aria-label={devicePowered ? 'Power off' : 'Power on'}
										style="fill: transparent; cursor: pointer;"
										onclick={() => (devicePowered = !devicePowered)}
										onkeydown={(e) =>
											e.key === 'Enter' || e.key === ' ' ? (devicePowered = !devicePowered) : null}
									/>
									<!-- Ethernet ports -->
									<rect
										x="33"
										y="59"
										width="8"
										height="7"
										rx="1"
										style="fill: var(--color-canvas); stroke: var(--color-edge); stroke-width: 0.5"
									/>
									<rect
										x="44"
										y="59"
										width="8"
										height="7"
										rx="1"
										style="fill: var(--color-canvas); stroke: var(--color-edge); stroke-width: 0.5"
									/>
									<rect
										x="55"
										y="59"
										width="8"
										height="7"
										rx="1"
										style="fill: var(--color-canvas); stroke: var(--color-edge); stroke-width: 0.5"
									/>
									<rect
										x="66"
										y="59"
										width="8"
										height="7"
										rx="1"
										style="fill: var(--color-canvas); stroke: var(--color-edge); stroke-width: 0.5"
									/>
									<rect
										x="77"
										y="59"
										width="8"
										height="7"
										rx="1"
										style="fill: var(--color-canvas); stroke: var(--color-edge); stroke-width: 0.5"
									/>
									<rect
										x="88"
										y="59"
										width="8"
										height="7"
										rx="1"
										style="fill: var(--color-canvas); stroke: var(--color-edge); stroke-width: 0.5"
									/>
									<rect
										x="99"
										y="59"
										width="8"
										height="7"
										rx="1"
										style="fill: var(--color-canvas); stroke: var(--color-edge); stroke-width: 0.5"
									/>
									<rect
										x="110"
										y="59"
										width="8"
										height="7"
										rx="1"
										style="fill: var(--color-canvas); stroke: var(--color-edge); stroke-width: 0.5"
									/>
									<!-- Port LEDs -->
									<circle
										cx="37"
										cy="56"
										r="1.5"
										style="fill: {devicePowered ? 'var(--color-success)' : 'var(--color-edge)'}"
									/>
									<circle
										cx="48"
										cy="56"
										r="1.5"
										style="fill: {devicePowered ? 'var(--color-success)' : 'var(--color-edge)'}"
									/>
									<circle
										cx="59"
										cy="56"
										r="1.5"
										style="fill: {devicePowered ? 'var(--color-success)' : 'var(--color-edge)'}"
									/>
									<circle
										cx="70"
										cy="56"
										r="1.5"
										style="fill: {devicePowered ? 'var(--color-success)' : 'var(--color-edge)'}"
									/>
									<circle
										cx="81"
										cy="56"
										r="1.5"
										style="fill: {devicePowered ? 'var(--color-warning)' : 'var(--color-edge)'}"
									/>
									<circle
										cx="92"
										cy="56"
										r="1.5"
										style="fill: {devicePowered ? 'var(--color-success)' : 'var(--color-edge)'}"
									/>
									<circle cx="103" cy="56" r="1.5" style="fill: var(--color-edge)" />
									<circle cx="114" cy="56" r="1.5" style="fill: var(--color-edge)" />
									<!-- SFP uplink port -->
									<rect
										x="121"
										y="57"
										width="11"
										height="9"
										rx="1"
										style="fill: var(--color-canvas); stroke: {devicePowered
											? 'var(--color-accent)'
											: 'var(--color-edge)'}; stroke-width: 0.75"
									/>
									<!-- Model label -->
									<text
										x="76"
										y="78"
										text-anchor="middle"
										style="fill: var(--color-muted); font-family: monospace; font-size: 6px;"
										opacity="0.5">CRX-SW-01</text
									>
								</svg>
							</div>
							<span
								class="font-mono text-[9px] uppercase tracking-widest transition-colors duration-300 {devicePowered
									? 'text-success'
									: 'text-muted'}"
								style={!devicePowered ? 'opacity: 0.35' : ''}
							>
								{devicePowered ? '● online' : '○ offline'}
							</span>
						</div>
					{/if}
				</div>

				<!-- Orbit items -->
				{#each features as feature, i (i)}
					{@const pos = getPos(i)}
					{@const isActive = selectedIdx === i}
					{@const Icon = feature.icon}
					<button
						class="absolute flex flex-col items-center gap-1.5 focus:outline-none"
						style="left: {pos.x}px; top: {pos.y}px; transform: translate(-50%, -50%)"
						onclick={() => select(i)}
						aria-pressed={isActive}
						aria-label={feature.label}
					>
						<div
							class="flex h-11 w-11 items-center justify-center rounded-full border transition-colors duration-200
							{isActive
								? 'border-accent bg-accent text-white'
								: 'border-edge bg-elevated text-muted hover:border-accent/50 hover:text-content'}"
						>
							<Icon size={17} />
						</div>
						<span
							class="font-mono text-[10px] transition-colors duration-200
							{isActive ? 'text-content' : 'text-muted'}"
						>
							{feature.label}
						</span>
					</button>
				{/each}
			</div>
			</div>
		</div>
	</div>
</section>

<style>
	.orbit-scaler {
		transform-origin: top center;
	}

	/* Large phones (430–599px): slight scale down */
	@media (max-width: 599px) and (min-width: 430px) {
		.orbit-scaler {
			transform: scale(0.78);
			margin-bottom: -110px; /* 500 * (0.78 - 1) */
		}
	}

	/* Small phones (< 430px): scale to fit ~375px screens */
	@media (max-width: 429px) {
		.orbit-scaler {
			transform: scale(0.62);
			margin-bottom: -190px; /* 500 * (0.62 - 1) */
		}
	}
</style>
