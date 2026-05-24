<script lang="ts">
	import UseCaseCard from '$lib/components/ui/UseCaseCard.svelte';

	const cases = [
		{
			tag: 'Automation',
			role: 'Network\nEngineer',
			description:
				'Schedule backup, health-check, and config-push jobs across hundreds of devices. Let cron handle the routine — get paged only when something breaks.',
			color: '#c0ccda',
			watermark: 'A'
		},
		{
			tag: 'AI Incident Response',
			role: 'SOC\nAnalyst',
			description:
				'Every SNMP trap gets an AI-generated root-cause summary before you open the ticket. Less noise, faster triage, cleaner handoffs.',
			color: '#f09870',
			watermark: 'S'
		},
		{
			tag: 'Access Control',
			role: 'IT\nAdministrator',
			description:
				'Issue scoped credentials, enforce role-based access, and review every sensitive operation in the immutable audit log.',
			color: '#a8c8a8',
			watermark: 'C'
		},
		{
			tag: 'API & Integrations',
			role: 'DevOps\nEngineer',
			description:
				'Pull device state via the REST API, push events to your SIEM via webhooks, and deploy Crux itself with a single Compose file.',
			color: '#e8cc70',
			watermark: 'P'
		},
		{
			tag: 'Topology & Planning',
			role: 'Network\nArchitect',
			description:
				'Design your topology in the visual editor and generate a full MOP document before every maintenance window.',
			color: '#c4a8d8',
			watermark: 'T'
		},
		{
			tag: 'Credential Vault',
			role: 'Security\nEngineer',
			description:
				'Device passwords and SSH keys encrypted at rest with AES-256. Secrets are never returned by the API — only decrypted inside the execution layer.',
			color: '#90c0c0',
			watermark: 'V'
		},
		{
			tag: 'Monitoring',
			role: 'NOC\nOperator',
			description:
				'Watch the live dashboard for device health, bandwidth, and active incidents. AI triages the alerts so you respond to what matters.',
			color: '#d4a878',
			watermark: 'M'
		}
	];

	const COUNT = cases.length;

	let offset = $state(0);
	let isHovered = $state(false);
	let isDragging = $state(false);

	let _isHovered = false;
	let _isDragging = false;
	$effect(() => {
		_isHovered = isHovered;
	});
	$effect(() => {
		_isDragging = isDragging;
	});

	$effect(() => {
		let rafId: number;
		let prev: number | null = null;

		const tick = (t: number) => {
			if (prev !== null && !_isHovered && !_isDragging) {
				offset = (offset + (t - prev) / 12000) % COUNT;
			}
			prev = t;
			rafId = requestAnimationFrame(tick);
		};

		rafId = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(rafId);
	});

	let dragStartX = 0;
	let dragOffsetStart = 0;

	function onPointerDown(e: PointerEvent) {
		isDragging = true;
		dragStartX = e.clientX;
		dragOffsetStart = offset;
	}

	function onPointerMove(e: PointerEvent) {
		if (!_isDragging) return;
		const dx = e.clientX - dragStartX;
		offset = (((dragOffsetStart - dx / 295) % COUNT) + COUNT) % COUNT;
	}

	function onPointerUp() {
		isDragging = false;
	}

	function lerp(a: number, b: number, t: number) {
		return a + (b - a) * t;
	}

	function getPosStyle(i: number) {
		let rel = (((i - offset) % COUNT) + COUNT) % COUNT;
		if (rel > COUNT / 2) rel -= COUNT;

		const absRel = Math.abs(rel);
		const sign = rel >= 0 ? 1 : -1;

		let tx: number, ry: number, s: number, op: number;

		if (absRel <= 1) {
			tx = lerp(0, 308, absRel) * sign;
			ry = lerp(0, 16, absRel) * sign;
			s = lerp(1, 0.82, absRel);
			op = lerp(1, 0.7, absRel);
		} else if (absRel <= 1.35) {
			const t = (absRel - 1) / 0.35;
			tx = lerp(308, 408, t) * sign;
			ry = lerp(16, 20, t) * sign;
			s = lerp(0.82, 0.72, t);
			op = lerp(0.7, 0, t);
		} else {
			tx = 408 * sign;
			ry = 20 * sign;
			s = 0.72;
			op = 0;
		}

		return {
			transform: `translateX(calc(-50% + ${tx}px)) rotateY(${ry}deg) scale(${s})`,
			opacity: op,
			zIndex: absRel < 0.5 ? 10 : absRel < 1.5 ? 5 : 0,
			pointerEvents: op < 0.05 ? 'none' : 'auto'
		};
	}
</script>

<svelte:window onpointermove={onPointerMove} onpointerup={onPointerUp} />

<section
	id="use-cases"
	aria-labelledby="use-cases-heading"
	class="border-t border-edge bg-canvas py-24"
>
	<div class="mx-auto max-w-7xl px-6">
		<p class="mb-4 font-mono text-xs uppercase tracking-widest text-muted">03 // Use Cases</p>
		<h2
			id="use-cases-heading"
			class="mb-4 text-4xl font-bold tracking-tight text-content md:text-5xl"
		>
			Built for every role.
		</h2>
		<p class="mb-16 max-w-xl text-base text-muted">
			From engineer to engineer — every workflow has a place in Crux.
		</p>
	</div>

	<div
		class="relative mx-auto max-w-5xl select-none {isDragging ? 'cursor-grabbing' : 'cursor-grab'}"
		style="perspective: 1000px; height: 420px;"
		role="group"
		aria-label="Use cases carousel"
		onmouseenter={() => (isHovered = true)}
		onmouseleave={() => (isHovered = false)}
		onpointerdown={onPointerDown}
	>
		{#each cases as c, i (i)}
			{@const pos = getPosStyle(i)}
			<div
				class="absolute left-1/2 top-0 w-[300px]"
				style="
					transform: {pos.transform};
					opacity: {pos.opacity};
					z-index: {pos.zIndex};
					pointer-events: {pos.pointerEvents};
					height: 400px;
					transform-style: preserve-3d;
				"
			>
				<UseCaseCard
					tag={c.tag}
					role={c.role}
					description={c.description}
					color={c.color}
					watermark={c.watermark}
				/>
			</div>
		{/each}
	</div>
</section>
