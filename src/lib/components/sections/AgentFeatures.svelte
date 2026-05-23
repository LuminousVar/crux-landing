<script lang="ts">
	interface NoteState {
		id: number;
		dot: string;
		category: string;
		title: string;
		text: string;
		tag: string;
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
			text: 'Check BGP session state on all edge routers. Flag any sessions in IDLE or ACTIVE state, and return the peer AS, uptime, and prefix count for each.',
			tag: 'routing / bgp / edge'
		},
		{
			id: 2,
			dot: 'bg-success',
			category: 'Automation',
			title: 'MOP Generator',
			text: "Generate a full maintenance operation procedure for tonight's config-push window. Include pre-checks, rollback steps, and a post-change verification checklist.",
			tag: 'planning / ops / automation'
		},
		{
			id: 3,
			dot: 'bg-warning',
			category: 'Automation',
			title: 'Backup Audit',
			text: "List all devices that haven't had a successful backup in the last 7 days. Group by site and include the timestamp of the last known-good backup.",
			tag: 'compliance / backup / audit'
		},
		{
			id: 4,
			dot: 'bg-accent',
			category: 'AI',
			title: 'Trap Summary',
			text: 'Summarize all SNMP traps from the last hour, grouped by severity and device. Highlight any traps that indicate repeated failures or escalating error counts.',
			tag: 'snmp / alerts / triage'
		},
		{
			id: 5,
			dot: 'bg-success',
			category: 'Monitoring',
			title: 'Health Check',
			text: 'Run a full health check on core-sw-01. Return uptime, CPU load, memory usage, interface error counts, and any interfaces currently in a down state.',
			tag: 'health / device / status'
		},
		{
			id: 6,
			dot: 'bg-warning',
			category: 'Monitoring',
			title: 'High CPU',
			text: 'Show all devices reporting CPU above 80% in the last 15 minutes. Include the process or task driving the spike if available from SNMP OIDs.',
			tag: 'performance / cpu / alert'
		},
		{
			id: 7,
			dot: 'bg-danger',
			category: 'AI',
			title: 'Fault Analysis',
			text: 'What caused the interface flap on dist-rt-02? Analyze available SNMP data and return a root cause assessment with specific remediation commands.',
			tag: 'diagnosis / ai / remediation'
		},
		{
			id: 8,
			dot: 'bg-muted',
			category: 'Community',
			title: 'Suggest a feature',
			text: 'Have an idea for the AI agent? Open an issue on GitHub and describe the command or workflow you want supported. Every suggestion is reviewed.',
			tag: 'community / feedback / roadmap'
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
	let sectionEl: HTMLElement | null = null;
	let boardEl: HTMLElement | null = null;

	// Card width matches w-52 (13rem = 208px)
	const CARD_W = 208;

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

		let newX = e.clientX - dragOffset.x;
		let newY = e.clientY - dragOffset.y;

		if (sectionEl && boardEl) {
			const sr = sectionEl.getBoundingClientRect();
			const br = boardEl.getBoundingClientRect();
			// Clamp note position directly in board-relative coords
			newX = Math.max(sr.left - br.left, Math.min(newX, sr.right - br.left - CARD_W));
			newY = Math.max(sr.top - br.top, Math.min(newY, sr.bottom - br.top));
		}

		note.x = newX;
		note.y = newY;
	}

	function handlePointerUp() {
		draggingId = null;
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<section
	id="agent-features"
	aria-labelledby="agent-heading"
	class="relative border-t border-edge bg-canvas py-24"
	bind:this={sectionEl}
	onpointermove={handlePointerMove}
	onpointerup={handlePointerUp}
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

		<!-- board — visual height container only, no event handling -->
		<div class="relative h-[480px]" bind:this={boardEl}>
			{#each noteStates as note, i (note.id)}
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div
					class="absolute w-52 min-h-[265px] select-none rounded-lg bg-elevated p-6
						{draggingId === note.id ? 'z-50 cursor-grabbing' : 'z-10 cursor-grab'}"
					style="transform: translate({note.x}px, {note.y}px) rotate({note.rotation}deg); top: 0; left: 0; box-shadow: 0 1px 3px rgba(0,0,0,0.55), 0 6px 18px rgba(0,0,0,0.45), 0 20px 40px rgba(0,0,0,0.25);"
					onpointerdown={(e) => handlePointerDown(e, note.id)}
				>
					<!-- pin -->
					<div
						class="absolute left-1/2 top-0 z-10 h-[14px] w-[14px] -translate-x-1/2 -translate-y-1/2 rounded-full"
						style="background: {i % 2 === 0
							? 'var(--color-danger)'
							: 'var(--color-accent)'}; box-shadow: 0 3px 8px rgba(0,0,0,0.75), 0 1px 3px rgba(0,0,0,0.5), inset 0 2px 3px rgba(255,255,255,0.3), inset 0 -2px 3px rgba(0,0,0,0.3);"
					></div>

					<div class="mb-[30px] flex items-center gap-2">
						<span class="h-[3px] w-[3px] flex-shrink-0 rounded-full {note.dot}"></span>
						<span class="font-mono text-[10px] uppercase tracking-wider text-muted"
							>{note.category}</span
						>
					</div>
					<p class="mb-1.5 text-[17px] font-semibold text-content">{note.title}</p>
					<p class="text-xs leading-relaxed text-muted">{note.text}</p>
					<span class="mt-4 block font-mono text-[10px] text-muted/40">{note.tag}</span>
				</div>
			{/each}
		</div>

		<p class="mt-4 text-right font-mono text-[10px] uppercase tracking-widest text-muted/40">
			↕ Try moving the cards
		</p>
	</div>
</section>
