<script lang="ts">
	import FeatureRow from '$lib/components/ui/FeatureRow.svelte';

	const features = [
		{
			number: '01',
			tag: 'MONITOR',
			title: 'Real-Time SNMP Monitoring',
			description:
				'Poll device metrics on a configurable interval. Receive SNMP traps for interface-down events and route them straight into the AI incident analyzer.',
			mock: {
				label: 'SNMP Monitor',
				lines: [
					{ text: 'Interface Gi0/1  UP   2ms   in: 1.2Gbps  out: 980Mbps', color: 'text-success' },
					{ text: 'Interface Gi0/2  UP   3ms   in: 640Mbps   out: 512Mbps', color: 'text-success' },
					{ text: 'Interface Gi0/3  DOWN       TRAP → AI analyzer queued', color: 'text-warning' },
					{ text: 'Trap #4821 received from 10.0.1.7 — ifOperStatus change', color: 'text-muted' }
				]
			}
		},
		{
			number: '02',
			tag: 'AUTOMATE',
			title: 'Scheduled Automation Jobs',
			description:
				'Define backup, health check, and config-push jobs with cron schedules. Require human approval for critical operations — or whitelist trusted job types for autonomous execution.',
			mock: {
				label: 'Job Scheduler',
				lines: [
					{ text: '● backup-all        0 2 * * *   APPROVED    last: 02:00 OK', color: 'text-content' },
					{ text: '● health-check       */15 * * * * AUTONOMOUS  next: 00:04', color: 'text-content' },
					{ text: '⏸ config-push        manual       PENDING APPROVAL', color: 'text-warning' },
					{ text: '● firmware-update    0 6 * * 0   APPROVED    scheduled', color: 'text-content' }
				]
			}
		},
		{
			number: '03',
			tag: 'ANALYZE',
			title: 'AI Incident Analysis',
			description:
				'Every SNMP trap is passed to an OpenAI-compatible LLM for root-cause assessment. Swap providers (Groq, DeepSeek, Gemini) by changing three env vars — no code changes.',
			mock: {
				label: 'AI Analyzer',
				lines: [
					{ text: 'Trap: ifOperStatus DOWN on core-sw-01 Gi0/3', color: 'text-muted' },
					{ text: 'Provider: groq/llama-3.3-70b', color: 'text-muted' },
					{ text: '─────────────────────────────────────────', color: 'text-edge' },
					{ text: 'Root cause: STP topology change. Gi0/3 lost', color: 'text-content' },
					{ text: 'BPDUs. Recommend: check upstream switch port', color: 'text-content' },
					{ text: 'state and spanning-tree logs.', color: 'text-content' }
				]
			}
		},
		{
			number: '04',
			tag: 'SECURE',
			title: 'AES-256 Credential Vault',
			description:
				'Device passwords, SSH keys, and API tokens are encrypted at rest with Fernet (AES-256). Secrets are never returned by the API — only decrypted inside the execution layer.',
			mock: {
				label: 'Credential Vault',
				lines: [
					{ text: 'device: core-sw-01    ssh_key: [ENCRYPTED]', color: 'text-content' },
					{ text: 'device: edge-rtr-02   password: [ENCRYPTED]', color: 'text-content' },
					{ text: 'api_token: openai     value: [ENCRYPTED]', color: 'text-content' },
					{ text: '─────────────────────────────────────────', color: 'text-edge' },
					{ text: 'Cipher: Fernet (AES-256-CBC + HMAC-SHA256)', color: 'text-muted' },
					{ text: 'Secrets never exposed via API layer', color: 'text-success' }
				]
			}
		},
		{
			number: '05',
			tag: 'ACCESS',
			title: 'Role-Based Access Control',
			description:
				'Admin, Operator, and Viewer roles with a policy-based IAM engine. Every sensitive operation is recorded in an immutable audit log.',
			mock: {
				label: 'IAM & Audit Log',
				lines: [
					{ text: 'user: alice   role: Admin     all permissions', color: 'text-content' },
					{ text: 'user: bob     role: Operator  jobs, devices', color: 'text-content' },
					{ text: 'user: carol   role: Viewer    read-only', color: 'text-content' },
					{ text: '─────────────────────────────────────────', color: 'text-edge' },
					{ text: '[AUDIT] bob executed backup-all at 02:00:03', color: 'text-muted' },
					{ text: '[AUDIT] alice updated device credentials', color: 'text-muted' }
				]
			}
		},
		{
			number: '06',
			tag: 'STORE',
			title: 'Firmware Repository',
			description:
				'Upload, version, and distribute firmware images. Every file is verified with a SHA-256 checksum at upload and available for on-demand download.',
			mock: {
				label: 'Firmware Store',
				lines: [
					{ text: 'ios-xe-17.12.1.bin    SHA256: a3f9...c12e  ✓', color: 'text-content' },
					{ text: 'ios-xe-17.09.4a.bin   SHA256: b72d...f8a1  ✓', color: 'text-content' },
					{ text: 'junos-23.4R1.bin       SHA256: e41c...9b3f  ✓', color: 'text-content' },
					{ text: '─────────────────────────────────────────', color: 'text-edge' },
					{ text: '3 images · 2.4 GB total · verified', color: 'text-success' }
				]
			}
		}
	];
</script>

<section id="features" class="mx-auto max-w-6xl px-6 py-24" aria-labelledby="features-heading">
	<p class="mb-3 font-mono text-xs uppercase tracking-widest text-muted">02 // FEATURES</p>
	<h2 id="features-heading" class="mb-4 text-3xl font-bold text-content md:text-4xl">
		Everything your network ops team needs
	</h2>
	<p class="mb-0 max-w-2xl text-muted">
		Six tightly integrated modules — monitoring, automation, AI analysis, security, access control,
		and firmware management — deployed on your infrastructure.
	</p>

	<div class="divide-y divide-edge">
		{#each features as feature, i}
			<FeatureRow
				number={feature.number}
				tag={feature.tag}
				title={feature.title}
				description={feature.description}
				imageSide={i % 2 === 0 ? 'right' : 'left'}
			>
				{#snippet visual()}
					<div
						class="overflow-hidden rounded-lg border border-edge bg-surface"
						role="img"
						aria-label="{feature.title} interface mock"
					>
						<div class="flex items-center gap-2 border-b border-edge bg-elevated px-4 py-2.5">
							<span class="font-mono text-xs text-muted">{feature.mock.label}</span>
						</div>
						<div class="p-5 font-mono text-xs leading-6">
							{#each feature.mock.lines as line}
								<p class={line.color}>{line.text}</p>
							{/each}
						</div>
					</div>
				{/snippet}
			</FeatureRow>
		{/each}
	</div>
</section>
