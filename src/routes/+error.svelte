<script lang="ts">
	import { page } from '$app/state';

	const REPO = 'https://github.com/LuminousVar/crux';

	// A friendly title per status class; fall back to the raw message for anything else.
	let status = $derived(page.status);
	let info = $derived(
		status === 404
			? {
					title: 'Page not found',
					body: "The page you're looking for doesn't exist, moved, or never did. Check the address, or head back to familiar ground."
				}
			: status === 403
				? {
						title: 'Access denied',
						body: "You don't have permission to view this page."
					}
				: status >= 500
					? {
							title: 'Something went wrong',
							body: 'An unexpected error occurred on our end. Try again in a moment — if it keeps happening, let us know.'
						}
					: {
							title: 'Something went wrong',
							body: page.error?.message ?? 'An unexpected error occurred.'
						}
	);
</script>

<svelte:head>
	<title>{status} — {info.title} · Crux</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main class="flex min-h-screen flex-col items-center justify-center bg-canvas px-6 pt-[4.25rem]">
	<div class="w-full max-w-lg text-center">
		<!-- Status code -->
		<p class="status-code font-mono font-bold tracking-tight text-accent">{status}</p>

		<h1 class="mt-2 text-3xl font-bold tracking-tight text-content md:text-4xl">{info.title}</h1>
		<p class="mx-auto mt-4 max-w-md text-base leading-relaxed text-muted">{info.body}</p>

		{#if page.error?.message && status < 500 && status !== 404 && status !== 403}
			<p class="mt-4 font-mono text-xs text-muted/50">{page.error.message}</p>
		{/if}

		<!-- Actions -->
		<div class="mt-8 flex flex-wrap items-center justify-center gap-3">
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
			<a href="/" class="btn-primary">
				Back to home
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.5"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
				</svg>
			</a>
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
			<a href="/docs" class="btn-ghost">Documentation</a>
			{#if status >= 500}
				<a href="{REPO}/issues" target="_blank" rel="noopener noreferrer" class="btn-ghost">
					Report this
				</a>
			{/if}
		</div>
	</div>
</main>

<style>
	.status-code {
		font-size: clamp(4.5rem, 18vw, 8rem);
		line-height: 1;
		opacity: 0.9;
	}

	.btn-primary {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 12px 20px;
		border-radius: 10px;
		border: 1px solid var(--color-accent);
		background: var(--color-accent);
		color: #fff;
		font-size: 0.9375rem;
		font-weight: 500;
		text-decoration: none;
		transition:
			background 0.15s,
			border-color 0.15s;
	}

	.btn-primary:hover {
		background: var(--color-accent-muted);
		border-color: var(--color-accent-muted);
	}

	.btn-ghost {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 12px 20px;
		border-radius: 10px;
		border: 1px solid var(--color-edge);
		background: transparent;
		color: var(--color-content);
		font-size: 0.9375rem;
		font-weight: 500;
		text-decoration: none;
		transition:
			background 0.15s,
			border-color 0.15s;
	}

	.btn-ghost:hover {
		background: var(--color-elevated);
		border-color: var(--color-muted);
	}
</style>
