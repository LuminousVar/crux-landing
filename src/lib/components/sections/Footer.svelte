<script lang="ts">
	import GithubIcon from '$lib/components/ui/GithubIcon.svelte';

	const year = new Date().getFullYear();
</script>

<!-- Pre-footer CTA with gradient glow -->
<div class="relative overflow-hidden bg-canvas py-32 text-center">
	<!-- Radial gradient glow centered at top -->
	<div
		class="pointer-events-none absolute inset-0"
		aria-hidden="true"
		style="background: radial-gradient(ellipse 90% 65% at 50% 0%, rgba(59,130,246,0.14) 0%, rgba(59,130,246,0.04) 45%, transparent 70%);"
	></div>

	<!-- Subtle grid overlay -->
	<div
		class="pointer-events-none absolute inset-0 opacity-[0.07]"
		aria-hidden="true"
		style="background-image: linear-gradient(var(--color-edge) 1px, transparent 1px), linear-gradient(90deg, var(--color-edge) 1px, transparent 1px); background-size: 32px 32px;"
	></div>

	<div class="relative mx-auto max-w-3xl px-6">
		<p class="mb-5 font-mono text-xs uppercase tracking-widest text-muted">Open Source</p>
		<h2 class="mb-6 text-4xl font-bold tracking-tight text-content md:text-5xl lg:text-6xl">
			Take control of<br />your network.
		</h2>
		<p class="mx-auto mb-10 max-w-lg text-base leading-relaxed text-muted">
			Self-hosted. No telemetry. No cloud lock-in. Deploy Crux on your own infrastructure in
			minutes.
		</p>

		<div class="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
			<a
				href="https://github.com/LuminousVar/crux-landing"
				target="_blank"
				rel="noopener noreferrer"
				class="cta-primary"
			>
				Get Started
				<span class="cta-arrow" aria-hidden="true">
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
			<a href="/#features" class="cta-secondary">View Features</a>
		</div>
	</div>
</div>

<!-- Footer -->
<footer class="relative overflow-hidden border-t border-edge bg-canvas">
	<!-- Bottom-corner accent glow -->
	<div
		class="pointer-events-none absolute bottom-0 left-0 h-full w-1/2"
		aria-hidden="true"
		style="background: radial-gradient(ellipse at bottom left, rgba(59,130,246,0.12) 0%, transparent 70%);"
	></div>
	<div
		class="pointer-events-none absolute bottom-0 right-0 h-full w-1/2"
		aria-hidden="true"
		style="background: radial-gradient(ellipse at bottom right, rgba(59,130,246,0.12) 0%, transparent 70%);"
	></div>

	<div class="relative mx-auto max-w-6xl px-6 py-16">
		<div class="grid gap-12 sm:grid-cols-2 lg:grid-cols-5">
			<!-- Brand column — takes 2 cols on lg -->
			<div class="lg:col-span-2">
				<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
				<a href="/" aria-label="Crux home" class="flex items-center gap-2">
					<img src="/crux-mark.png" alt="" class="h-7 w-auto" aria-hidden="true" />
					<span class="text-lg font-semibold leading-none tracking-tight text-accent">Crux</span>
				</a>

				<p class="mt-4 max-w-xs text-sm leading-relaxed text-muted">
					Open-source network operations platform. On-premise or cloud — your infrastructure, your
					call.
				</p>

				<p class="mt-6 text-sm text-muted">
					© {year} Crux. Built as an academic project.
				</p>

				<!-- Social icons -->
				<div class="mt-6 flex items-center gap-3">
					<a
						href="https://github.com/LuminousVar/crux-landing"
						target="_blank"
						rel="noopener noreferrer"
						class="social-icon"
						aria-label="GitHub"
					>
						<GithubIcon size={17} />
					</a>
					<a href="mailto:luminousv@disroot.org" class="social-icon" aria-label="Email">
						<svg
							width="17"
							height="17"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<rect width="20" height="16" x="2" y="4" rx="2" />
							<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
						</svg>
					</a>
				</div>
			</div>

			<!-- Product -->
			<div>
				<p class="mb-6 text-sm font-semibold text-content">Product</p>
				<ul class="flex flex-col gap-4">
					<li>
						<a href="/#features" class="text-sm text-muted transition-colors hover:text-content"
							>Features</a
						>
					</li>
					<li>
						<a href="/#use-cases" class="text-sm text-muted transition-colors hover:text-content"
							>Use Cases</a
						>
					</li>
					<li>
						<a href="/#faq" class="text-sm text-muted transition-colors hover:text-content">FAQ</a>
					</li>
				</ul>
			</div>

			<!-- Resources -->
			<div>
				<p class="mb-6 text-sm font-semibold text-content">Resources</p>
				<ul class="flex flex-col gap-4">
					<li>
						<a href="/docs" class="text-sm text-muted transition-colors hover:text-content"
							>Documentation</a
						>
					</li>
					<li>
						<a
							href="https://github.com/LuminousVar/crux-landing"
							target="_blank"
							rel="noopener noreferrer"
							class="text-sm text-muted transition-colors hover:text-content"
						>
							GitHub
						</a>
					</li>
				</ul>
			</div>

			<!-- Legal -->
			<div>
				<p class="mb-6 text-sm font-semibold text-content">Legal</p>
				<ul class="flex flex-col gap-4">
					<li><span class="text-sm text-muted">MIT License</span></li>
				</ul>
			</div>
		</div>
	</div>
</footer>

<style>
	/* ── Pre-footer CTA buttons ───────────────────────────────── */
	.cta-primary {
		display: inline-flex;
		align-items: center;
		padding: 14px 28px;
		border-radius: 10px;
		border: 1px solid var(--glass-border-strong);
		background: var(--glass-fill);
		color: var(--glass-fg-strong);
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

	.cta-primary:hover {
		background: var(--glass-fill-hover);
		border-color: var(--glass-border-hover);
		padding-right: 18px;
	}

	.cta-arrow {
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

	.cta-primary:hover .cta-arrow {
		width: 16px;
		margin-left: 8px;
		opacity: 1;
	}

	.cta-secondary {
		display: inline-flex;
		align-items: center;
		padding: 14px 28px;
		border-radius: 10px;
		border: 1px solid var(--glass-border);
		background: transparent;
		color: var(--glass-fg);
		font-size: 1rem;
		font-weight: 500;
		text-decoration: none;
		white-space: nowrap;
		transition:
			border-color 0.2s,
			color 0.2s;
	}

	.cta-secondary:hover {
		border-color: var(--glass-border-hover);
		color: var(--glass-fg-strong);
	}

	/* ── Social icon circles ──────────────────────────────────── */
	.social-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: var(--glass-fill-subtle);
		color: var(--glass-fg);
		transition:
			background 0.2s,
			color 0.2s;
	}

	.social-icon:hover {
		background: var(--glass-fill);
		color: var(--glass-fg-strong);
	}
</style>
