export interface DocModule {
	slug: string;
	label: string;
	icon: string;
	description: string;
	capabilities: string[];
	appRoute: string;
}

export interface DocGroup {
	key: string;
	label: string;
	modules: DocModule[];
}

export const docGroups: DocGroup[] = [
	{
		key: 'resources',
		label: 'Resources',
		modules: [
			{
				slug: 'devices',
				label: 'Devices',
				icon: 'Server',
				appRoute: '/devices',
				description: 'Full CRUD registry of all managed network devices with SSH console access.',
				capabilities: [
					'Add, edit, and remove network devices',
					'View per-device detail: interfaces, uptime, SNMP metrics',
					'Open a live SSH console session directly from the browser',
					'Link devices to credentials from the credential vault',
					'Filter and search across all managed devices'
				]
			},
			{
				slug: 'inventory',
				label: 'Inventory',
				icon: 'Layers',
				appRoute: '/inventory',
				description:
					'Hardware asset inventory tracking physical lifecycle, serial numbers, and location.',
				capabilities: [
					'Track hardware model, serial number, location, and status',
					'Full CRUD — add, edit, view, and retire assets',
					'Separate from Devices: inventory = physical hardware, devices = managed endpoints',
					'Filter assets by status or location'
				]
			},
			{
				slug: 'credentials',
				label: 'Credentials',
				icon: 'KeyRound',
				appRoute: '/credentials',
				description:
					'AES-256 encrypted vault for SSH passwords, SSH keys, and SNMP community strings.',
				capabilities: [
					'Store SSH passwords, SSH keys, and SNMP credentials',
					'All secrets encrypted at rest with AES-256 (Fernet)',
					'Secrets are never returned via the API — only decrypted inside the execution layer',
					'Live connection test — validate a credential against a device without exposing the value',
					'Assign credentials to devices for use in automation jobs'
				]
			},
			{
				slug: 'ipam',
				label: 'IPAM',
				icon: 'MapPin',
				appRoute: '/ipam',
				description: 'IP Address Management — subnet allocation, VLAN tracking, and conflict detection.',
				capabilities: [
					'Define and manage IP subnets and address ranges',
					'Track VLAN assignments per subnet',
					'Detect IP conflicts across all managed address spaces',
					'Visual subnet utilization overview'
				]
			},
			{
				slug: 'firmware',
				label: 'Firmware',
				icon: 'HardDrive',
				appRoute: '/firmware',
				description: 'Firmware image repository with SHA-256 checksum verification.',
				capabilities: [
					'Upload and version firmware images for any vendor',
					'SHA-256 checksum verified at upload time',
					'Distribute firmware to devices via automation jobs',
					'Track which firmware version is running on each device'
				]
			}
		]
	},
	{
		key: 'monitoring',
		label: 'Monitoring',
		modules: [
			{
				slug: 'monitoring',
				label: 'Overview',
				icon: 'Activity',
				appRoute: '/monitoring',
				description:
					'Real-time SNMP monitoring with per-device charts and auto-refresh every 30 seconds.',
				capabilities: [
					'Poll device metrics via SNMP v2c/v3 on a configurable interval',
					'Dashboard: device health summary, uptime, interface stats, bandwidth',
					'Per-device detail view with line, area, bar, sparkline, and gauge charts',
					'Receive and display SNMP traps for interface-down events',
					'Auto-refresh every 30 seconds — no manual reload required'
				]
			},
			{
				slug: 'topology',
				label: 'Topology',
				icon: 'Network',
				appRoute: '/topology',
				description: 'Read-only live network topology map with link status overlays.',
				capabilities: [
					'Visual representation of your live network topology',
					'Link status overlays — instantly see which connections are up or down',
					'Read-only view — for authoring topology diagrams, use the Visual Editor',
					'Zoom, pan, and inspect node details'
				]
			},
			{
				slug: 'logs',
				label: 'Device Logs',
				icon: 'ScrollText',
				appRoute: '/logs',
				description: 'Aggregated syslog and event log stream per device.',
				capabilities: [
					'View aggregated syslog and event logs from all devices',
					'Filter logs by device, severity, or time range',
					'Search log content for specific events or patterns'
				]
			}
		]
	},
	{
		key: 'ai',
		label: 'AI',
		modules: [
			{
				slug: 'ai-agent',
				label: 'AI Agent',
				icon: 'BrainCircuit',
				appRoute: '/ai-agent',
				description: 'Conversational AI interface for network operations in plain language.',
				capabilities: [
					'Query device state and network health in plain language',
					'Execute runbooks and automation jobs via natural language commands',
					'Get troubleshooting steps and remediation suggestions',
					'Compatible with any OpenAI-compatible provider: Groq, DeepSeek, Gemini, Ollama',
					'Run fully local with Ollama — no data leaves your network'
				]
			},
			{
				slug: 'ai-diagnostics',
				label: 'AI Diagnostics',
				icon: 'Bot',
				appRoute: '/ai-diagnostics',
				description:
					'On-demand fault analysis — trigger a diagnostic and get root cause + remediation.',
				capabilities: [
					'Trigger on-demand diagnostics on any device or IP address',
					'LLM analyzes SNMP data and returns root-cause assessment',
					'Remediation steps provided alongside the diagnosis',
					'Distinct from AI Incidents: Diagnostics = triggered by user, Incidents = triggered by SNMP events'
				]
			},
			{
				slug: 'ai-incidents',
				label: 'AI Incidents',
				icon: 'ShieldAlert',
				appRoute: '/ai-incidents',
				description:
					'Automated incident log — every SNMP trap analyzed by AI with thumbs up/down feedback.',
				capabilities: [
					'Every SNMP trap is automatically passed to the LLM for analysis',
					'AI-generated incident summaries stored in a persistent log',
					'Thumbs up / thumbs down feedback loop per incident',
					'Refresh to detect new incidents without full page reload',
					'Distinct from AI Diagnostics: Incidents = event-driven, Diagnostics = on-demand'
				]
			}
		]
	},
	{
		key: 'automation',
		label: 'Automation',
		modules: [
			{
				slug: 'jobs',
				label: 'Jobs',
				icon: 'Zap',
				appRoute: '/jobs',
				description: 'Background job execution engine with human approval workflow.',
				capabilities: [
					'Create and run background jobs against any managed device',
					'Approval workflow: awaiting_approval → approved → running → success/failed',
					'Status tracking: pending, approved, running, success, failed, rejected, cancelled',
					'Require human approval for critical operations',
					'Whitelist trusted job types for autonomous execution'
				]
			},
			{
				slug: 'templates',
				label: 'Templates',
				icon: 'FileCode2',
				appRoute: '/templates',
				description: 'Vendor-specific job templates — create jobs without writing raw commands.',
				capabilities: [
					'Pre-built templates grouped by vendor: Cisco, Juniper, Arista, MikroTik, and more',
					'Browse templates by vendor and category',
					'Search templates by name, vendor, or category',
					'Use templates to create jobs without writing device-specific commands'
				]
			},
			{
				slug: 'schedules',
				label: 'Schedules',
				icon: 'CalendarClock',
				appRoute: '/schedules',
				description:
					'Cron-based job scheduling with human-readable descriptions and next-run preview.',
				capabilities: [
					'Schedule any job with a cron expression',
					'Human-readable cron description shown alongside the expression',
					'Next-run time preview before saving',
					'Calendar picker UI for common schedule patterns',
					'Enable/disable toggle per schedule without deleting it'
				]
			},
			{
				slug: 'mop-generator',
				label: 'MoP Generator',
				icon: 'FileText',
				appRoute: '/mop-generator',
				description:
					'AI-assisted Method of Procedure document generator for change management.',
				capabilities: [
					'Generate structured MOP documents for any network change',
					'AI-assisted content generation from a plain-language description',
					'Structured output: objective, pre-checks, steps, rollback, post-checks',
					'Export or copy the generated MOP for use in change tickets'
				]
			},
			{
				slug: 'mop-history',
				label: 'MoP History',
				icon: 'FileText',
				appRoute: '/mop-history',
				description: 'Archive of all generated MOP documents with full content retrieval.',
				capabilities: [
					'Browse all previously generated MOP documents',
					'View full content of any historical MOP',
					'Filter by date or title'
				]
			},
			{
				slug: 'backup',
				label: 'Backup',
				icon: 'Archive',
				appRoute: '/backup',
				description:
					'Scheduled configuration snapshots with diff comparison and rollback support.',
				capabilities: [
					'Schedule automatic configuration backups for any device',
					'Line-by-line diff comparison between backup versions',
					'Rollback to any previous configuration snapshot',
					'Manual backup trigger available at any time'
				]
			}
		]
	},
	{
		key: 'user-management',
		label: 'User Management',
		modules: [
			{
				slug: 'users',
				label: 'Users',
				icon: 'Users',
				appRoute: '/users',
				description: 'User account management with per-user detail and role assignment.',
				capabilities: [
					'Create, edit, and deactivate user accounts',
					'Assign roles: Admin, Operator, or Viewer',
					'View per-user activity and last login',
					'Invite users via email'
				]
			},
			{
				slug: 'roles',
				label: 'Roles & Policies',
				icon: 'ShieldCheck',
				appRoute: '/roles',
				description: 'Policy-based RBAC with three built-in roles and custom policy creation.',
				capabilities: [
					'Three built-in roles: Admin, Operator, Viewer',
					'Create custom roles with scoped permissions',
					'Policy engine for fine-grained access control',
					'Every sensitive operation enforced by role check'
				]
			},
			{
				slug: 'notifications',
				label: 'Notifications',
				icon: 'Bell',
				appRoute: '/notifications',
				description: 'Notification center for SNMP alerts, job completions, and incident events.',
				capabilities: [
					'Receive notifications for SNMP trap events',
					'Job completion and failure alerts',
					'AI incident detection notifications',
					'Unread count badge in the sidebar',
					'Mark as read individually or all at once'
				]
			}
		]
	},
	{
		key: 'system',
		label: 'System',
		modules: [
			{
				slug: 'settings',
				label: 'Global Settings',
				icon: 'Sliders',
				appRoute: '/settings',
				description: 'Platform-wide configuration for SNMP, AI provider, and system behavior.',
				capabilities: [
					'Configure SNMP polling interval and community strings',
					'Set AI provider endpoint and API key',
					'Platform-wide defaults for jobs and automation'
				]
			},
			{
				slug: 'audit-logs',
				label: 'Audit Logs',
				icon: 'ScrollText',
				appRoute: '/audit-logs',
				description: 'Immutable audit trail of all sensitive operations across the platform.',
				capabilities: [
					'Log of every sensitive operation: credential access, role changes, job execution',
					'Immutable — entries cannot be deleted or modified',
					'Filter by user, action type, or time range',
					'Export audit log for compliance reporting'
				]
			},
			{
				slug: 'integrations',
				label: 'Integrations',
				icon: 'Plug',
				appRoute: '/integrations',
				description: 'Outbound Webhook and Telegram bot integrations for external notifications.',
				capabilities: [
					'Webhook integration — send HTTP callbacks to any external endpoint',
					'Telegram bot integration — receive alerts in a Telegram channel',
					'Configure which events trigger each integration',
					'Test integrations before activating'
				]
			}
		]
	},
	{
		key: 'developer',
		label: 'Developer',
		modules: [
			{
				slug: 'api-keys',
				label: 'API Keys',
				icon: 'KeyRound',
				appRoute: '/api-keys',
				description: 'Generate and manage API keys for external integrations and automation.',
				capabilities: [
					'Generate scoped API keys for external tools',
					'Revoke keys at any time',
					'View key usage and last-used timestamp',
					'Keys inherit the permissions of the creating user role'
				]
			},
			{
				slug: 'api-docs',
				label: 'API Docs',
				icon: 'BookOpen',
				appRoute: '/api-docs',
				description: 'Interactive OpenAPI / Swagger documentation for all backend endpoints.',
				capabilities: [
					'Full OpenAPI specification for all backend API endpoints',
					'Live try-it-out — execute API calls directly from the docs',
					'Authenticate with your API key in the docs UI',
					'Downloadable OpenAPI JSON spec for generating client SDKs'
				]
			}
		]
	}
];
