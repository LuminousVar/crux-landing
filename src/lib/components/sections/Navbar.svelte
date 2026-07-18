<script lang="ts">
	import GithubIcon from '$lib/components/ui/GithubIcon.svelte';
	import { theme, toggleTheme } from '$lib/theme.svelte';
	import { slide } from 'svelte/transition';

	const REPO = 'https://github.com/LuminousVar/crux';

	type NavItem = { label: string; href: string; external?: boolean };
	type NavMenu = { label: string; items: NavItem[] };
	type NavLink = { label: string; href: string };
	type NavEntry = NavMenu | NavLink;

	// A "menu" with `items` renders as a dropdown; one with just `href` is a plain link.
	const isMenu = (e: NavEntry): e is NavMenu => 'items' in e;

	const menus: NavEntry[] = [
		{
			label: 'Product',
			items: [
				{ label: 'Self-host Crux', href: '/self-host' },
				{ label: 'Crux Cloud', href: '/cloud' },
				{ label: 'Get a Demo', href: '/demo' }
			]
		},
		{ label: 'Pricing', href: '/pricing' },
		{
			label: 'Resources',
			items: [
				{ label: 'Documentation', href: '/docs' },
				{ label: 'Installation', href: '/docs/installation' },
				{ label: 'Configuration', href: '/docs/configuration' },
				{ label: 'API Reference', href: '/api' },
				{ label: 'FAQ', href: '/#faq' },
				{ label: 'Glossary', href: '/docs/glossary' }
			]
		},
		{
			label: 'Open Source',
			items: [
				{ label: 'GitHub', href: REPO, external: true },
				{ label: 'Report an Issue', href: `${REPO}/issues`, external: true },
				{ label: 'Contributing', href: `${REPO}#contributing`, external: true },
				{ label: 'MIT License', href: `${REPO}/blob/main/LICENSE`, external: true }
			]
		}
	];

	let scrolled = $state(false);
	let mobileOpen = $state(false);
	let openMenu = $state<string | null>(null); // desktop hover/focus dropdown
	let mobileSubmenu = $state<string | null>(null); // mobile accordion

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
		mobileSubmenu = null;
	}

	function toggleDesktop(label: string) {
		openMenu = openMenu === label ? null : label;
	}

	function toggleMobileSub(label: string) {
		mobileSubmenu = mobileSubmenu === label ? null : label;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') openMenu = null;
	}
</script>

{#snippet themeToggle(size: number)}
	<button
		type="button"
		class="theme-toggle"
		onclick={toggleTheme}
		aria-label={theme.value === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
		title={theme.value === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
	>
		{#if theme.value === 'dark'}
			<!-- Sun — click to go light -->
			<svg
				width={size}
				height={size}
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<circle cx="12" cy="12" r="4" />
				<path
					d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
				/>
			</svg>
		{:else}
			<!-- Moon — click to go dark -->
			<svg
				width={size}
				height={size}
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
			</svg>
		{/if}
	</button>
{/snippet}

{#snippet chevron()}
	<svg
		class="nav-chevron"
		width="12"
		height="12"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2.5"
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
	>
		<path d="m6 9 6 6 6-6" />
	</svg>
{/snippet}

<svelte:window onkeydown={handleKeydown} />

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
			<img src="/crux-mark.png" alt="" class="h-12 w-auto" aria-hidden="true" />
			<span class="text-2xl font-semibold leading-none tracking-tight text-accent">Crux</span>
		</a>

		<!-- Desktop nav — center dropdown menus -->
		<!-- eslint-disable svelte/no-navigation-without-resolve -->
		<ul class="hidden items-center gap-1 justify-self-center lg:flex">
			{#each menus as menu (menu.label)}
				{#if isMenu(menu)}
					<li
						class="nav-menu relative"
						onmouseenter={() => (openMenu = menu.label)}
						onmouseleave={() => {
							if (openMenu === menu.label) openMenu = null;
						}}
						onfocusout={(e) => {
							if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node | null))
								openMenu = null;
						}}
					>
						<button
							type="button"
							class="nav-trigger"
							aria-haspopup="true"
							aria-expanded={openMenu === menu.label}
							onclick={() => toggleDesktop(menu.label)}
						>
							{menu.label}
							{@render chevron()}
						</button>

						<div class="dropdown-panel {openMenu === menu.label ? 'is-open' : ''}">
							<ul class="dropdown-card">
								{#each menu.items as item (item.label)}
									<li>
										<a
											href={item.href}
											class="dropdown-link"
											target={item.external ? '_blank' : undefined}
											rel={item.external ? 'noopener noreferrer' : undefined}
											onclick={() => (openMenu = null)}
										>
											{item.label}
										</a>
									</li>
								{/each}
							</ul>
						</div>
					</li>
				{:else}
					<li>
						<a href={menu.href} class="nav-link" onclick={() => (openMenu = null)}>{menu.label}</a>
					</li>
				{/if}
			{/each}
		</ul>
		<!-- eslint-enable svelte/no-navigation-without-resolve -->

		<!-- Desktop right: theme + GitHub + CTA — right (justify-end keeps it right-aligned) -->
		<div class="hidden items-center justify-end gap-4 lg:flex">
			{@render themeToggle(20)}
			<a
				href="https://github.com/LuminousVar/crux-landing"
				target="_blank"
				rel="noopener noreferrer"
				class="text-muted transition-colors hover:text-content"
				aria-label="GitHub"
			>
				<GithubIcon size={20} />
			</a>
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
			<a href="/demo" class="moonshot-cta">
				Get a Demo
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

		<!-- Mobile: theme + GitHub + hamburger -->
		<div class="flex items-center justify-end gap-3 lg:hidden">
			{@render themeToggle(18)}
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

	<!-- Mobile accordion menu -->
	{#if mobileOpen}
		<!-- eslint-disable svelte/no-navigation-without-resolve -->
		<div class="border-t border-edge bg-surface lg:hidden">
			<div class="mx-auto max-w-6xl px-6 pb-5 pt-1">
				{#each menus as menu (menu.label)}
					<div class="border-b border-edge">
						{#if isMenu(menu)}
							<button
								type="button"
								class="mobile-trigger"
								aria-expanded={mobileSubmenu === menu.label}
								onclick={() => toggleMobileSub(menu.label)}
							>
								{menu.label}
								{@render chevron()}
							</button>
							{#if mobileSubmenu === menu.label}
								<ul class="mobile-sublist" transition:slide={{ duration: 180 }}>
									{#each menu.items as item (item.label)}
										<li>
											<a
												href={item.href}
												class="mobile-sublink"
												target={item.external ? '_blank' : undefined}
												rel={item.external ? 'noopener noreferrer' : undefined}
												onclick={closeMenu}
											>
												{item.label}
											</a>
										</li>
									{/each}
								</ul>
							{/if}
						{:else}
							<a href={menu.href} class="mobile-trigger" onclick={closeMenu}>{menu.label}</a>
						{/if}
					</div>
				{/each}

				<a href="/demo" onclick={closeMenu} class="moonshot-cta mt-5 w-full justify-center">
					Get a Demo
				</a>
			</div>
		</div>
		<!-- eslint-enable svelte/no-navigation-without-resolve -->
	{/if}
</header>

<style>
	.moonshot-cta {
		display: inline-flex;
		align-items: center;
		padding: 9px 18px;
		border-radius: 10px;
		border: 1px solid var(--glass-border);
		background: transparent;
		color: var(--glass-fg);
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
		border-color: var(--glass-border-hover);
		background: var(--glass-fill-subtle);
		color: var(--glass-fg-strong);
	}

	.theme-toggle {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		border-radius: 999px;
		border: 1px solid transparent;
		background: transparent;
		color: var(--color-muted);
		cursor: pointer;
		transition:
			background 0.15s,
			color 0.15s,
			border-color 0.15s;
	}

	.theme-toggle:hover {
		color: var(--color-content);
		background: var(--color-elevated);
		border-color: var(--color-edge);
	}

	/* Arrow clip — expands from 0 to 14px on hover */
	.moonshot-arrow {
		display: inline-flex;
		align-items: center;
		width: 0;
		overflow: hidden;
		flex-shrink: 0;
		transition:
			width 0.25s ease,
			margin-left 0.25s ease;
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
		transition:
			transform 0.25s ease,
			opacity 0.2s ease;
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

	/* ── Desktop dropdown menus ───────────────────────────────── */
	.nav-trigger {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		padding: 7px 12px;
		border-radius: 8px;
		border: none;
		background: transparent;
		color: var(--color-muted);
		font-family: inherit;
		font-size: 0.875rem;
		cursor: pointer;
		transition: color 0.15s;
	}

	.nav-menu:hover .nav-trigger,
	.nav-trigger[aria-expanded='true'] {
		color: var(--color-content);
	}

	/* Plain top-level link (e.g. Pricing) — matches nav-trigger sizing, no chevron */
	.nav-link {
		display: inline-flex;
		align-items: center;
		padding: 7px 12px;
		border-radius: 8px;
		color: var(--color-muted);
		font-size: 0.875rem;
		text-decoration: none;
		transition: color 0.15s;
	}

	.nav-link:hover {
		color: var(--color-content);
	}

	.nav-chevron {
		transition: transform 0.2s ease;
	}

	.nav-trigger[aria-expanded='true'] .nav-chevron {
		transform: rotate(180deg);
	}

	.dropdown-panel {
		position: absolute;
		top: 100%;
		left: 0;
		padding-top: 10px; /* transparent hover bridge to the trigger */
		min-width: 220px;
		opacity: 0;
		visibility: hidden;
		transform: translateY(6px);
		transition:
			opacity 0.15s ease,
			transform 0.15s ease,
			visibility 0.15s;
	}

	.dropdown-panel.is-open {
		opacity: 1;
		visibility: visible;
		transform: translateY(0);
	}

	.dropdown-card {
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding: 8px;
		border-radius: 12px;
		border: 1px solid var(--color-edge);
		background: var(--color-elevated);
	}

	.dropdown-link {
		display: block;
		padding: 8px 12px;
		border-radius: 8px;
		font-size: 0.875rem;
		color: var(--color-muted);
		text-decoration: none;
		white-space: nowrap;
		transition:
			background 0.12s,
			color 0.12s;
	}

	.dropdown-link:hover {
		background: color-mix(in oklab, var(--color-accent) 12%, transparent);
		color: var(--color-content);
	}

	/* ── Mobile accordion ─────────────────────────────────────── */
	.mobile-trigger {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: 14px 2px;
		border: none;
		background: transparent;
		color: var(--color-content);
		font-family: inherit;
		font-size: 0.9375rem;
		font-weight: 500;
		cursor: pointer;
	}

	.mobile-trigger[aria-expanded='true'] .nav-chevron {
		transform: rotate(180deg);
	}

	.mobile-sublist {
		padding: 0 0 10px 12px;
	}

	.mobile-sublink {
		display: block;
		padding: 9px 12px;
		border-radius: 8px;
		font-size: 0.875rem;
		color: var(--color-muted);
		text-decoration: none;
		transition:
			background 0.12s,
			color 0.12s;
	}

	.mobile-sublink:hover {
		background: color-mix(in oklab, var(--color-accent) 12%, transparent);
		color: var(--color-content);
	}
</style>
