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
	class="fixed top-0 z-50 w-full transition-all duration-300"
	class:bg-transparent={!scrolled}
	class:bg-surface={scrolled}
	class:border-b={scrolled}
	class:border-edge={scrolled}
	class:backdrop-blur-md={scrolled}
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
				<a href="#use-cases" class="text-sm text-muted transition-colors hover:text-content"
					>Use Cases</a
				>
			</li>
			<li>
				<a href="#tech" class="text-sm text-muted transition-colors hover:text-content">Tech</a>
			</li>
			<li>
				<a href="#faq" class="text-sm text-muted transition-colors hover:text-content">FAQ</a>
			</li>
		</ul>

		<div class="flex items-center gap-4">
			<a
				href="https://github.com"
				target="_blank"
				rel="noopener noreferrer"
				class="text-muted transition-colors hover:text-content"
				aria-label="GitHub"
			>
				<GithubIcon size={20} />
			</a>
			<a
				href="#features"
				class="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-muted"
			>
				Get Started →
			</a>
		</div>
	</nav>
</header>
