// Shared content for the /pricing pages. Cloud and Self-host live on separate routes
// (/pricing and /pricing/self-host) but share the toggle, core-features grid, and FAQs.

const REPO = 'https://github.com/LuminousVar/crux-landing';

export type Plan = {
	id: 'self-host' | 'cloud';
	name: string;
	price: string;
	priceNote: string;
	tagline: string;
	badge?: string;
	features: string[];
	cta: { label: string; href: string; external?: boolean; accent?: boolean };
};

export const cloudPlan: Plan = {
	id: 'cloud',
	name: 'Cloud',
	price: 'Coming soon',
	priceNote: 'early access opening soon',
	tagline:
		'We host the platform for you. Managed infrastructure over a WireGuard VPN — your devices stay on your own network, you skip the self-hosting setup entirely.',
	badge: 'Coming Soon',
	features: [
		'Zero infrastructure to manage — no Compose files, no Postgres, no on-call',
		'WireGuard tunnel managed by Crux — install only the client on your devices',
		'Works across NAT and firewalls — no port forwarding or static IP required',
		'Managed backups, TLS certificates, and platform upgrades',
		'Always on the latest version — updates applied automatically'
	],
	cta: { label: 'Contact Us', href: 'mailto:luminousv@disroot.org', accent: true }
};

export const selfHostPlan: Plan = {
	id: 'self-host',
	name: 'Self-host',
	price: 'Free',
	priceNote: 'forever · open source',
	tagline:
		'You host the platform. Full control over your infrastructure, credentials, and data — run it on your own hardware with a single compose.yaml.',
	features: [
		'One compose.yaml — Postgres, Valkey, Celery, FastAPI, SvelteKit',
		'Credentials encrypted with AES-256 — never leave your network',
		'Bring your own AI provider — Groq, Ollama, DeepSeek, Gemini, or any other',
		'Immutable audit log — every change attributed and timestamped',
		'MIT licensed — commercial use allowed, no seat limits'
	],
	cta: { label: 'Deploy Now', href: REPO, external: true }
};

// Included with both plans — the plan choice never gates a feature. Grouped into
// categories for the comparison table on /pricing (Penpot-style).
export type FeatureRow = { name: string; selfHost: boolean; cloud: boolean };

// Shorthand for a feature included in both plans (the network-ops core is identical).
const both = (name: string): FeatureRow => ({ name, selfHost: true, cloud: true });

export const featureCategories: { category: string; features: FeatureRow[] }[] = [
	{
		category: 'Monitoring',
		features: [
			both('SNMP v2c/v3 polling'),
			both('Live metrics & charts'),
			both('Incident alerts from SNMP traps'),
			both('Device health & reachability')
		]
	},
	{
		category: 'Automation',
		features: [
			both('SSH config jobs (100+ vendors)'),
			both('Approval workflow (pending → approved → run)'),
			both('Method-of-Procedure (MoP) templates'),
			both('Scheduled & on-demand execution')
		]
	},
	{
		category: 'AI analysis',
		features: [
			both('AI incident summaries'),
			both('On-demand AI diagnostics'),
			both('Bring-your-own provider (Groq, DeepSeek, Gemini)'),
			both('Air-gapped local models (Ollama)')
		]
	},
	{
		category: 'Inventory & IPAM',
		features: [
			both('Device inventory'),
			both('IP address management (IPAM)'),
			both('Prefix & subnet tracking'),
			both('Network topology map')
		]
	},
	{
		category: 'Access & security',
		features: [
			both('Role-based access control'),
			both('AES-256 credential encryption'),
			both('Immutable audit log'),
			both('API keys')
		]
	},
	{
		category: 'Platform',
		features: [
			both('REST API & OpenAPI docs'),
			both('Webhooks & notifications'),
			both('Firmware management'),
			both('Podman / Docker Compose deploy')
		]
	},
	{
		// Where the plans genuinely diverge. Every capability the network-ops core needs
		// (backups, monitoring, TLS…) is technically possible when you self-host — the
		// difference is whether Crux *manages* it for you (Cloud) or you run it yourself
		// (Self-host). So Cloud rows are the done-for-you benefits, Self-host rows are the
		// control/ownership benefits.
		category: 'Hosting & operations',
		features: [
			{ name: 'Fully managed hosting — no servers to run', selfHost: false, cloud: true },
			{ name: 'Automatic platform upgrades', selfHost: false, cloud: true },
			{ name: 'Managed TLS certificates', selfHost: false, cloud: true },
			{ name: 'Managed WireGuard tunnel', selfHost: false, cloud: true },
			{ name: 'Managed backups & restore', selfHost: false, cloud: true },
			{ name: '24/7 uptime monitoring & support', selfHost: false, cloud: true },
			{ name: 'Runs fully air-gapped / offline', selfHost: true, cloud: false },
			{ name: 'Data & database on your own hardware', selfHost: true, cloud: false },
			{ name: 'Direct database & shell access', selfHost: true, cloud: false },
			{ name: 'Fork & modify the source (MIT)', selfHost: true, cloud: false },
			{ name: 'No recurring hosting cost', selfHost: true, cloud: false }
		]
	}
];

export const pricingFaqs = [
	{
		question: 'Is the self-hosted version really free?',
		answer:
			'Yes — it is MIT-licensed and free forever. No usage fees, no seat limits, no telemetry, and no feature gates. Clone the repo, run one compose.yaml, and you have the full platform.'
	},
	{
		question: 'Are any features locked behind a paid plan?',
		answer:
			'No. Self-host and Cloud ship the exact same feature set — SNMP monitoring, config automation, AI analysis, IPAM, topology, RBAC, and audit logging. The only difference is who runs the servers.'
	},
	{
		question: 'How will Crux Cloud be priced?',
		answer:
			'Cloud pricing is not finalised yet. It will cover managed infrastructure (PostgreSQL, Valkey, Celery, backups, TLS) and the WireGuard tunnel. Exact tiers will be announced when early access opens.'
	},
	{
		question: 'Do I have to pay for AI usage?',
		answer:
			'On Self-host you bring your own AI provider — Groq, DeepSeek, Gemini, or a local Ollama model. You pay that provider directly (or nothing at all for a local model); Crux takes no cut and adds no markup.'
	},
	{
		question: 'Can I move from Self-host to Cloud later?',
		answer:
			'That is the plan. Your devices and data stay portable, so you can start free on your own hardware and migrate to managed Cloud once it is available — without re-onboarding your inventory.'
	},
	{
		question: 'Can I use Crux commercially?',
		answer:
			'Yes. The MIT license permits commercial use, modification, and private deployment with no additional license to buy.'
	}
];
