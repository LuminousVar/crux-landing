<script lang="ts">
	import GithubIcon from '$lib/components/ui/GithubIcon.svelte';
</script>

<footer class="border-t border-edge bg-surface">
	<div class="mx-auto max-w-6xl px-6 py-16">
		<div class="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
			<div class="lg:col-span-1">
				<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
				<a href="/" aria-label="Crux home" class="flex items-center gap-2">
					<img src="/crux-logo-nobg.svg" alt="" class="h-7 w-auto" aria-hidden="true" />
					<span class="font-mono text-lg font-bold text-accent">crux</span>
				</a>
				<p class="mt-3 text-sm leading-relaxed text-muted">
					Open-source network operations platform. Self-hosted, no telemetry.
				</p>
				<a
					href="https://github.com"
					target="_blank"
					rel="noopener noreferrer"
					class="mt-4 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-content"
				>
					<GithubIcon size={16} />
					GitHub
				</a>
			</div>

			<div>
				<p class="mb-4 font-mono text-xs uppercase tracking-widest text-muted">Product</p>
				<ul class="flex flex-col gap-3">
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
						<a href="#tech" class="text-sm text-muted transition-colors hover:text-content"
							>Tech Stack</a
						>
					</li>
					<li>
						<a href="#faq" class="text-sm text-muted transition-colors hover:text-content">FAQ</a>
					</li>
				</ul>
			</div>

			<div>
				<p class="mb-4 font-mono text-xs uppercase tracking-widest text-muted">Connect</p>
				<ul class="flex flex-col gap-3">
					<li>
						<a
							href="https://github.com"
							target="_blank"
							rel="noopener noreferrer"
							class="text-sm text-muted transition-colors hover:text-content"
						>
							GitHub
						</a>
					</li>
				</ul>
			</div>

			<div>
				<p class="mb-4 font-mono text-xs uppercase tracking-widest text-muted">Legal</p>
				<ul class="flex flex-col gap-3">
					<li><span class="text-sm text-muted">MIT License</span></li>
				</ul>
			</div>
		</div>

		<div class="mt-12 border-t border-edge pt-8">
			<p class="text-sm text-muted">© 2025 Crux. Built as an academic project.</p>
		</div>
	</div>
</footer>
