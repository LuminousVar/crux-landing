<script lang="ts">
	interface NoteState {
		id: number;
		dot: string;
		category: string;
		title: string;
		text: string;
		x: number;
		y: number;
		rotation: number;
	}

	const notes = [
		{
			id: 1,
			dot: 'bg-accent',
			category: 'Monitoring',
			title: 'BGP Status',
			text: 'Check BGP session state on all edge routers. Flag any sessions in IDLE or ACTIVE state.'
		},
		{
			id: 2,
			dot: 'bg-success',
			category: 'Automation',
			title: 'MOP Generator',
			text: "Generate a maintenance operation procedure for tonight's config-push window."
		},
		{
			id: 3,
			dot: 'bg-warning',
			category: 'Automation',
			title: 'Backup Audit',
			text: "List all devices that haven't had a successful backup in the last 7 days."
		},
		{
			id: 4,
			dot: 'bg-accent',
			category: 'AI',
			title: 'Trap Summary',
			text: 'Summarize all SNMP traps from the last hour, grouped by severity and device.'
		},
		{
			id: 5,
			dot: 'bg-success',
			category: 'Monitoring',
			title: 'Health Check',
			text: 'Run a full health check on core-sw-01 — uptime, CPU load, and interface error counts.'
		},
		{
			id: 6,
			dot: 'bg-warning',
			category: 'Monitoring',
			title: 'High CPU',
			text: 'Show all devices reporting CPU above 80% in the last 15 minutes.'
		},
		{
			id: 7,
			dot: 'bg-danger',
			category: 'AI',
			title: 'Fault Analysis',
			text: 'What caused the interface flap on dist-rt-02? Return root cause with remediation steps.'
		},
		{
			id: 8,
			dot: 'bg-muted',
			category: 'Community',
			title: 'Suggest a feature',
			text: 'Have an idea for the AI agent? Open an issue on GitHub and help shape the roadmap.'
		}
	];

	const initialPositions = [
		{ x: 40, y: 30 },
		{ x: 255, y: 55 },
		{ x: 490, y: 18 },
		{ x: 710, y: 45 },
		{ x: 75, y: 265 },
		{ x: 330, y: 285 },
		{ x: 565, y: 245 },
		{ x: 770, y: 265 }
	];

	const rotations = [-3, 2, -1, 4, -2, 3, -4, 1];

	let noteStates = $state<NoteState[]>(
		notes.map((n, i) => ({
			...n,
			x: initialPositions[i].x,
			y: initialPositions[i].y,
			rotation: rotations[i]
		}))
	);

	let draggingId = $state<number | null>(null);
	let dragOffset = $state({ x: 0, y: 0 });

	function handlePointerDown(e: PointerEvent, id: number) {
		e.preventDefault();
		draggingId = id;
		const note = noteStates.find((n) => n.id === id)!;
		dragOffset = { x: e.clientX - note.x, y: e.clientY - note.y };
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
	}

	function handlePointerMove(e: PointerEvent) {
		if (draggingId === null) return;
		const note = noteStates.find((n) => n.id === draggingId)!;
		note.x = e.clientX - dragOffset.x;
		note.y = e.clientY - dragOffset.y;
	}

	function handlePointerUp() {
		draggingId = null;
	}
</script>

<section
	id="agent-features"
	aria-labelledby="agent-heading"
	class="relative border-t border-edge bg-canvas py-24"
>
	<!-- grid background spans the full section -->
	<div
		class="pointer-events-none absolute inset-0 opacity-[0.35]"
		style="background-image: linear-gradient(var(--color-edge) 1px, transparent 1px), linear-gradient(90deg, var(--color-edge) 1px, transparent 1px); background-size: 24px 24px;"
	></div>

	<div class="relative mx-auto max-w-7xl px-6">
		<p class="mb-4 font-mono text-xs uppercase tracking-widest text-muted">03 // AI Agent</p>
		<h2 id="agent-heading" class="mb-4 text-4xl font-bold tracking-tight text-content md:text-5xl">
			Talk to your network.
		</h2>
		<p class="mb-16 max-w-xl text-base text-muted">
			Describe what you need. The agent handles the rest.
		</p>

		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="relative h-[480px] overflow-hidden rounded-xl"
			onpointermove={handlePointerMove}
			onpointerup={handlePointerUp}
			onpointerleave={handlePointerUp}
		>
			{#each noteStates as note (note.id)}
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div
					class="absolute w-52 select-none rounded-xl border border-edge bg-surface p-4
						{draggingId === note.id ? 'z-50 cursor-grabbing' : 'z-10 cursor-grab'}"
					style="transform: translate({note.x}px, {note.y}px) rotate({note.rotation}deg); top: 0; left: 0;"
					onpointerdown={(e) => handlePointerDown(e, note.id)}
				>
					<div class="mb-2 flex items-center gap-2">
						<span class="h-2 w-2 flex-shrink-0 rounded-full {note.dot}"></span>
						<span class="font-mono text-[10px] uppercase tracking-wider text-muted"
							>{note.category}</span
						>
					</div>
					<p class="mb-1.5 text-sm font-semibold text-content">{note.title}</p>
					<p class="text-[11px] leading-relaxed text-muted">{note.text}</p>
				</div>
			{/each}
		</div>

		<p class="mt-4 text-right font-mono text-[10px] uppercase tracking-widest text-muted/40">
			↕ Try moving the cards
		</p>
	</div>
</section>
