<script lang="ts">
	// lucide-svelte v1.0.1 ships Svelte 4 class types, not compatible with Svelte 5 Component
	/* eslint-disable @typescript-eslint/no-explicit-any */
	import {
		Activity,
		Archive,
		Bot,
		BrainCircuit,
		Code2,
		FileText,
		Layers,
		MapPin,
		Network,
		Plug,
		Server,
		Settings2,
		ShieldCheck,
		Users,
		Zap
	} from 'lucide-svelte';

	const devices = [
		{ name: 'core-sw-01', vendor: 'Cisco', dotClass: 'bg-success' },
		{ name: 'dist-rt-02', vendor: 'Juniper', dotClass: 'bg-warning' },
		{ name: 'access-sw-04', vendor: 'Cisco', dotClass: 'bg-success' }
	];

	const groups: { label: string; icon: any; features: { label: string; tag: string }[] }[] = [
		{
			label: 'Resources',
			icon: Layers,
			features: [
				{ label: 'Devices', tag: '/devices' },
				{ label: 'Inventory', tag: '/inventory' },
				{ label: 'Credentials', tag: '/credentials' },
				{ label: 'IPAM', tag: '/ipam' },
				{ label: 'Firmware', tag: '/firmware' }
			]
		},
		{
			label: 'Monitoring',
			icon: Activity,
			features: [
				{ label: 'Overview', tag: '/monitoring' },
				{ label: 'Topology', tag: '/topology' },
				{ label: 'Device Logs', tag: '/logs' }
			]
		},
		{
			label: 'AI',
			icon: BrainCircuit,
			features: [
				{ label: 'AI Agent', tag: '/ai-agent' },
				{ label: 'Diagnostics', tag: '/ai-diagnostics' },
				{ label: 'Incidents', tag: '/ai-incidents' }
			]
		},
		{
			label: 'Automation',
			icon: Zap,
			features: [
				{ label: 'Jobs', tag: '/jobs' },
				{ label: 'Templates', tag: '/templates' },
				{ label: 'Schedules', tag: '/schedules' },
				{ label: 'MoP Generator', tag: '/mop-generator' },
				{ label: 'MoP History', tag: '/mop-history' },
				{ label: 'Backup', tag: '/backup' }
			]
		},
		{
			label: 'User Management',
			icon: Users,
			features: [
				{ label: 'Users', tag: '/users' },
				{ label: 'Roles & Policies', tag: '/roles' },
				{ label: 'Notifications', tag: '/notifications' }
			]
		},
		{
			label: 'System',
			icon: Settings2,
			features: [
				{ label: 'Global Settings', tag: '/settings' },
				{ label: 'Audit Logs', tag: '/audit-logs' },
				{ label: 'Integrations', tag: '/integrations' }
			]
		},
		{
			label: 'Developer',
			icon: Code2,
			features: [
				{ label: 'API Keys', tag: '/api-keys' },
				{ label: 'API Docs', tag: '/api-docs' },
				{ label: 'Documentation', tag: '/docs' },
				{ label: 'News', tag: '/news' }
			]
		}
	];
	/* eslint-enable @typescript-eslint/no-explicit-any */

	const ipamSlots = Array.from({ length: 32 }, (_, i) => i);
</script>

<section id="features" aria-labelledby="features-heading" class="bg-canvas py-24">
	<div class="mx-auto max-w-7xl px-6">
		<!-- Section header -->
		<div class="mb-12 text-center">
			<p class="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-muted/60">
				Platform Capabilities
			</p>
			<h2 id="features-heading" class="mb-2 text-2xl font-semibold tracking-tight text-content">
				Every tool your NOC needs.
			</h2>
			<p class="text-sm text-muted">One platform. Zero silos.</p>
		</div>

		<!-- Tier 1 — Bento grid -->
		<div class="grid grid-cols-4 gap-3">
			<!-- ── Row 1 ──────────────────────────────────────────── -->

			<!-- Real-time Monitoring (col-span-2) -->
			<div
				class="col-span-2 flex h-56 flex-col justify-between rounded-lg border border-edge bg-surface p-5"
			>
				<div>
					<div class="mb-2 flex items-center gap-1.5">
						<span class="text-accent"><Activity size={13} /></span>
						<span class="font-mono text-[10px] uppercase tracking-wide text-muted">Monitoring</span>
					</div>
					<p class="text-sm font-medium text-content">Real-time Monitoring</p>
					<p class="mt-1 text-xs leading-relaxed text-muted">
						Live SNMP polling, uptime tracking, and device health scoring across your entire
						network.
					</p>
				</div>
				<div>
					<div class="mb-1 flex justify-between font-mono text-[10px]">
						<span class="text-muted/60">Gi0/0 — bandwidth utilization</span>
						<span class="text-success">● 98.2% uptime</span>
					</div>
					<svg
						viewBox="0 0 320 48"
						class="h-10 w-full"
						preserveAspectRatio="none"
						aria-hidden="true"
					>
						<defs>
							<linearGradient id="sparkGrad" x1="0%" y1="0%" x2="0%" y2="100%">
								<stop offset="0%" style="stop-color: var(--color-accent); stop-opacity: 0.25" />
								<stop offset="100%" style="stop-color: var(--color-accent); stop-opacity: 0" />
							</linearGradient>
						</defs>
						<path
							d="M0 36 L22 28 L44 33 L66 18 L88 24 L110 11 L132 19 L154 14 L176 26 L198 8 L220 15 L242 23 L264 9 L286 17 L320 21 L320 48 L0 48 Z"
							style="fill: url(#sparkGrad)"
						/>
						<path
							d="M0 36 L22 28 L44 33 L66 18 L88 24 L110 11 L132 19 L154 14 L176 26 L198 8 L220 15 L242 23 L264 9 L286 17 L320 21"
							style="stroke: var(--color-accent)"
							fill="none"
							stroke-width="1.5"
						/>
					</svg>
				</div>
			</div>

			<!-- AI Agent (col-span-1) -->
			<div
				class="col-span-1 flex h-56 flex-col justify-between rounded-lg border border-edge bg-surface p-5"
			>
				<div>
					<div class="mb-2 flex items-center gap-1.5">
						<span class="text-accent"><BrainCircuit size={13} /></span>
						<span class="font-mono text-[10px] uppercase tracking-wide text-muted">AI</span>
					</div>
					<p class="text-sm font-medium text-content">AI Agent</p>
					<p class="mt-1 text-xs leading-relaxed text-muted">
						Conversational assistant for network operations queries and automated runbook execution.
					</p>
				</div>
				<div class="space-y-2">
					<div class="flex justify-end">
						<div
							class="max-w-[85%] rounded rounded-br-none border border-accent/20 bg-accent/10 px-2.5 py-1.5 font-mono text-[10px] text-accent"
						>
							Check BGP status
						</div>
					</div>
					<div class="flex justify-start">
						<div
							class="max-w-[90%] rounded rounded-bl-none border border-edge bg-elevated px-2.5 py-1.5 font-mono text-[10px] text-content"
						>
							Peer 10.0.1.2 is DOWN. Keepalive expired 3m ago.
						</div>
					</div>
				</div>
			</div>

			<!-- Device Management (col-span-1) -->
			<div
				class="col-span-1 flex h-56 flex-col justify-between rounded-lg border border-edge bg-surface p-5"
			>
				<div>
					<div class="mb-2 flex items-center gap-1.5">
						<span class="text-accent"><Server size={13} /></span>
						<span class="font-mono text-[10px] uppercase tracking-wide text-muted">Resources</span>
					</div>
					<p class="text-sm font-medium text-content">Device Management</p>
					<p class="mt-1 text-xs leading-relaxed text-muted">
						Centralized inventory with vendor detection, SSH credential vault, and lifecycle
						tracking.
					</p>
				</div>
				<div class="space-y-2">
					{#each devices as device (device.name)}
						<div class="flex items-center justify-between">
							<div class="flex items-center gap-2">
								<div class="h-1.5 w-1.5 rounded-full {device.dotClass}"></div>
								<span class="font-mono text-[10px] text-content">{device.name}</span>
							</div>
							<span class="font-mono text-[10px] text-muted">{device.vendor}</span>
						</div>
					{/each}
				</div>
			</div>

			<!-- ── Row 2 ──────────────────────────────────────────── -->

			<!-- Network Topology (col-span-1) -->
			<div
				class="col-span-1 flex h-56 flex-col justify-between rounded-lg border border-edge bg-surface p-5"
			>
				<div>
					<div class="mb-2 flex items-center gap-1.5">
						<span class="text-accent"><Network size={13} /></span>
						<span class="font-mono text-[10px] uppercase tracking-wide text-muted">Monitoring</span>
					</div>
					<p class="text-sm font-medium text-content">Network Topology</p>
					<p class="mt-1 text-xs leading-relaxed text-muted">
						Drag-and-drop visual topology editor with live link status and automatic layout.
					</p>
				</div>
				<svg viewBox="0 0 110 80" class="h-16 w-full" fill="none" aria-hidden="true">
					<line
						x1="55"
						y1="14"
						x2="22"
						y2="48"
						style="stroke: var(--color-edge)"
						stroke-width="1.5"
					/>
					<line
						x1="55"
						y1="14"
						x2="88"
						y2="48"
						style="stroke: var(--color-edge)"
						stroke-width="1.5"
					/>
					<line
						x1="22"
						y1="48"
						x2="55"
						y2="66"
						style="stroke: var(--color-edge)"
						stroke-width="1.5"
					/>
					<line
						x1="88"
						y1="48"
						x2="55"
						y2="66"
						style="stroke: var(--color-edge)"
						stroke-width="1.5"
					/>
					<line
						x1="55"
						y1="14"
						x2="22"
						y2="48"
						style="stroke: var(--color-accent)"
						stroke-width="1.5"
						stroke-dasharray="3,3"
					/>
					<circle
						cx="55"
						cy="14"
						r="7"
						style="fill: var(--color-elevated); stroke: var(--color-accent)"
						stroke-width="1.5"
					/>
					<circle
						cx="22"
						cy="48"
						r="7"
						style="fill: var(--color-elevated); stroke: var(--color-success)"
						stroke-width="1.5"
					/>
					<circle
						cx="88"
						cy="48"
						r="7"
						style="fill: var(--color-elevated); stroke: var(--color-success)"
						stroke-width="1.5"
					/>
					<circle
						cx="55"
						cy="66"
						r="7"
						style="fill: var(--color-elevated); stroke: var(--color-warning)"
						stroke-width="1.5"
					/>
				</svg>
			</div>

			<!-- AI Diagnostics (col-span-2) -->
			<div
				class="col-span-2 flex h-56 flex-col justify-between rounded-lg border border-edge bg-surface p-5"
			>
				<div>
					<div class="mb-2 flex items-center gap-1.5">
						<span class="text-accent"><Bot size={13} /></span>
						<span class="font-mono text-[10px] uppercase tracking-wide text-muted">AI</span>
					</div>
					<p class="text-sm font-medium text-content">AI Diagnostics</p>
					<p class="mt-1 text-xs leading-relaxed text-muted">
						Automatically detect and explain network faults using LLM analysis with remediation
						steps.
					</p>
				</div>
				<div class="space-y-0.5 rounded border border-edge bg-canvas p-3 font-mono text-[10px]">
					<div class="text-muted/50">$ crux diagnose 10.0.1.1</div>
					<div class="text-content">▸ Running SNMP diagnostics...</div>
					<div class="text-warning">✗ BGP session with 10.0.1.2 — DOWN</div>
					<div class="ml-2 text-muted">Root cause: Hold timer expired (4m ago)</div>
					<div class="ml-2 text-success">→ clear ip bgp 10.0.1.2</div>
				</div>
			</div>

			<!-- IPAM (col-span-1) -->
			<div
				class="col-span-1 flex h-56 flex-col justify-between rounded-lg border border-edge bg-surface p-5"
			>
				<div>
					<div class="mb-2 flex items-center gap-1.5">
						<span class="text-accent"><MapPin size={13} /></span>
						<span class="font-mono text-[10px] uppercase tracking-wide text-muted">Resources</span>
					</div>
					<p class="text-sm font-medium text-content">IP Address Management</p>
					<p class="mt-1 text-xs leading-relaxed text-muted">
						Subnet allocation, VLAN tracking, and IP conflict detection across all address spaces.
					</p>
				</div>
				<div>
					<div class="mb-1.5 font-mono text-[10px] text-muted/60">10.0.0.0/22 — utilization</div>
					<div class="grid grid-cols-8 gap-0.5">
						{#each ipamSlots as slot (slot)}
							<div
								class="h-2 w-full rounded-[1px] {slot < 18
									? 'bg-accent/60'
									: slot < 24
										? 'bg-success/40'
										: 'bg-edge'}"
							></div>
						{/each}
					</div>
					<div class="mt-2 flex gap-3 font-mono text-[9px] text-muted/60">
						<span class="flex items-center gap-1">
							<span class="inline-block h-1.5 w-2 rounded-[1px] bg-accent/60"></span>Used
						</span>
						<span class="flex items-center gap-1">
							<span class="inline-block h-1.5 w-2 rounded-[1px] bg-success/40"></span>Reserved
						</span>
						<span class="flex items-center gap-1">
							<span class="inline-block h-1.5 w-2 rounded-[1px] bg-edge"></span>Free
						</span>
					</div>
				</div>
			</div>

			<!-- ── Row 3 (text-only, h-44) ───────────────────────── -->

			<!-- MOP Generator -->
			<div class="col-span-1 flex h-44 flex-col rounded-lg border border-edge bg-surface p-5">
				<div class="mb-2 flex items-center gap-1.5">
					<span class="text-accent"><FileText size={13} /></span>
					<span class="font-mono text-[10px] uppercase tracking-wide text-muted">Automation</span>
				</div>
				<p class="text-sm font-medium text-content">MOP Generator</p>
				<p class="mt-1 text-xs leading-relaxed text-muted">
					AI-assisted Method of Procedure generation for structured, auditable change management.
				</p>
			</div>

			<!-- Config Backup -->
			<div class="col-span-1 flex h-44 flex-col rounded-lg border border-edge bg-surface p-5">
				<div class="mb-2 flex items-center gap-1.5">
					<span class="text-accent"><Archive size={13} /></span>
					<span class="font-mono text-[10px] uppercase tracking-wide text-muted">Automation</span>
				</div>
				<p class="text-sm font-medium text-content">Config Backup</p>
				<p class="mt-1 text-xs leading-relaxed text-muted">
					Scheduled configuration snapshots with line-by-line diff comparison and rollback support.
				</p>
			</div>

			<!-- RBAC -->
			<div class="col-span-1 flex h-44 flex-col rounded-lg border border-edge bg-surface p-5">
				<div class="mb-2 flex items-center gap-1.5">
					<span class="text-accent"><ShieldCheck size={13} /></span>
					<span class="font-mono text-[10px] uppercase tracking-wide text-muted">Security</span>
				</div>
				<p class="text-sm font-medium text-content">Role-Based Access</p>
				<p class="mt-1 text-xs leading-relaxed text-muted">
					Admin, Operator, and Viewer roles with a policy engine and immutable audit log.
				</p>
			</div>

			<!-- Integrations -->
			<div class="col-span-1 flex h-44 flex-col rounded-lg border border-edge bg-surface p-5">
				<div class="mb-2 flex items-center gap-1.5">
					<span class="text-accent"><Plug size={13} /></span>
					<span class="font-mono text-[10px] uppercase tracking-wide text-muted">System</span>
				</div>
				<p class="text-sm font-medium text-content">Integrations</p>
				<p class="mt-1 text-xs leading-relaxed text-muted">
					Outbound webhooks, Telegram alerts, and an API-first design for external toolchain
					integration.
				</p>
			</div>
		</div>

		<!-- Divider -->
		<div class="mb-6 mt-16 flex items-center gap-4">
			<div class="h-px flex-1 bg-edge"></div>
			<span class="font-mono text-[10px] uppercase tracking-[0.2em] text-muted/50">All Modules</span
			>
			<div class="h-px flex-1 bg-edge"></div>
		</div>

		<!-- Tier 2 — All Modules compact grid -->
		<div class="grid grid-cols-3 gap-3">
			{#each groups as group, gi (gi)}
				{@const GroupIcon = group.icon}
				<div class="rounded-lg border border-edge bg-surface p-4">
					<div class="flex items-center gap-2">
						<span class="text-muted"><GroupIcon size={12} /></span>
						<span class="font-mono text-[10px] uppercase tracking-wide text-muted"
							>{group.label}</span
						>
					</div>
					<div class="mb-3 mt-2 border-t border-edge"></div>
					<div class="space-y-2">
						{#each group.features as feature, fi (fi)}
							<div class="flex items-baseline justify-between gap-2">
								<div class="flex items-center gap-2">
									<div class="mt-1 h-1 w-1 shrink-0 rounded-full bg-muted/40"></div>
									<span class="text-xs text-content">{feature.label}</span>
								</div>
								<span class="shrink-0 font-mono text-[10px] text-muted/60">{feature.tag}</span>
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
