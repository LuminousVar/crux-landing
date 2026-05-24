<script lang="ts">
	import GithubIcon from '$lib/components/ui/GithubIcon.svelte';
	let scrolled = $state(false);

	$effect(() => {
		const handler = () => {
			scrolled = window.scrollY > 60;
		};
		window.addEventListener('scroll', handler, { passive: true });
		return () => window.removeEventListener('scroll', handler);
	});
</script>

<header
	class="fixed top-0 z-50 w-full border-b backdrop-blur-md transition-colors duration-300"
	style="background-color: {scrolled
		? 'var(--color-surface)'
		: 'transparent'}; border-color: {scrolled ? 'var(--color-edge)' : 'transparent'};"
>
	<nav
		class="mx-auto flex max-w-6xl items-center justify-between px-6 py-2.5"
		aria-label="Main navigation"
	>
		<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
		<a href="/" aria-label="Crux home" class="flex items-center gap-2">
			<img src="/crux-logo-nobg.svg" alt="" class="h-12 w-auto" aria-hidden="true" />
			<span class="font-mono text-xl font-bold leading-none text-accent">Crux</span>
		</a>

		<ul class="hidden items-center gap-8 md:flex">
			<li>
				<a href="#features" class="text-sm text-muted transition-colors hover:text-content"
					>Features</a
				>
			</li>
			<li>
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

		<div class="flex items-center gap-4">
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
	</nav>
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
		overflow: hidden;
		transition:
			border-color 0.2s,
			background 0.2s,
			color 0.2s,
			padding-right 0.2s;
	}

	.moonshot-cta:hover {
		border-color: rgba(255, 255, 255, 0.75);
		background: rgba(255, 255, 255, 0.06);
		color: #fff;
		padding-right: 12px;
	}

	.moonshot-arrow {
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

	.moonshot-cta:hover .moonshot-arrow {
		width: 14px;
		margin-left: 6px;
		opacity: 1;
	}
</style>
