<script lang="ts">
	import { Bot, Loader2, Send, Sparkles, X } from 'lucide-svelte';
	import { tick } from 'svelte';
	import { PUBLIC_LLM_BASE_URL, PUBLIC_LLM_API_KEY, PUBLIC_LLM_MODEL } from '$env/static/public';

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

	const SYSTEM_PROMPT = `You are a helpful assistant for Crux, an open-source on-premise network operations platform.
Crux helps network engineers automate jobs, monitor devices via SNMP, manage credentials, analyze incidents with AI, and control access via RBAC.
Answer questions about what Crux does, how it works, deployment, features, and use cases.
Keep answers concise and technical. If asked about something unrelated to Crux or networking, politely redirect.`;

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

		error = null;
		input = '';
		messages = [...messages, { role: 'user', content: text }];
		loading = true;
		await scrollToBottom();

		const baseUrl = PUBLIC_LLM_BASE_URL || 'https://api.groq.com/openai/v1';
		const model = PUBLIC_LLM_MODEL || 'llama-3.3-70b-versatile';

		try {
			const res = await fetch(`${baseUrl}/chat/completions`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${PUBLIC_LLM_API_KEY}`
				},
				body: JSON.stringify({
					model,
					messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages.slice(-10)],
					max_tokens: 512,
					temperature: 0.4
				})
			});

			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(
					(err as { error?: { message?: string } }).error?.message ?? `Error ${res.status}`
				);
			}

			const data = await res.json();
			const reply = data.choices?.[0]?.message?.content ?? 'No response.';
			messages = [...messages, { role: 'assistant', content: reply }];
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
									onclick={() => {
										input = suggestion;
										send();
									}}
									class="cursor-pointer rounded border border-edge bg-elevated px-3 py-2 text-left text-xs text-muted
										transition-colors hover:border-accent/40 hover:text-content"
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
				<div
					class="flex items-end gap-2 rounded-lg border border-edge bg-elevated px-3 py-2
						focus-within:border-accent"
				>
					<textarea
						bind:this={inputEl}
						bind:value={input}
						onkeydown={onKeydown}
						placeholder="Ask about Crux…"
						rows="1"
						disabled={loading}
						class="flex-1 resize-none border-0 bg-transparent text-xs text-content
							shadow-none placeholder:text-muted focus:ring-0 focus:outline-none disabled:opacity-50"
						style="max-height: 80px; overflow-y: auto; field-sizing: content;"
					></textarea>
					<button
						type="button"
						onclick={send}
						disabled={!input.trim() || loading}
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
				<p class="mt-1.5 text-center text-xs text-muted">Enter to send · Shift+Enter new line</p>
			</div>
		</div>
	{/if}
</div>
