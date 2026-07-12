<script lang="ts">
	import { Bot, Loader2, Send, Sparkles, X } from 'lucide-svelte';
	import { tick } from 'svelte';

	// No LLM credentials here, by design. This widget talks to our own /api/chat function,
	// which holds the key server-side (see api/chat.js). It previously called Groq directly
	// with PUBLIC_LLM_API_KEY — and every PUBLIC_ value is baked into the client bundle, so
	// the key was downloadable by anyone at /_app/env.js.
	//
	// The system prompt lives on the server too. Sending it from here would let anyone POST
	// their own prompt to /api/chat and use it as a free general-purpose LLM.

	// ── State (in-memory only — clears when tab is closed) ───────────────────
	let open = $state(false);
	let input = $state('');
	let loading = $state(false);
	let error = $state<string | null>(null);
	let scrollEl = $state<HTMLDivElement | null>(null);
	let inputEl = $state<HTMLTextAreaElement | null>(null);

	interface Message {
		role: 'user' | 'assistant';
		content: string;
	}

	let messages = $state<Message[]>([]);

	// ── Daily usage cap (casual-abuse mitigation; per device via localStorage) ──
	const DAILY_LIMIT = 15;
	const USAGE_KEY = 'crux_chat_usage';
	let used = $state(0);
	let limitReached = $derived(used >= DAILY_LIMIT);
	let remaining = $derived(Math.max(0, DAILY_LIMIT - used));

	function today() {
		return new Date().toISOString().slice(0, 10);
	}

	$effect(() => {
		try {
			const raw = localStorage.getItem(USAGE_KEY);
			if (raw) {
				const parsed = JSON.parse(raw) as { date: string; count: number };
				used = parsed.date === today() ? parsed.count : 0;
			}
		} catch {
			used = 0;
		}
	});

	function recordUsage() {
		used += 1;
		try {
			localStorage.setItem(USAGE_KEY, JSON.stringify({ date: today(), count: used }));
		} catch {
			// ignore storage failures — cap is best-effort
		}
	}

	const SUGGESTIONS = [
		'What is Crux?',
		'How do I deploy Crux?',
		'Which AI providers does Crux support?',
		'What devices are compatible?'
	];

	async function scrollToBottom() {
		await tick();
		if (scrollEl) scrollEl.scrollTop = scrollEl.scrollHeight;
	}

	async function send() {
		const text = input.trim();
		if (!text || loading) return;
		if (limitReached) {
			error = 'Daily question limit reached. Please try again tomorrow.';
			return;
		}

		error = null;
		input = '';
		messages = [...messages, { role: 'user', content: text }];
		loading = true;
		await scrollToBottom();

		try {
			// Our own function, not the provider. It picks the model, pins the system prompt,
			// and is the only place the API key exists.
			const res = await fetch('/api/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ messages: messages.slice(-10) })
			});

			const data = (await res.json().catch(() => ({}))) as { reply?: string; error?: string };

			if (!res.ok) {
				throw new Error(data.error ?? `Error ${res.status}`);
			}
			if (!data.reply) {
				throw new Error('Assistant returned no answer.');
			}

			messages = [...messages, { role: 'assistant', content: data.reply }];
			recordUsage();
		} catch (e) {
			error = e instanceof Error ? e.message : 'Assistant unavailable.';
			messages = messages.slice(0, -1);
			input = text;
		} finally {
			loading = false;
			await scrollToBottom();
			inputEl?.focus();
		}
	}

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			send();
		}
	}

	function clearChat() {
		messages = [];
		error = null;
	}
</script>

<!-- Floating bubble -->
<div class="fixed right-6 bottom-6 z-50 flex flex-col items-end gap-3">
	{#if !open}
		<button
			type="button"
			onclick={() => (open = true)}
			title="Ask about Crux"
			class="group flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-accent/40
				bg-surface shadow-lg transition-all duration-200 hover:scale-105 hover:border-accent
				hover:shadow-accent/20"
		>
			<Bot size={22} class="text-accent transition-transform group-hover:scale-110" />
		</button>
	{/if}

	{#if open}
		<div
			class="flex h-[520px] w-[360px] flex-col overflow-hidden rounded-xl border border-edge
				bg-surface shadow-xl"
		>
			<!-- Header -->
			<div class="flex shrink-0 items-center justify-between border-b border-edge px-4 py-3">
				<div class="flex items-center gap-2.5">
					<div class="relative">
						<Bot size={16} class="text-accent" />
						<span
							class="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full border border-surface bg-success"
						></span>
					</div>
					<div>
						<p class="text-xs font-semibold text-content">Crux Assistant</p>
						<p class="text-xs text-muted">Ask anything about Crux</p>
					</div>
				</div>
				<div class="flex items-center gap-1">
					{#if messages.length > 0}
						<button
							type="button"
							onclick={clearChat}
							class="cursor-pointer rounded px-2 py-1 text-xs text-muted transition-colors hover:bg-elevated hover:text-content"
						>
							Clear
						</button>
					{/if}
					<button
						type="button"
						onclick={() => (open = false)}
						class="cursor-pointer rounded p-1 text-muted transition-colors hover:bg-elevated hover:text-content"
					>
						<X size={15} />
					</button>
				</div>
			</div>

			<!-- Messages -->
			<div
				bind:this={scrollEl}
				class="flex-1 space-y-4 overflow-y-auto px-4 py-4 [scrollbar-width:thin]"
			>
				{#if messages.length === 0}
					<div class="flex flex-col items-center gap-4 pt-4 text-center">
						<div class="rounded-full border border-edge bg-elevated p-3">
							<Sparkles size={20} class="text-accent" />
						</div>
						<div>
							<p class="text-xs font-medium text-content">How can I help?</p>
							<p class="mt-0.5 text-xs text-muted">Ask anything about the Crux platform.</p>
						</div>
						<div class="flex w-full flex-col gap-1.5">
							{#each SUGGESTIONS as suggestion (suggestion)}
								<button
									type="button"
									disabled={limitReached}
									onclick={() => {
										input = suggestion;
										send();
									}}
									class="cursor-pointer rounded border border-edge bg-elevated px-3 py-2 text-left text-xs text-muted
										transition-colors hover:border-accent/40 hover:text-content
										disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-edge disabled:hover:text-muted"
								>
									{suggestion}
								</button>
							{/each}
						</div>
					</div>
				{:else}
					{#each messages as msg (msg)}
						{#if msg.role === 'user'}
							<div class="flex justify-end">
								<div
									class="max-w-[80%] rounded-2xl rounded-tr-sm bg-accent/15 px-3 py-2
										text-xs leading-relaxed text-content"
								>
									{msg.content}
								</div>
							</div>
						{:else}
							<div class="flex items-start gap-2">
								<div
									class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full
										border border-edge bg-elevated"
								>
									<Bot size={12} class="text-accent" />
								</div>
								<div
									class="max-w-[85%] rounded-2xl rounded-tl-sm border border-edge bg-elevated px-3 py-2
										text-xs leading-relaxed text-content"
								>
									{msg.content}
								</div>
							</div>
						{/if}
					{/each}

					{#if loading}
						<div class="flex items-start gap-2">
							<div
								class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full
									border border-edge bg-elevated"
							>
								<Bot size={12} class="text-accent" />
							</div>
							<div class="rounded-2xl rounded-tl-sm border border-edge bg-elevated px-3 py-2.5">
								<div class="flex items-center gap-1.5">
									<span
										class="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:0ms]"
									></span>
									<span
										class="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:150ms]"
									></span>
									<span
										class="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:300ms]"
									></span>
								</div>
							</div>
						</div>
					{/if}
				{/if}

				{#if error}
					<p class="rounded border border-danger/50 px-3 py-2 text-xs text-danger">{error}</p>
				{/if}
			</div>

			<!-- Input -->
			<div class="shrink-0 border-t border-edge px-3 py-3">
				{#if limitReached}
					<p
						class="mb-2 rounded border border-edge bg-elevated px-3 py-2 text-center text-xs text-muted"
					>
						Daily question limit reached — try again tomorrow.
					</p>
				{/if}
				<div
					class="flex items-end gap-2 rounded-lg border border-edge bg-elevated px-3 py-2
						focus-within:border-accent"
				>
					<textarea
						bind:this={inputEl}
						bind:value={input}
						onkeydown={onKeydown}
						placeholder={limitReached ? 'Daily limit reached' : 'Ask about Crux…'}
						rows="1"
						disabled={loading || limitReached}
						class="flex-1 resize-none border-0 bg-transparent text-xs text-content
							shadow-none placeholder:text-muted focus:ring-0 focus:outline-none disabled:opacity-50"
						style="max-height: 80px; overflow-y: auto; field-sizing: content;"
					></textarea>
					<button
						type="button"
						onclick={send}
						disabled={!input.trim() || loading || limitReached}
						class="mb-0.5 flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-full
							bg-elevated text-content transition-all hover:bg-accent-muted
							disabled:cursor-not-allowed disabled:opacity-40"
					>
						{#if loading}
							<Loader2 size={12} class="animate-spin" />
						{:else}
							<Send size={11} />
						{/if}
					</button>
				</div>
				<p class="mt-1.5 text-center text-xs text-muted">
					Enter to send · Shift+Enter new line · {remaining} left today
				</p>
			</div>
		</div>
	{/if}
</div>
