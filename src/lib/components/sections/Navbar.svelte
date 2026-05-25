<script lang="ts">
	import GithubIcon from '$lib/components/ui/GithubIcon.svelte';

	let scrolled = $state(false);
	let mobileOpen = $state(false);

	$effect(() => {
		const handler = () => {
			scrolled = window.scrollY > 60;
		};
		window.addEventListener('scroll', handler, { passive: true });
		return () => window.removeEventListener('scroll', handler);
	});

	$effect(() => {
		document.body.style.overflow = mobileOpen ? 'hidden' : '';
		return () => {
			document.body.style.overflow = '';
		};
	});

	function closeMenu() {
		mobileOpen = false;
	}
</script>

<header
	class="fixed top-0 z-50 w-full border-b backdrop-blur-md transition-colors duration-300"
	style="background-color: {scrolled || mobileOpen
		? 'var(--color-surface)'
		: 'transparent'}; border-color: {scrolled || mobileOpen ? 'var(--color-edge)' : 'transparent'};"
>
	<nav
		class="mx-auto grid max-w-6xl grid-cols-[1fr_auto] items-center px-6 py-2.5 lg:grid-cols-[1fr_auto_1fr]"
		aria-label="Main navigation"
	>
		<!-- Logo — left -->
		<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
		<a href="/" aria-label="Crux home" class="flex items-center gap-2">
			<img src="/crux-logo-nobg.svg" alt="" class="h-12 w-auto" aria-hidden="true" />
			<span class="font-mono text-xl font-bold leading-none text-accent">Crux</span>
		</a>

		<!-- Desktop nav links — center -->
		<ul class="hidden items-center gap-8 lg:flex">
			<li>
				<a href="#features" class="text-sm text-muted transition-colors hover:text-content"
					>Features</a
				>
			</li>
			<li>
				<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
				<a href="/docs" class="text-sm text-muted transition-colors hover:text-content">Docs</a>
			</li>
			<li>
				<a href="#use-cases" class="text-sm text-muted transition-colors hover:text-content"
					>Use Cases</a
				>
			</li>
			<li>
				<a href="#faq" class="text-sm text-muted transition-colors hover:text-content">FAQ</a>
			</li>
		</ul>

		<!-- Desktop right: GitHub + CTA — right (justify-end keeps it right-aligned) -->
		<div class="hidden items-center justify-end gap-4 lg:flex">
			<a
				href="https://github.com/LuminousVar/crux-landing"
				target="_blank"
				rel="noopener noreferrer"
				class="text-muted transition-colors hover:text-content"
				aria-label="GitHub"
			>
				<GithubIcon size={20} />
			</a>
			<a href="mailto:farelreyhan6@gmail.com" class="moonshot-cta">
				Contact Us
				<span class="moonshot-arrow" aria-hidden="true">
					<svg
						width="14"
						height="14"
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

		<!-- Mobile: GitHub + hamburger -->
		<div class="flex items-center justify-end gap-3 lg:hidden">
			<a
				href="https://github.com/LuminousVar/crux-landing"
				target="_blank"
				rel="noopener noreferrer"
				class="text-muted transition-colors hover:text-content"
				aria-label="GitHub"
			>
				<GithubIcon size={18} />
			</a>
			<button
				class="hamburger"
				onclick={() => (mobileOpen = !mobileOpen)}
				aria-expanded={mobileOpen}
				aria-label="Toggle navigation menu"
			>
				{#if mobileOpen}
					<svg
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M18 6 6 18" /><path d="m6 6 12 12" />
					</svg>
				{:else}
					<svg
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="12" y2="12" /><line
							x1="4"
							x2="20"
							y1="18"
							y2="18"
						/>
					</svg>
				{/if}
			</button>
		</div>
	</nav>

	<!-- Mobile dropdown menu -->
	{#if mobileOpen}
		<div class="border-t border-edge bg-surface lg:hidden">
			<ul class="mx-auto max-w-6xl px-6 pb-4 pt-1">
				<li>
					<a
						href="#features"
						onclick={closeMenu}
						class="block border-b border-edge py-3.5 text-sm text-muted transition-colors hover:text-content"
					>
						Features
					</a>
				</li>
				<li>
					<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
					<a
						href="/docs"
						onclick={closeMenu}
						class="block border-b border-edge py-3.5 text-sm text-muted transition-colors hover:text-content"
					>
						Docs
					</a>
				</li>
				<li>
					<a
						href="#use-cases"
						onclick={closeMenu}
						class="block border-b border-edge py-3.5 text-sm text-muted transition-colors hover:text-content"
					>
						Use Cases
					</a>
				</li>
				<li>
					<a
						href="#faq"
						onclick={closeMenu}
						class="block border-b border-edge py-3.5 text-sm text-muted transition-colors hover:text-content"
					>
						FAQ
					</a>
				</li>
				<li class="pt-4">
					<a
						href="mailto:farelreyhan6@gmail.com"
						onclick={closeMenu}
						class="moonshot-cta w-full justify-center"
					>
						Contact Us
					</a>
				</li>
			</ul>
		</div>
	{/if}
</header>

<style>
	.moonshot-cta {
		display: inline-flex;
		align-items: center;
		padding: 9px 18px;
		border-radius: 999px;
		border: 1px solid rgba(255, 255, 255, 0.35);
		background: transparent;
		color: rgba(255, 255, 255, 0.55);
		font-size: 0.875rem;
		font-weight: 500;
		text-decoration: none;
		white-space: nowrap;
		transition:
			border-color 0.2s,
			background 0.2s,
			color 0.2s;
	}

	.moonshot-cta:hover {
		border-color: rgba(255, 255, 255, 0.75);
		background: rgba(255, 255, 255, 0.06);
		color: #fff;
	}

	/* Arrow clip — expands from 0 to 14px on hover */
	.moonshot-arrow {
		display: inline-flex;
		align-items: center;
		width: 0;
		overflow: hidden;
		flex-shrink: 0;
		transition: width 0.25s ease, margin-left 0.25s ease;
	}

	.moonshot-cta:hover .moonshot-arrow {
		width: 14px;
		margin-left: 6px;
	}

	/* SVG slides in from the left inside the clip */
	.moonshot-arrow svg {
		flex-shrink: 0;
		transform: translateX(-10px);
		opacity: 0;
		transition: transform 0.25s ease, opacity 0.2s ease;
	}

	.moonshot-cta:hover .moonshot-arrow svg {
		transform: translateX(0);
		opacity: 1;
	}

	.hamburger {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		border-radius: 6px;
		border: 1px solid var(--color-edge);
		background: transparent;
		color: var(--color-muted);
		cursor: pointer;
		transition:
			background 0.15s,
			color 0.15s;
	}

	.hamburger:hover {
		background: var(--color-elevated);
		color: var(--color-content);
	}
</style>
