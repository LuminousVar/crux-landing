<script lang="ts">
	import { PUBLIC_FORMSPREE_URL } from '$env/static/public';
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
		{ x: 20, y: 25 }, // BGP Status      — top-left
		{ x: 355, y: 10 }, // MOP Generator   — top center-left
		{ x: 645, y: 35 }, // Backup Audit    — top center-right
		{ x: 975, y: 15 }, // Trap Summary    — top-right
		{ x: 30, y: 335 }, // Health Check    — bottom-left
		{ x: 360, y: 345 }, // High CPU        — bottom center-left
		{ x: 640, y: 330 }, // Fault Analysis  — bottom center-right
		{ x: 970, y: 350 } // Suggest feature — bottom-right
	];

	const rotations = [-4, 3, -5, 2, 4, -3, 5, -2];

	let noteStates = $state<NoteState[]>(
		notes.map((n, i) => ({
			...n,
			x: initialPositions[i].x,
			y: initialPositions[i].y,
			rotation: rotations[i]
		}))
	);

	let draggingId = $state<number | null>(null);
	let topId = $state<number | null>(null);
	let dragOffset = $state({ x: 0, y: 0 });
	let sectionEl: HTMLElement | null = null;
	let boardEl: HTMLElement | null = null;

	let editText = $state('');
	let emailText = $state('');
	let textareaEl = $state<HTMLTextAreaElement | null>(null);
	let submitting = $state(false);
	let submitted = $state(false);
	let submitError = $state('');

	async function handleSubmit() {
		submitting = true;
		submitError = '';
		try {
			const res = await fetch(PUBLIC_FORMSPREE_URL, {
				method: 'POST',
				headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
				body: JSON.stringify({
					message: editText,
					...(emailText.trim() ? { _replyto: emailText } : {})
				})
			});
			if (res.ok) {
				submitted = true;
				editText = '';
				emailText = '';
			} else {
				submitError = 'Failed to send. Please try again.';
			}
		} catch {
			submitError = 'Network error. Please try again.';
		} finally {
			submitting = false;
		}
	}

	// Card width matches w-[250px]
	const CARD_W = 250;

	function handlePointerDown(e: PointerEvent, id: number) {
		topId = id;
		if ((e.target as HTMLElement).closest('textarea, input, button')) {
			// topId update triggers a synchronous DOM patch; defer focus so it lands after
			if (id === 8 && textareaEl) {
				const el = textareaEl;
				queueMicrotask(() => el.focus());
			}
			return;
		}
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
	<!-- bottom hint -->
	<p
		class="absolute bottom-5 right-6 rounded-sm border border-dotted border-accent/30 px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-muted/70"
	>
		↕ Try moving the cards
	</p>

	<!-- grid background spans the full section -->
	<div
		class="pointer-events-none absolute inset-0 opacity-[0.35]"
		style="background-image: linear-gradient(var(--color-edge) 1px, transparent 1px), linear-gradient(90deg, var(--color-edge) 1px, transparent 1px); background-size: 24px 24px;"
	></div>

	<div class="relative mx-auto max-w-7xl px-6">
		<p class="mb-4 font-mono text-xs uppercase tracking-widest text-muted">04 // AI Agent</p>
		<h2 id="agent-heading" class="mb-4 text-4xl font-bold tracking-tight text-content md:text-5xl">
			Talk to your network.
		</h2>
		<p class="mb-16 max-w-xl text-base text-muted">
			Describe what you need. The agent handles the rest.
		</p>

		<!-- board — visual height container only, no event handling -->
		<div class="relative h-[624px]" bind:this={boardEl}>
			{#each noteStates as note, i (note.id)}
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div
					class="absolute w-[250px] min-h-[265px] bg-elevated p-6
						{note.id === 8 ? '' : 'select-none'}
						{draggingId === note.id
							? 'z-50 cursor-grabbing'
							: topId === note.id
								? 'z-20 cursor-grab'
								: 'z-10 cursor-grab'}"
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
					{#if note.id === 8}
						<textarea
							bind:this={textareaEl}
							bind:value={editText}
							class="w-full resize-none bg-transparent text-sm leading-relaxed text-content placeholder:text-muted/40 focus:outline-none"
							style="caret-color: white; user-select: text;"
							rows="5"
							placeholder="Have an idea for the AI agent? Describe the command or workflow you want supported."
						></textarea>
						<input
							type="email"
							bind:value={emailText}
							class="mt-3 w-full border-b border-edge bg-transparent pb-1.5 text-xs text-content placeholder:text-muted/40 focus:border-accent focus:outline-none"
							placeholder="Email (optional)"
						/>
						{#if submitted}
							<p class="mt-4 font-mono text-[11px] uppercase tracking-widest text-success">
								Sent.
							</p>
						{:else}
							<button
								class="send-btn mt-4 w-full disabled:cursor-not-allowed disabled:opacity-40"
								disabled={!editText.trim() || submitting}
								onclick={handleSubmit}
							>
								{submitting ? 'Sending…' : 'Send'}
							</button>
							{#if submitError}
								<p class="mt-2 font-mono text-[10px] text-danger">{submitError}</p>
							{/if}
						{/if}
					{:else}
						<p class="text-sm leading-relaxed text-muted">{note.text}</p>
						<span class="mt-4 block font-mono text-[10px] text-muted/40">{note.tag}</span>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	.send-btn {
		display: block;
		padding: 8px 20px;
		border-radius: 999px;
		border: 1px solid rgba(255, 255, 255, 0.35);
		background: transparent;
		color: rgba(255, 255, 255, 0.55);
		font-family: ui-monospace, 'Cascadia Code', monospace;
		font-size: 11px;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		cursor: pointer;
		transition:
			border-color 0.2s,
			background 0.2s,
			color 0.2s;
	}

	.send-btn:hover:not(:disabled) {
		border-color: rgba(255, 255, 255, 0.75);
		background: rgba(255, 255, 255, 0.06);
		color: #fff;
	}
</style>
