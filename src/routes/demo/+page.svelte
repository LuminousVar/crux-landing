<script lang="ts">
	import { PUBLIC_FORMSPREE_URL } from '$env/static/public';
	import { ArrowLeft, Check } from 'lucide-svelte';

	let name = $state('');
	let email = $state('');
	let company = $state('');
	let role = $state('');
	let devices = $state('');
	let message = $state('');

	let submitting = $state(false);
	let submitted = $state(false);
	let submitError = $state('');

	const benefits = [
		'A guided walkthrough of automation jobs, SNMP monitoring, and AI incident analysis.',
		'Answers on RBAC, the credential vault, and OpenAI-compatible provider setup.',
		'A hosted environment to explore — nothing to install or provision.'
	];

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (submitting) return;
		submitting = true;
		submitError = '';
		try {
			const res = await fetch(PUBLIC_FORMSPREE_URL, {
				method: 'POST',
				headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
				body: JSON.stringify({
					_subject: 'Crux Cloud — demo request',
					name,
					email,
					_replyto: email,
					company,
					role,
					devices,
					message
				})
			});
			if (res.ok) {
				submitted = true;
			} else {
				submitError = 'Could not send your request. Please try again.';
			}
		} catch {
			submitError = 'Network error. Please try again.';
		} finally {
			submitting = false;
		}
	}
</script>

<svelte:head>
	<title>Request a Demo — Crux Cloud</title>
	<meta
		name="description"
		content="Request a guided demo of Crux Cloud — the fully hosted network operations platform."
	/>
</svelte:head>

<section
	id="demo-request"
	aria-labelledby="demo-request-heading"
	class="min-h-screen bg-canvas pt-28 pb-24"
>
	<div class="mx-auto grid max-w-5xl gap-12 px-6 lg:grid-cols-2 lg:gap-16">
		<!-- Left: context -->
		<div class="flex flex-col gap-6">
			<a
				href="/"
				class="inline-flex w-fit items-center gap-1.5 text-xs font-medium text-muted transition-colors hover:text-content"
			>
				<ArrowLeft size={14} />
				Back to home
			</a>

			<p class="text-xs font-medium uppercase tracking-wide text-muted">Crux Cloud</p>

			<h1 id="demo-request-heading" class="text-4xl font-bold tracking-tight text-content">
				See Crux in action
			</h1>

			<p class="max-w-md text-sm leading-relaxed text-muted">
				Tell us a little about your network and we'll set up a walkthrough of the fully managed Crux
				Cloud platform — hosted for you, with no infrastructure to maintain.
			</p>

			<ul class="mt-2 flex flex-col gap-3">
				{#each benefits as benefit (benefit)}
					<li class="flex items-start gap-3 text-sm text-muted">
						<span
							class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-edge bg-elevated text-accent"
						>
							<Check size={12} />
						</span>
						{benefit}
					</li>
				{/each}
			</ul>
		</div>

		<!-- Right: form -->
		<div class="rounded-xl border border-edge bg-surface p-6 sm:p-8">
			{#if submitted}
				<div class="flex flex-col items-center gap-4 py-10 text-center">
					<span
						class="flex h-12 w-12 items-center justify-center rounded-full border border-success/40 bg-elevated text-success"
					>
						<Check size={22} />
					</span>
					<h2 class="text-lg font-semibold text-content">Request received</h2>
					<p class="max-w-xs text-sm leading-relaxed text-muted">
						Thanks — we'll reach out at the email you provided to schedule your demo.
					</p>
					<a
						href="/"
						class="mt-2 inline-flex cursor-pointer items-center gap-1.5 text-xs font-medium text-accent transition-colors hover:text-accent-muted"
					>
						<ArrowLeft size={14} />
						Back to home
					</a>
				</div>
			{:else}
				<form class="flex flex-col gap-4" onsubmit={handleSubmit}>
					<div>
						<label
							for="name"
							class="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted"
						>
							Full name
						</label>
						<input
							id="name"
							type="text"
							bind:value={name}
							required
							autocomplete="name"
							class="w-full rounded-md border border-edge bg-elevated px-3 py-2.5 text-sm text-content placeholder:text-muted focus:border-accent focus:outline-none"
							placeholder="Jane Doe"
						/>
					</div>

					<div>
						<label
							for="email"
							class="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted"
						>
							Work email
						</label>
						<input
							id="email"
							type="email"
							bind:value={email}
							required
							autocomplete="email"
							class="w-full rounded-md border border-edge bg-elevated px-3 py-2.5 text-sm text-content placeholder:text-muted focus:border-accent focus:outline-none"
							placeholder="jane@company.com"
						/>
					</div>

					<div>
						<label
							for="company"
							class="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted"
						>
							Company
						</label>
						<input
							id="company"
							type="text"
							bind:value={company}
							required
							autocomplete="organization"
							class="w-full rounded-md border border-edge bg-elevated px-3 py-2.5 text-sm text-content placeholder:text-muted focus:border-accent focus:outline-none"
							placeholder="Acme Networks"
						/>
					</div>

					<div class="grid gap-4 sm:grid-cols-2">
						<div>
							<label
								for="role"
								class="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted"
							>
								Job role <span class="normal-case text-muted/60">(optional)</span>
							</label>
							<input
								id="role"
								type="text"
								bind:value={role}
								class="w-full rounded-md border border-edge bg-elevated px-3 py-2.5 text-sm text-content placeholder:text-muted focus:border-accent focus:outline-none"
								placeholder="Network Engineer"
							/>
						</div>

						<div>
							<label
								for="devices"
								class="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted"
							>
								Devices <span class="normal-case text-muted/60">(optional)</span>
							</label>
							<select
								id="devices"
								bind:value={devices}
								class="w-full cursor-pointer rounded-md border border-edge bg-elevated px-3 py-2.5 text-sm text-content focus:border-accent focus:outline-none"
							>
								<option value="">Select range</option>
								<option value="<50">Under 50</option>
								<option value="50-500">50 – 500</option>
								<option value="500-5000">500 – 5,000</option>
								<option value="5000+">5,000+</option>
							</select>
						</div>
					</div>

					<div>
						<label
							for="message"
							class="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted"
						>
							What would you like to see? <span class="normal-case text-muted/60">(optional)</span>
						</label>
						<textarea
							id="message"
							bind:value={message}
							rows="3"
							class="w-full resize-none rounded-md border border-edge bg-elevated px-3 py-2.5 text-sm text-content placeholder:text-muted focus:border-accent focus:outline-none"
							placeholder="e.g. automation jobs, SNMP trap analysis, RBAC…"
						></textarea>
					</div>

					<button
						type="submit"
						disabled={submitting}
						class="mt-2 inline-flex w-full cursor-pointer items-center justify-center rounded-md bg-accent px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-muted disabled:cursor-not-allowed disabled:opacity-50"
					>
						{submitting ? 'Sending…' : 'Request demo'}
					</button>

					{#if submitError}
						<p class="text-center text-xs text-danger">{submitError}</p>
					{/if}

					<p class="text-center text-xs text-muted">
						We'll only use your details to schedule and follow up on your demo.
					</p>
				</form>
			{/if}
		</div>
	</div>
</section>
