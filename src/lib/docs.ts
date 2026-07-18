export interface DocCallout {
	type: 'note' | 'warning' | 'tip';
	text: string;
}

export interface DocTable {
	title?: string;
	headers: string[];
	rows: string[][];
}

export interface DocDiagram {
	title?: string;
	ascii: string;
}

export interface DocModule {
	slug: string;
	label: string;
	icon: string;
	description: string;
	capabilities: string[];
	/** Route in the Crux app where this lives. Omit for concept/guide pages. */
	appRoute?: string;
	overview: string;
	howItWorks: string[];
	steps: string[];
	commands?: { label: string; code: string }[];
	commandsLabel?: string;
	technicalNotes: string[];
	/** REST API base path in the platform, e.g. '/api/v1/jobs'. */
	apiBase?: string;
	/** Who can access this module, e.g. 'Admin (all), Network Engineer (create)'. */
	access?: string;
	/** Things to set up before using this module. */
	prerequisites?: string[];
	/** Slugs of related modules — rendered as cross-link cards. */
	related?: string[];
	/** Highlighted note/warning/tip boxes. */
	callouts?: DocCallout[];
	/** Reference tables (state machines, type matrices, env var lists). */
	tables?: DocTable[];
	/** A single ASCII diagram (zero-dependency, monospace). */
	diagram?: DocDiagram;
	/** Problem → cause → fix entries. */
	troubleshooting?: { problem: string; cause: string; fix: string }[];
	/** Per-module frequently asked questions. */
	faq?: { q: string; a: string }[];
}

export interface DocGroup {
	key: string;
	label: string;
	modules: DocModule[];
}

export const docGroups: DocGroup[] = [
	{
		key: 'getting-started',
		label: 'Getting Started',
		modules: [
			{
				slug: 'introduction',
				label: 'Introduction',
				icon: 'BookMarked',
				appRoute: '/',
				description: 'What Crux is, the problems it solves, and how its components fit together.',
				overview:
					'Crux is an open-source, on-premise network operations platform for network engineers and IT administrators. It unifies configuration automation, real-time SNMP monitoring, and AI-assisted incident analysis into a single self-hosted application. There are no cloud dependencies, no telemetry, and no SaaS tiers — everything runs inside your own infrastructure via a single Podman Compose command.',
				capabilities: [
					'Scheduled automation jobs: backup, health-check, config push, and run-command against any managed device',
					'Real-time SNMP monitoring with per-device charts and automatic trap ingestion',
					'AI-assisted incident analysis: every SNMP trap is automatically analyzed by an LLM for root-cause and remediation',
					'AES-256 credential vault: SSH passwords, SSH private keys, SNMP community strings, and API tokens encrypted at rest',
					'Policy-based RBAC: eight built-in roles, custom roles, and an immutable audit log',
					'Firmware repository with SHA-256 integrity verification and on-demand distribution',
					'Network topology discovery via LLDP, IP address management (IPAM), and outbound webhook integrations'
				],
				howItWorks: [
					'The SvelteKit frontend communicates with a FastAPI backend over a REST API. The backend handles authentication, RBAC enforcement, and all database operations.',
					'Long-running operations (job execution, SNMP polling, AI analysis) are dispatched as Celery tasks and executed by worker containers. Celery Beat handles cron-triggered schedules.',
					'PostgreSQL stores all application data. Valkey (a Redis fork) serves as the Celery broker and result backend, and as the JWT token blocklist.',
					'A separate SNMP trap receiver service listens on UDP port 162. Received traps are parsed and handed to a Celery task for AI analysis.',
					'All secrets are encrypted with AES-256 (Fernet) before being written to the database. The encryption key is set via the ENCRYPTION_KEY environment variable and never stored alongside the data.'
				],
				steps: [
					'Read this Introduction to understand the architecture and component roles.',
					'Follow the Installation guide to deploy Crux on a Linux host via Podman Compose.',
					'Complete the Configuration guide to set your encryption key, AI provider, and SNMP defaults.',
					'Add your first device at /devices and probe connectivity.',
					'Explore the module documentation for detailed usage of each platform feature.'
				],
				technicalNotes: [
					'Supported deployment: Linux host with podman-compose or Docker Compose v2.',
					'Exposed host ports: 3000 (frontend), 8000 (backend API), 162/udp (SNMP trap receiver).',
					'No cloud dependencies — all services run in containers on your local network.',
					'License: MIT. Source code available on GitHub.'
				],
				related: ['installation', 'configuration', 'architecture']
			},
			{
				slug: 'installation',
				label: 'Installation',
				icon: 'Terminal',
				appRoute: '/',
				commandsLabel: 'Commands',
				description: 'Deploy Crux on a Linux host (or VPS) with Docker Compose or Podman Compose.',
				overview:
					'Crux ships as a multi-container application defined in a single compose.yaml, so it runs on any Docker-compatible host. Use Docker Compose v2 or Podman Compose — the same file works unchanged — on your own hardware or any Linux VPS. Prebuilt images are published to GHCR, or the stack can be built locally. One `up -d` starts seven services: frontend, backend, Celery worker, Celery beat, SNMP trap receiver, PostgreSQL, and Valkey. After the stack is up you bootstrap the first admin account with a one-time script.',
				capabilities: [
					'Single compose.yaml brings up the full stack — frontend, backend, worker, beat, trap receiver, Postgres, Valkey',
					'Runs on Docker Compose v2 or Podman Compose — the same file, unchanged — on bare metal or any Linux VPS',
					'Prebuilt images on GHCR (ghcr.io/luminousvar/crux-backend and crux-frontend), or build locally',
					'PostgreSQL 17 and Valkey 9 included — no external database or cache to provision',
					'Environment-driven via .env — no code changes to customise',
					'Health checks gate startup: backend, worker, and trap receiver wait for Postgres and Valkey to be ready',
					'Persistent named volumes for Postgres data, Valkey data, and firmware storage'
				],
				prerequisites: [
					'A Linux host — Ubuntu 22.04 or 24.04 LTS recommended (see the tip below).',
					'Docker Compose v2 (or Podman Compose) installed.',
					'Outbound internet access to pull images from GHCR (or the ability to build locally).',
					'UDP port 162 reachable from your devices if you want SNMP traps.'
				],
				tables: [
					{
						title: 'Services & host ports',
						headers: ['Service', 'Role', 'Host port'],
						rows: [
							['frontend', 'SvelteKit UI', '127.0.0.1:3000'],
							['backend', 'FastAPI REST API', '8000'],
							['worker', 'Celery job executor', '—'],
							['beat', 'Celery scheduler', '—'],
							['trap-receiver', 'SNMP trap listener', '162/udp'],
							['postgres', 'PostgreSQL 17 database', '—'],
							['valkey', 'Valkey 9 broker + cache', '—']
						]
					}
				],
				howItWorks: [
					'compose.yaml defines seven services on an internal bridge network; only frontend (3000), backend (8000), and the trap receiver (162/udp) publish host ports.',
					'Postgres and Valkey expose health checks; the backend, worker, and trap receiver start only once both are healthy.',
					'On first start the backend auto-creates missing tables via SQLAlchemy metadata.create_all — there is no automatic migration of existing columns.',
					'No admin user exists by default — you create the first one with the bootstrap script, which prints an activation link.',
					'The worker and beat containers run Celery; the trap receiver runs a standalone listener on UDP 162.'
				],
				steps: [
					'Install Docker Compose v2 or Podman Compose on a Linux host (a local box or any VPS).',
					'Clone the Crux repository and enter it.',
					'Copy the example env file: cp env.example .env',
					'Edit .env — at minimum set ENCRYPTION_KEY, JWT_SECRET_KEY, and POSTGRES_PASSWORD (see the Configuration guide).',
					'Start the stack: docker compose up -d (or podman-compose up -d).',
					'Verify all services are healthy: docker compose ps (or podman-compose ps).',
					'Bootstrap the first admin account (see commands), open the printed activation link, set a password.',
					'Log in at http://localhost:3000 — or your domain if you set up a reverse proxy on a VPS.'
				],
				commands: [
					{
						label: 'Clone the repository',
						code: `git clone https://github.com/LuminousVar/crux
cd crux`
					},
					{
						label: 'Copy environment file',
						code: `cp env.example .env`
					},
					{
						label: 'Start the full stack (Docker)',
						code: `docker compose up -d`
					},
					{
						label: 'Start the full stack (Podman)',
						code: `podman-compose up -d`
					},
					{
						label: 'Check service health',
						code: `docker compose ps
# or: podman-compose ps`
					},
					{
						label: 'Bootstrap the first admin account',
						code: `cd backend
uv run python scripts/bootstrap.py --email admin@company.com --username admin
# Output includes an activation link — open it, set a password, log in.`
					},
					{
						label: 'View live logs',
						code: `docker compose logs -f
# Filter to a single service:
docker compose logs -f backend
# Podman: swap "docker compose" for "podman-compose"`
					},
					{
						label: 'Stop the stack',
						code: `docker compose down
# Stop and remove all data volumes (destructive):
docker compose down -v
# Podman: swap "docker compose" for "podman-compose"`
					}
				],
				callouts: [
					{
						type: 'tip',
						text: 'Ubuntu 22.04 / 24.04 LTS is the recommended host OS. Its kernel ships WireGuard in-tree (needed for the Crux Cloud tunnel and any site-to-site VPN), Docker and Podman have first-class apt packages, and ufw makes the firewall rules (UDP 162 for SNMP traps, WireGuard port) trivial. Other modern distros work — Debian, Rocky, Fedora — but the docs and bootstrap script are validated on Ubuntu LTS.'
					},
					{
						type: 'warning',
						text: 'No admin user is auto-created. After the stack is healthy you must run scripts/bootstrap.py once — otherwise no one can log in.'
					},
					{
						type: 'note',
						text: 'metadata.create_all only creates MISSING tables. Upgrading an existing install? Run the relevant scripts/migrate.py migrations manually — see Production Deployment.'
					}
				],
				technicalNotes: [
					'Both runtimes work: Docker Compose v2 (docker compose) and Podman Compose (podman-compose) with the same compose.yaml. Podman rootless mode is supported.',
					'On a VPS: point a domain at the host, put Caddy (or another reverse proxy) in front of the frontend on 127.0.0.1:3000, and Caddy handles TLS automatically — see Production Deployment.',
					'The SNMP trap receiver needs UDP 162 reachable from devices: ufw allow 162/udp (or firewall-cmd --add-port=162/udp --permanent).',
					'Frontend is bound to 127.0.0.1:3000 by default — front it with a reverse proxy (Caddy) for external access.',
					'To update: git pull, then docker compose up -d --build / podman-compose up -d --build (or re-pull the GHCR images).',
					'Named volumes pgdata, valkeydata, and firmwaredata persist across restarts — `down -v` deletes them.'
				],
				related: ['configuration', 'production-deployment', 'architecture']
			},
			{
				slug: 'configuration',
				label: 'Configuration',
				icon: 'Settings',
				appRoute: '/settings',
				commandsLabel: 'Example .env Values',
				description: 'All environment variables — secrets, AI provider, news, SMTP, and Telegram.',
				overview:
					'Crux is configured entirely via environment variables in a .env file. The env.example in the repo documents every variable with a safe default. This guide covers the secrets you must set before first start (ENCRYPTION_KEY, JWT_SECRET_KEY, POSTGRES_PASSWORD) and the optional integrations: AI provider, networking news feeds, inbound/outbound webhooks, SMTP for user invites, and Telegram alerts.',
				capabilities: [
					'ENCRYPTION_KEY — AES-256 Fernet key for the credential vault; generate once, never change',
					'JWT_SECRET_KEY — signs JWT access and refresh tokens',
					'LLM_BASE_URL / LLM_API_KEY / LLM_MODEL — AI provider; any OpenAI-compatible endpoint',
					'POSTGRES_USER / POSTGRES_PASSWORD / POSTGRES_DB — PostgreSQL credentials',
					'WEBHOOK_SECRET — shared secret for inbound webhook (AI incident logs)',
					'CURRENTS_API_KEY / GNEWS_API_KEY — networking news sources (NVD needs none)',
					'SMTP_* and TELEGRAM_* — optional user-invite email and alert delivery'
				],
				tables: [
					{
						title: 'Required before first start',
						headers: ['Variable', 'Purpose'],
						rows: [
							['ENCRYPTION_KEY', 'Fernet (AES-256) key for the credential vault'],
							['JWT_SECRET_KEY', 'HMAC key signing JWT access + refresh tokens'],
							['POSTGRES_PASSWORD', 'PostgreSQL password (also POSTGRES_USER / POSTGRES_DB)']
						]
					},
					{
						title: 'Optional integrations',
						headers: ['Variable', 'Enables'],
						rows: [
							['LLM_BASE_URL / LLM_API_KEY / LLM_MODEL', 'AI agent, diagnostics, incidents'],
							['WEBHOOK_SECRET', 'Inbound webhook for AI incident logs'],
							['CURRENTS_API_KEY / GNEWS_API_KEY', 'Networking news feed (extra sources)'],
							['SMTP_HOST / SMTP_USERNAME / SMTP_PASSWORD', 'User invitation emails'],
							['TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID', 'Telegram alert delivery'],
							['FIRMWARE_STORAGE_PATH', 'Where uploaded firmware images are stored'],
							['CF_API_TOKEN', 'Caddy DNS challenge for automatic TLS']
						]
					}
				],
				howItWorks: [
					'Secrets (ENCRYPTION_KEY, JWT_SECRET_KEY, database password) are read at container startup and never exposed via the API.',
					'If ENCRYPTION_KEY is empty, Crux generates an EPHEMERAL key at startup — all stored secrets become unreadable on the next restart. Always set it.',
					'LLM configuration is read at inference time — you can also change the AI provider at runtime via /settings without restarting.',
					'SMTP enables invite emails; without it, invitation links are still generated and shown in the UI, just not emailed.',
					'Missing news API keys degrade gracefully — NVD (key-free) always returns.'
				],
				steps: [
					'Generate ENCRYPTION_KEY (Fernet) and paste it into .env — store it securely; changing it later orphans all vault entries.',
					'Generate JWT_SECRET_KEY and set a strong POSTGRES_PASSWORD.',
					'Choose an AI provider and set LLM_BASE_URL / LLM_API_KEY / LLM_MODEL (Groq, Ollama, or DeepSeek).',
					'Set WEBHOOK_SECRET if you will ingest device syslog into AI incident logs.',
					'Optionally add CURRENTS_API_KEY / GNEWS_API_KEY, SMTP_*, and TELEGRAM_* values.',
					'Save .env — it is gitignored; never commit it.'
				],
				commands: [
					{
						label: 'Generate ENCRYPTION_KEY (required)',
						code: `python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"`
					},
					{
						label: 'Generate JWT_SECRET_KEY and WEBHOOK_SECRET (required / optional)',
						code: `python -c "import secrets; print(secrets.token_hex(32))"`
					},
					{
						label: 'AI provider: Groq (default)',
						code: `LLM_BASE_URL=https://api.groq.com/openai/v1
LLM_API_KEY=gsk_your_groq_api_key
LLM_MODEL=llama-3.3-70b-versatile`
					},
					{
						label: 'AI provider: Ollama (fully local)',
						code: `LLM_BASE_URL=http://localhost:11434/v1
LLM_API_KEY=ollama
LLM_MODEL=llama3.2`
					},
					{
						label: 'Networking news sources (optional)',
						code: `CURRENTS_API_KEY=   # https://currentsapi.services/en/register
GNEWS_API_KEY=      # https://gnews.io/register
# NVD (CVEs) requires no key`
					},
					{
						label: 'Telegram alerts (optional)',
						code: `TELEGRAM_BOT_TOKEN=   # create via @BotFather
TELEGRAM_CHAT_ID=     # get via @userinfobot
# TELEGRAM_EVENTS is a JSON array of events to deliver`
					}
				],
				callouts: [
					{
						type: 'warning',
						text: 'If ENCRYPTION_KEY is left empty, Crux generates an ephemeral key on each start and every stored credential becomes unreadable after a restart. Set a permanent key before adding any credentials.'
					}
				],
				technicalNotes: [
					'ENCRYPTION_KEY must be a valid Fernet key (32 url-safe base64 bytes) — generate it, do not hand-craft it.',
					'Changing ENCRYPTION_KEY after data is stored orphans every vault entry; there is no automatic re-encryption.',
					'JWT access tokens default to 30 minutes (JWT_ACCESS_EXPIRE_MINUTES), refresh tokens to 7 days (JWT_REFRESH_EXPIRE_DAYS).',
					'DATABASE_URL and the Celery/Valkey URLs are assembled in compose.yaml — you set the Postgres credentials, not the full URL.',
					'.env is gitignored. For production, inject secrets via your orchestrator or a secrets manager.'
				],
				related: ['installation', 'production-deployment', 'security-model']
			}
		]
	},
	{
		key: 'concepts',
		label: 'Concepts & Guides',
		modules: [
			{
				slug: 'architecture',
				label: 'Architecture',
				icon: 'Boxes',
				description:
					'How the seven Crux services fit together — frontend, backend, workers, scheduler, trap receiver, database, and cache.',
				overview:
					'Crux is a containerized application of seven cooperating services on a single internal network. The SvelteKit frontend talks to a FastAPI backend over REST. Long-running work is offloaded to Celery workers, scheduled by Celery beat, with a standalone SNMP trap receiver feeding events in. PostgreSQL is the system of record and Valkey is the message broker, result backend, and cache.',
				capabilities: [
					'Frontend (SvelteKit) — the UI, served on host port 3000',
					'Backend (FastAPI) — REST API, auth, RBAC, and database access on port 8000',
					'Worker (Celery) — executes jobs, SNMP polls, and AI analysis tasks',
					'Beat (Celery) — dispatches cron-scheduled jobs and backups',
					'Trap receiver — listens on UDP 162 and feeds SNMP traps into the AI pipeline',
					'PostgreSQL 17 — system of record; Valkey 9 — broker, result backend, and cache'
				],
				diagram: {
					title: 'Service topology',
					ascii: `         browser
            │  :3000
       ┌────▼─────┐        REST :8000      ┌──────────┐
       │ frontend │ ─────────────────────▶ │ backend  │
       └──────────┘                        └────┬─────┘
                                                │
       ┌──────────┐   ┌──────────┐   ┌──────────▼─────┐
       │  worker  │   │   beat   │   │ trap-receiver  │  :162/udp
       └────┬─────┘   └────┬─────┘   └────────┬───────┘
            └──────────────┼──────────────────┘
                  ┌────────▼────────┐   ┌──────────┐
                  │  PostgreSQL 17  │   │ Valkey 9 │
                  └─────────────────┘   └──────────┘`
				},
				tables: [
					{
						title: 'Service responsibilities',
						headers: ['Service', 'Responsibility'],
						rows: [
							['frontend', 'SvelteKit UI (host port 3000)'],
							['backend', 'FastAPI REST API, auth, RBAC, DB access (port 8000)'],
							['worker', 'Celery — job execution, SNMP polling, AI analysis'],
							['beat', 'Celery — cron-scheduled jobs and backups'],
							['trap-receiver', 'SNMP trap listener on UDP 162 → AI incidents'],
							['postgres', 'PostgreSQL 17 — system of record'],
							['valkey', 'Valkey 9 — Celery broker/result backend + cache']
						]
					}
				],
				howItWorks: [
					'The browser loads the SvelteKit frontend, which calls the FastAPI backend over REST.',
					'The backend enforces authentication and RBAC, then reads/writes PostgreSQL.',
					'Work that should not block a request — job execution, SNMP polling, AI analysis — is queued to Valkey and run by Celery workers.',
					'Celery beat evaluates schedules and dispatches recurring jobs and backups.',
					'The trap receiver listens on UDP 162; incoming traps are parsed and handed to a Celery task that runs LLM analysis and writes an incident record.'
				],
				steps: [
					'Read this page to map each container to its job.',
					'See Installation for how compose.yaml wires these services together.',
					'See Security Model for how auth, the vault, and RBAC sit across the backend.',
					'See Job Lifecycle for how work flows from the API through the worker.'
				],
				technicalNotes: [
					'All services share an internal bridge network; only frontend (3000), backend (8000), and trap-receiver (162/udp) publish host ports.',
					'Valkey holds the Celery broker (db 1), result backend (db 2), and the JWT token blocklist.',
					'PostgreSQL tables are auto-created on first start; schema changes use manual migrations.',
					'Backend, worker, beat, and trap-receiver all run the same image with different entry commands.'
				],
				related: ['installation', 'job-lifecycle', 'security-model']
			},
			{
				slug: 'security-model',
				label: 'Security Model',
				icon: 'ShieldCheck',
				description:
					'How Crux protects secrets and gates access — AES-256 credential vault, policy-based RBAC, JWT sessions, and an immutable audit log.',
				overview:
					'Security in Crux rests on four pillars: an AES-256 (Fernet) credential vault that encrypts every secret at rest, a policy-based RBAC engine where deny beats allow, short-lived JWT sessions backed by a Valkey blocklist, and an append-only audit log that records every privileged action. Secrets are decrypted only inside the execution layer and never returned by the API.',
				capabilities: [
					'Credential vault — SSH passwords, keys, SNMP communities, and tokens encrypted with Fernet (AES-256)',
					'Secrets never leave the server — decrypted only in the execution layer, never returned by the API',
					'Policy-based RBAC — eight built-in roles plus custom roles, evaluated as (action, resource, effect)',
					'Deny beats allow — any matching deny policy rejects the request',
					'JWT sessions — 30-minute access tokens, 7-day refresh tokens, instant revocation via Valkey blocklist',
					'Immutable audit log — every privileged action recorded with actor, IP, and timestamp'
				],
				tables: [
					{
						title: 'The four pillars',
						headers: ['Pillar', 'Mechanism'],
						rows: [
							['Secret storage', 'Fernet (AES-256-CBC + HMAC-SHA256) via ENCRYPTION_KEY'],
							['Access control', 'Policy RBAC — (action, resource, effect), deny > allow'],
							['Sessions', 'JWT access + refresh, Valkey token blocklist on revoke'],
							['Accountability', 'Append-only audit log — no delete/update endpoint']
						]
					}
				],
				howItWorks: [
					'When a credential is saved, the secret is encrypted with a Fernet key derived from ENCRYPTION_KEY before it touches the database.',
					'When a job needs the secret, the execution layer decrypts it in-memory, uses it for the connection, then discards it — it is never logged or returned by the API.',
					'On each request the JWT is decoded, the user’s role resolved, and the combined policies evaluated; any matching deny rule blocks the request.',
					'Revoking a session or deactivating a user adds the token to a Valkey blocklist so subsequent requests fail immediately.',
					'Every sensitive operation writes an audit record before the response is returned.'
				],
				steps: [
					'Set a permanent ENCRYPTION_KEY before adding any credentials (see Configuration).',
					'Assign least-privilege roles to users from the Roles module.',
					'Use custom roles with explicit deny rules to fence off sensitive actions like job approval.',
					'Review the audit log periodically — denied actions are logged too.'
				],
				callouts: [
					{
						type: 'warning',
						text: 'ENCRYPTION_KEY is the root of the vault. If it is lost or changed, every stored secret becomes unrecoverable. Back it up securely and never rotate it without re-encrypting.'
					}
				],
				technicalNotes: [
					'Fernet = AES-256-CBC for confidentiality + HMAC-SHA256 for integrity.',
					'RBAC policies are (action, resource, effect) tuples; deny always wins over allow.',
					'JWT access tokens default to 30 minutes, refresh tokens to 7 days.',
					'The audit log has no delete or update endpoint — it is append-only by design.'
				],
				related: ['credentials', 'roles', 'audit-logs', 'configuration']
			},
			{
				slug: 'job-lifecycle',
				label: 'Job Lifecycle',
				icon: 'GitBranch',
				description:
					'How an automation task flows from creation through approval to execution — the state machine behind every device mutation.',
				overview:
					'Every mutation against a device in Crux is a job, and every job moves through a defined state machine. This guide explains each state, which job types require approval, and how the four-eyes principle keeps production changes safe. It is the conceptual companion to the Jobs module.',
				capabilities: [
					'Eight states from draft to a terminal succeeded, failed, or rejected',
					'Approval gate for sensitive job types — submitter cannot self-approve',
					'Autonomous types (backup, health_check) skip approval when whitelisted',
					'Per-device output capture for every execution',
					'Every state transition timestamped and auditable'
				],
				diagram: {
					title: 'State machine',
					ascii: `draft → queued → pending_approval → approved → running → succeeded
                                ↘ rejected            ↘ failed`
				},
				tables: [
					{
						title: 'States',
						headers: ['State', 'Meaning'],
						rows: [
							['draft', 'Created, not yet submitted'],
							['queued', 'Awaiting dispatcher pickup'],
							['pending_approval', 'Needs human sign-off'],
							['approved', 'Cleared for execution'],
							['running', 'Worker is executing'],
							['succeeded / failed', 'Terminal — finished cleanly or errored'],
							['rejected', 'Approver denied']
						]
					},
					{
						title: 'Approval by type',
						headers: ['Job type', 'Approval'],
						rows: [
							['config_push', 'Required'],
							['run_command', 'Required'],
							['firmware_upgrade', 'Required'],
							['backup', 'Auto (if whitelisted)'],
							['health_check', 'Auto (if whitelisted)']
						]
					}
				],
				howItWorks: [
					'A submitted job enters queued, or pending_approval for sensitive types.',
					'A second engineer approves it — the four-eyes principle blocks self-approval.',
					'A Celery worker dispatches the approved job and connects to each target device.',
					'Output and exit code are captured per device and the job reaches a terminal state.',
					'Every transition is timestamped and the approve/reject action is audited.'
				],
				steps: [
					'Create a job from the Jobs module or a template.',
					'For sensitive types, route it to an approver who is not the submitter.',
					'Watch the per-device output stream as the worker executes.',
					'Whitelist safe types in AUTONOMOUS_JOB_TYPES to skip the gate.'
				],
				technicalNotes: [
					'Auto-approved job types are controlled by the AUTONOMOUS_JOB_TYPES env var.',
					'Execution uses Netmiko (SSH) or NETCONF/RESTCONF depending on the device.',
					'A job may target many devices; each gets its own captured output and exit code.'
				],
				related: ['jobs', 'templates', 'audit-logs']
			},
			{
				slug: 'production-deployment',
				label: 'Production Deployment',
				icon: 'Server',
				commandsLabel: 'Commands',
				description:
					'Hardening Crux for real use — reverse proxy with automatic TLS, CORS, firewall, and database migrations.',
				overview:
					'A bare compose up is fine for evaluation, but production needs TLS, a trusted origin, and a migration discipline. Crux fronts the stack with Caddy for automatic HTTPS (via a Cloudflare DNS challenge), restricts CORS to your real domain, and applies schema changes through idempotent migration scripts rather than relying on table auto-creation.',
				capabilities: [
					'Caddy reverse proxy with automatic TLS via Cloudflare DNS challenge (CF_API_TOKEN)',
					'CORS locked to your real frontend origin (APP_CORS_ORIGINS)',
					'Frontend bound to 127.0.0.1 — only the proxy is exposed publicly',
					'Idempotent SQL migrations via scripts/migrate.py for existing installs',
					'Firewall rule for the SNMP trap receiver (UDP 162)'
				],
				prerequisites: [
					'A domain you control, with DNS managed by Cloudflare for the automatic TLS challenge.',
					'A Cloudflare API token scoped to edit the zone DNS (CF_API_TOKEN).',
					'The stack already running per the Installation guide.'
				],
				howItWorks: [
					'Caddy terminates TLS and reverse-proxies to the frontend and backend containers.',
					'It obtains and renews certificates automatically using a Cloudflare DNS-01 challenge authenticated by CF_API_TOKEN.',
					'APP_CORS_ORIGINS restricts which browser origins the backend will accept — set it to your real domain.',
					'metadata.create_all only adds missing tables; new columns on existing tables require running the matching scripts/migrate.py SQL files.',
					'Migrations are idempotent (IF NOT EXISTS) and support a --dry-run preview.'
				],
				steps: [
					'Point your domain’s DNS at the host and set CF_API_TOKEN in .env.',
					'Set APP_CORS_ORIGINS to your real frontend URL.',
					'Front the stack with Caddy (see the repo Caddyfile) for automatic HTTPS.',
					'Open UDP 162 on the host firewall for the trap receiver.',
					'When upgrading an existing install, run the relevant migrations with a dry-run first.'
				],
				commands: [
					{
						label: 'Preview and apply a schema migration',
						code: `cd backend
# Dry-run first to preview the statements
uv run python scripts/migrate.py scripts/<file>.sql --dry-run
# Apply (idempotent — safe to re-run)
uv run python scripts/migrate.py scripts/<file>.sql`
					},
					{
						label: 'Open the SNMP trap port on the host firewall',
						code: `firewall-cmd --add-port=162/udp --permanent
firewall-cmd --reload`
					},
					{
						label: 'CORS + TLS env values',
						code: `APP_CORS_ORIGINS=["https://login.crux.watch"]
FRONTEND_BASE_URL=https://login.crux.watch
CF_API_TOKEN=   # Cloudflare → API Tokens → Edit zone DNS`
					}
				],
				callouts: [
					{
						type: 'warning',
						text: 'metadata.create_all does NOT alter existing tables. On an upgrade, a missing-column error means a migration has not been applied — match the column to a scripts/migrate.py file and run it.'
					}
				],
				technicalNotes: [
					'Migration scripts are idempotent (ADD COLUMN IF NOT EXISTS / CREATE INDEX IF NOT EXISTS).',
					'The frontend container binds to 127.0.0.1:3000 — public access should go through the reverse proxy only.',
					'Persistent volumes pgdata, valkeydata, firmwaredata survive restarts; back them up.'
				],
				related: ['installation', 'configuration', 'troubleshooting']
			},
			{
				slug: 'troubleshooting',
				label: 'Troubleshooting',
				icon: 'Wrench',
				description:
					'Common setup problems and their fixes — most issues are device-side config or a missing env var, not a platform bug.',
				overview:
					'When something in Crux "just doesn’t work," the cause is almost always one of three things: a missing or empty env var, a device-side service or firewall blocking traffic, or a stale browser cache. This guide collects the most frequent symptoms across SNMP, credentials, auth, webhooks, Celery, and the console with their root causes and fixes.',
				capabilities: [
					'SNMP timeouts — service disabled, community mismatch, ACL, or UDP 161 blocked',
					'Credentials disappearing after restart — empty ENCRYPTION_KEY',
					'Auth 401s — wrong token, expired token, or malformed Authorization header',
					'Inbound webhook 401 — empty WEBHOOK_SECRET',
					'Jobs stuck in queued — Celery worker not running',
					'Console keystrokes not appearing — terminal focus or zero-size xterm'
				],
				troubleshooting: [
					{
						problem: 'No SNMP response / blank metrics.',
						cause:
							'SNMP disabled on the device, the community does not match the credential username, a source-IP ACL is blocking the backend, or UDP 161 is unreachable.',
						fix: 'Enable SNMP on the device, align the community with the credential’s username field, widen the SNMP ACL to allow the backend host, and confirm snmpget works from the backend.'
					},
					{
						problem: 'Credentials disappear after a restart.',
						cause:
							'ENCRYPTION_KEY is empty, so Crux generated an ephemeral key that changes each start.',
						fix: 'Generate a permanent Fernet key, set ENCRYPTION_KEY in .env, restart, and recreate the lost credentials.'
					},
					{
						problem: '"Invalid or expired token" calling the API.',
						cause:
							'Using the refresh_token instead of access_token, an expired token, or a malformed header.',
						fix: 'Send the access_token as exactly "Authorization: Bearer <token>" and re-login if it expired (30-minute default).'
					},
					{
						problem: '401 on the inbound webhook (POST /webhooks/logs).',
						cause: 'WEBHOOK_SECRET is empty, so the endpoint rejects everything.',
						fix: 'Set WEBHOOK_SECRET in .env, restart, and send the same value as the X-Webhook-Secret header.'
					},
					{
						problem: 'Jobs stay in queued forever.',
						cause: 'The Celery worker is not running.',
						fix: 'Start the worker container (it is part of compose); for dev, run make worker, and make beat for scheduled backups.'
					},
					{
						problem: 'Console shows a terminal but typing does nothing.',
						cause:
							'The terminal is not focused, the xterm rendered with zero size, or the device mode is not echoing.',
						fix: 'Click inside the terminal area; the current version delays fit() via requestAnimationFrame to avoid the zero-size case.'
					}
				],
				howItWorks: [
					'Read the backend terminal logs first — Python tracebacks land there.',
					'Check the browser Network tab for the actual URL, status, and response.',
					'Verify .env — missing or empty secrets are the single most common cause.',
					'Check the device side — Crux can only work with what the device allows.'
				],
				steps: [
					'Reproduce the issue and capture the backend log line and the failing request.',
					'Match the symptom to an entry above and apply the fix.',
					'If it persists, confirm the relevant env var is set and the device service is enabled.',
					'Only after these checks should you suspect a Crux code bug.'
				],
				faq: [
					{
						q: 'My code changes don’t appear in the browser.',
						a: 'Vite or the browser is serving stale JS. Hard refresh (Ctrl+Shift+R), try an incognito window, or clear the Vite cache (rm -rf .svelte-kit node_modules/.vite) and restart.'
					}
				],
				technicalNotes: [
					'Most perceived bugs are a missing env var, a device firewall/ACL, a disabled device service, or a stale browser cache.',
					'metadata.create_all only creates missing tables — a missing-column error means an unapplied migration.',
					'The trap receiver needs UDP 162 reachable; SNMP polling needs UDP 161 reachable from the backend.'
				],
				related: ['installation', 'configuration', 'production-deployment']
			},
			{
				slug: 'glossary',
				label: 'Glossary',
				icon: 'BookA',
				description: 'Key terms used across Crux and its documentation.',
				overview:
					'A quick reference for the recurring terms, technologies, and acronyms used throughout Crux and these docs — from Fernet and Celery to MoP and LLDP.',
				capabilities: [
					'Platform terms — job, template, vault, audit log, incident',
					'Technologies — Fernet, Celery, Valkey, Netmiko, SNMP, LLDP',
					'Acronyms — RBAC, IPAM, MoP, SSE, CVE'
				],
				tables: [
					{
						title: 'Terms',
						headers: ['Term', 'Meaning'],
						rows: [
							[
								'SNMP',
								'Simple Network Management Protocol — polls device metrics and receives traps'
							],
							['SNMP trap', 'An unsolicited event a device sends to Crux (e.g. interface down)'],
							[
								'Fernet',
								'Symmetric encryption (AES-256-CBC + HMAC-SHA256) used by the credential vault'
							],
							[
								'Celery',
								'Distributed task queue running background jobs; beat schedules recurring ones'
							],
							[
								'Valkey',
								'Redis-compatible store used as the Celery broker, result backend, and cache'
							],
							['Netmiko', 'Python library for multi-vendor SSH device automation'],
							['LLDP', 'Link Layer Discovery Protocol — neighbor data used to build topology'],
							['RBAC', 'Role-Based Access Control — permissions resolved from a user’s role'],
							['IPAM', 'IP Address Management — subnet and address tracking'],
							['MoP', 'Method of Procedure — a structured network change document'],
							['SSE', 'Server-Sent Events — server pushes streamed tokens to the browser'],
							['CVE', 'Common Vulnerabilities and Exposures — a catalogued security flaw']
						]
					}
				],
				howItWorks: [
					'Terms link back to the modules that use them — follow the related links to see each in context.'
				],
				steps: [
					'Use this page as a reference while reading the module docs.',
					'Follow related links to the module where each concept is applied.'
				],
				technicalNotes: [
					'This glossary covers terms specific to Crux usage; vendor CLI syntax is documented per module.'
				],
				related: ['architecture', 'security-model', 'job-lifecycle']
			}
		]
	},
	{
		key: 'resources',
		label: 'Resources',
		modules: [
			{
				slug: 'devices',
				label: 'Devices',
				icon: 'Server',
				appRoute: '/devices',
				apiBase: '/api/v1/devices',
				access: 'Admin, Network Operator, Network Engineer, NOC Operator (view)',
				troubleshooting: [
					{
						problem: 'Probe failed: auth error.',
						cause: 'The linked credential username or password is wrong.',
						fix: 'Open the credential and verify the username/password; test it with Live Test before re-probing.'
					},
					{
						problem: 'Probe failed: timeout.',
						cause:
							'The management IP is unreachable, the port is closed, or a firewall is blocking it.',
						fix: 'Confirm the IP and port are reachable from the backend host and that no ACL blocks the connection.'
					},
					{
						problem: 'Wrong OS detected.',
						cause: 'Auto-detection is not always right for every platform.',
						fix: 'Set the platform field manually on the device record.'
					}
				],
				related: ['credentials', 'inventory', 'jobs', 'monitoring', 'logs'],
				description:
					'Central registry of all managed network devices with multi-protocol support and live SSH console.',
				overview:
					'Devices is the central registry for every network endpoint managed by Crux. Each device record stores its IP address, vendor, platform, preferred connection protocol, and a reference to its encrypted credential. From a device record you can open a live SSH console, view real-time SNMP metrics, trigger on-demand connectivity probes, and launch automation jobs — all without leaving the browser.',
				capabilities: [
					'Add, edit, and remove network devices from the managed inventory',
					'View per-device detail: interfaces, uptime, SNMP metrics, and job history',
					'Open a live SSH console session directly from the browser via xterm.js',
					'Link devices to encrypted credentials stored in the credential vault',
					'Probe connectivity on demand — SSH, NETCONF, TELNET, SNMP, and RESTCONF',
					'Filter and search across all managed devices by vendor, status, or IP'
				],
				howItWorks: [
					'Device metadata (IP, vendor, platform, protocol preference) is stored in PostgreSQL.',
					'When a job runs, Crux resolves the linked credential from the vault, decrypts it in-memory, and opens a connection using the configured protocol.',
					'SNMP metrics are collected separately by a Celery worker and stored as time-series rows, then streamed to the browser via WebSocket for live chart updates.',
					'The live SSH console streams terminal I/O between the browser (xterm.js) and the device over a WebSocket connection — no plaintext credentials ever leave the server.'
				],
				steps: [
					'Navigate to /devices and click Add Device.',
					'Enter the device IP, hostname, vendor (MikroTik), platform (routeros), and preferred protocol (SSH).',
					'Link an existing credential from the vault, or create one inline.',
					'Click Probe to verify connectivity — Crux opens a test connection and reports the result.',
					'Once added, click the device row to open its detail view: interfaces, SNMP charts, and the live SSH console.'
				],
				commands: [
					{
						label: 'Enable SSH Service',
						code: `/ip service set ssh disabled=no port=22
/ip service print where name=ssh`
					},
					{
						label: 'Create Crux Management User',
						code: `/user add name=crux-admin password="ChangeMeNow!" group=full comment="Crux automation account"
/user print where name=crux-admin`
					},
					{
						label: 'Restrict SSH Access to Crux Server Only',
						code: `/ip service set ssh address=<crux-server-ip>/32
/ip service print where name=ssh`
					}
				],
				technicalNotes: [
					'Supported protocols: SSH (Netmiko), NETCONF (ncclient), TELNET (asyncssh), RESTCONF (httpx).',
					'Credentials are never returned by the API — they are decrypted only inside the job execution layer and discarded immediately after.',
					'SSH console sessions run over WebSocket; multiple users can open concurrent sessions on the same device.',
					'SNMP interface names (ifDescr) are cached in the interface_names table so human-readable names persist across backend restarts.'
				]
			},
			{
				slug: 'inventory',
				label: 'Inventory',
				icon: 'Layers',
				appRoute: '/inventory',
				apiBase: '/api/v1/devices',
				access: 'Admin, Network Operator, Network Engineer, NOC Operator, Read-Only Viewer',
				description:
					'Bulk catalog view of all registered devices with filtering, grouping, and YAML/CSV import-export.',
				overview:
					'Inventory is a high-level overview across the whole device fleet. It differs from Devices in that it emphasizes operations on many devices at once — filtering by vendor, platform, or location tags, and bulk import/export. Use it to onboard a new site with many devices in one paste, or to export the entire catalog for backup or migration.',
				capabilities: [
					'Sortable list of every registered device, with grouped and location-aware views',
					'Filter by vendor, platform, protocol, or tags',
					'Search by hostname or IP substring',
					'Bulk add via YAML or CSV import',
					'Export the catalog as YAML or CSV for backup or migration',
					'Click through to any individual device detail page'
				],
				howItWorks: [
					'Inventory reads the same device records as the Devices module but presents them as a fleet-wide catalog.',
					'Views can be switched between a flat list, grouped by vendor or platform, or location-aware when location tags are set.',
					'On import, Crux parses the YAML/CSV and creates a device record for each entry.',
					'Credentials are NOT imported through bulk add — they are added separately per device or via an API key script.'
				],
				tables: [
					{
						title: 'Views',
						headers: ['View', 'Description'],
						rows: [
							['List', 'Sortable table of all devices'],
							['Grouped', 'Organized by vendor or platform'],
							['Location-aware', 'Grouped by location tag, when tags are set']
						]
					}
				],
				steps: [
					'Navigate to /inventory to see the full device catalog.',
					'Use the filter and search controls to narrow by vendor, platform, or hostname.',
					'To bulk onboard, click Import and paste or upload a YAML/CSV device list.',
					'Add credentials separately per device — bulk import does not include secrets.',
					'Export the catalog to YAML/CSV at any time for backup or migration.'
				],
				commands: [
					{
						label: 'YAML import format',
						code: `devices:
  - hostname: CORE-01
    ip_address: 10.0.0.1
    vendor: cisco
    platform: ios
    protocol: ssh
    port: 22`
					}
				],
				commandsLabel: 'Import Format',
				callouts: [
					{
						type: 'note',
						text: 'Credentials are never imported via bulk add — add them per device in the vault, or script them through an API key. This is a deliberate safety default.'
					}
				],
				technicalNotes: [
					'Inventory and Devices share the same underlying device records — changes in one are reflected in the other.',
					'Import accepts YAML or CSV; export produces the same formats for round-trip migration.',
					'Bulk import creates device records only — credential material is excluded by design.'
				],
				faq: [
					{
						q: 'How is Inventory different from Devices?',
						a: 'Devices is for managing a single endpoint in depth (console, probe, detail). Inventory is the fleet-wide catalog optimized for filtering, grouping, and bulk import/export across many devices.'
					}
				],
				related: ['devices', 'credentials']
			},
			{
				slug: 'credentials',
				label: 'Credentials',
				icon: 'KeyRound',
				appRoute: '/credentials',
				apiBase: '/api/v1/devices/{id}/credentials',
				access: 'Admin, Network Engineer',
				callouts: [
					{
						type: 'warning',
						text: 'If ENCRYPTION_KEY is unset, Crux generates an ephemeral key at startup and every stored credential becomes unreadable on the next restart. Always set a permanent key in production.'
					},
					{
						type: 'note',
						text: "The username field doubles as the SNMP community string — set it to the device's configured community (e.g. crux-readonly) for Monitoring to poll it."
					}
				],
				tables: [
					{
						title: 'Credential fields',
						headers: ['Field', 'Purpose'],
						rows: [
							['username', 'SSH/NETCONF user, or SNMP community when used via SNMP'],
							['password', 'Primary auth secret (encrypted)'],
							['enable_secret', 'Cisco enable-mode password (encrypted, optional)'],
							['ssh_key', 'Private key for key-based auth (encrypted, optional)'],
							['is_default', 'Use this credential when multiple exist']
						]
					}
				],
				related: ['devices', 'settings', 'audit-logs', 'security-model'],
				description:
					'AES-256 encrypted vault for SSH passwords, SSH private keys, SNMP community strings, and API tokens.',
				overview:
					'The Credentials vault stores every secret that Crux needs to connect to your devices — SSH passwords, SSH private keys, SNMP community strings, and API tokens. All values are encrypted at rest using AES-256 (Fernet) before they are written to the database. Secrets are decrypted only inside the job execution layer and are never exposed through the API or written to logs.',
				capabilities: [
					'Store SSH passwords, SSH private keys, SNMP community strings, and API tokens',
					'All secrets encrypted at rest with AES-256 (Fernet) before storage',
					'Secrets are never returned by the API — detail endpoints return masked placeholders only',
					'Live connection test — validate a credential against a device without revealing the secret',
					'Assign credentials to one or more devices for use in automation jobs',
					'Optional rotation tracking — set rotation_days to be alerted when renewal is due'
				],
				howItWorks: [
					'When you save a credential, Crux encrypts the secret with a Fernet key derived from ENCRYPTION_KEY before writing it to the database.',
					'When a job needs the credential, the execution layer decrypts it in-memory. The plaintext value is never logged, never returned by the API, and is discarded after the connection closes.',
					'The Live Test feature opens a real connection to the linked device and reports success or failure — the secret is used for the connection but never sent to the client.'
				],
				steps: [
					'Navigate to /credentials and click Add Credential.',
					'Select SSH Password as the credential type.',
					'Enter the username (e.g. crux-admin) and password.',
					'Assign the credential to one or more MikroTik devices.',
					'Use Live Test to validate the credential before using it in jobs.'
				],
				commands: [
					{
						label: 'Create Read-Write Account (for job execution)',
						code: `/user add name=crux password="ChangeMeNow!" group=full comment="Crux job execution account"`
					},
					{
						label: 'Create Read-Only Account (for monitoring)',
						code: `/user add name=crux-ro password="ReadOnly123!" group=read comment="Crux monitoring account"`
					},
					{
						label: 'Verify User Configuration',
						code: `/user print detail where name=crux or name=crux-ro
/user group print`
					}
				],
				technicalNotes: [
					'Encryption: Fernet (AES-256-CBC + HMAC-SHA256) with a base64-encoded key set via the ENCRYPTION_KEY environment variable.',
					'The API never returns the plaintext secret — detail endpoints return masked values only.',
					'SSH private keys are stored encrypted; the key material is decrypted in-memory only when Netmiko opens the SSH session.',
					'Changing ENCRYPTION_KEY requires re-encrypting all existing credential records — back up the key before rotation.'
				]
			},
			{
				slug: 'ipam',
				label: 'IPAM',
				icon: 'MapPin',
				appRoute: '/ipam',
				apiBase: '/api/v1/ipam/subnets, /api/v1/ipam/addresses',
				access: 'Admin, Network Engineer',
				tables: [
					{
						title: 'Subnet fields',
						headers: ['Field', 'Purpose'],
						rows: [
							['cidr', 'CIDR notation (e.g. 10.0.0.0/24)'],
							['vlan_id', 'Optional VLAN number'],
							['site', 'Location tag (DC-A, BRANCH-3, etc.)'],
							['role', 'Purpose tag (mgmt, wan, guest-wifi)']
						]
					},
					{
						title: 'Address fields',
						headers: ['Field', 'Purpose'],
						rows: [
							['ip_address', 'Single IP in dotted notation'],
							['subnet_id', 'Parent subnet'],
							['hostname', 'Hostname of the assigned device/host'],
							['status', 'active, reserved, or free'],
							['device_id', 'Link to a managed device (optional)']
						]
					}
				],
				related: ['devices', 'inventory'],
				description:
					'IP Address Management — subnet allocation, VLAN tracking, and IP conflict detection.',
				overview:
					'IPAM (IP Address Management) provides a structured registry for all subnets and IP allocations across your network. It prevents address conflicts, tracks VLAN assignments per subnet, and gives you a visual overview of utilization across every address space. IPAM is a documentation layer — it records intended allocations rather than auto-discovering them from device ARP tables.',
				capabilities: [
					'Define and manage IP subnets in CIDR notation (IPv4 and IPv6)',
					'Register individual IP addresses within subnets and link them to devices',
					'Track VLAN assignments per subnet',
					'Detect and flag IP conflicts across all managed address spaces',
					'Visual subnet utilization overview — allocated vs. available host addresses'
				],
				howItWorks: [
					'You define subnets (CIDR notation) and optionally assign them a VLAN tag and description.',
					'Individual IP addresses are registered within a subnet and can be linked to a specific device or interface.',
					'Conflict detection runs at write time — any attempt to assign an already-used address within the same subnet is rejected.',
					'Utilization is calculated from the number of allocated addresses vs. the total available host count in the subnet.'
				],
				steps: [
					'Navigate to /ipam and click Add Subnet.',
					'Enter the subnet CIDR (e.g. 192.168.1.0/24) and optionally a VLAN tag and description.',
					'Inside the subnet view, click Assign IP to register an individual address and link it to a device.',
					'View the utilization bar to see how many addresses have been allocated.',
					'Resolve any conflict alerts when duplicate addresses are detected.'
				],
				commands: [
					{
						label: 'Print All Assigned IP Addresses',
						code: `/ip address print detail`
					},
					{
						label: 'Print IP Pools (DHCP)',
						code: `/ip pool print detail`
					},
					{
						label: 'Export ARP Table for IP Discovery',
						code: `/ip arp print
/ip dhcp-server lease print`
					},
					{
						label: 'Print VLAN Interface Assignments',
						code: `/interface vlan print detail`
					}
				],
				technicalNotes: [
					'Supports both IPv4 and IPv6 subnets.',
					'Conflict detection is enforced at the application layer on every write — duplicate addresses within the same subnet return a validation error.',
					'VLAN tracking is informational — IPAM does not configure VLANs on devices; it is a documentation and planning layer.',
					'IPAM data is manually maintained — it is not auto-synced from device ARP tables or routing tables.'
				]
			},
			{
				slug: 'firmware',
				label: 'Firmware',
				icon: 'HardDrive',
				appRoute: '/firmware',
				apiBase: '/api/v1/firmware',
				access: 'Admin, Network Engineer',
				callouts: [
					{
						type: 'note',
						text: 'Only image metadata (filename, vendor, version, checksum, size) lives in the database — the binary itself is stored on disk at FIRMWARE_STORAGE_PATH (default /data/firmware).'
					}
				],
				related: ['jobs', 'mop-generator', 'devices'],
				description: 'Centralized firmware image repository with SHA-256 integrity verification.',
				overview:
					'Firmware is a centralized image repository for storing, versioning, and distributing firmware files to your network devices. Every uploaded file is verified against its SHA-256 checksum server-side at upload time, ensuring integrity before the image is stored. Distribution to devices is handled through automation jobs.',
				capabilities: [
					'Upload and version firmware images for any vendor or platform',
					'SHA-256 checksum verified server-side at upload — mismatches abort the upload',
					'Browse the firmware library by vendor, version, and upload date',
					'Distribute firmware to devices via automation jobs',
					'Track which firmware version is assigned to each device'
				],
				howItWorks: [
					'You upload a firmware image and provide the expected SHA-256 checksum alongside it.',
					'Crux computes the SHA-256 hash of the uploaded file server-side and compares it to your provided value — a mismatch aborts the upload and no file is saved.',
					'Verified images are stored on the server filesystem and listed in the firmware library with vendor, version, file size, and upload metadata.',
					'Deployment is done through automation jobs — you select a firmware image and target device, and Crux handles the transfer using the appropriate protocol.'
				],
				steps: [
					'Navigate to /firmware and click Upload Image.',
					'Select the RouterOS .npk file and enter the version and expected SHA-256 checksum.',
					'Crux verifies the checksum on the server. If it matches, the image is saved.',
					'Create a job to push the firmware to the target MikroTik device.',
					'The device will install the package and require a reboot to apply.'
				],
				commands: [
					{
						label: 'Check Current RouterOS Version',
						code: `/system package print
/system routerboard print`
					},
					{
						label: 'Fetch RouterOS Package Directly on Device',
						code: `/tool fetch url="https://download.mikrotik.com/routeros/7.14/routeros-7.14.npk" dst-path="routeros-7.14.npk"`
					},
					{
						label: 'Install Downloaded Package',
						code: `/system package install routeros-7.14.npk`
					},
					{
						label: 'Schedule Reboot to Apply Package',
						code: `/system reboot`
					}
				],
				technicalNotes: [
					'SHA-256 is computed server-side at upload time; the client-provided hash is used only for comparison.',
					'Firmware images are stored on the server filesystem under the FIRMWARE_STORAGE_PATH environment variable.',
					'The library is vendor-agnostic — any vendor or binary file format can be uploaded.',
					'Actual deployment requires a compatible job template for the target device vendor and platform.',
					'There is no automatic purge policy — manage disk usage by manually removing obsolete images.'
				]
			}
		]
	},
	{
		key: 'monitoring',
		label: 'Monitoring',
		modules: [
			{
				slug: 'dashboard',
				label: 'Dashboard',
				icon: 'LayoutDashboard',
				appRoute: '/dashboard',
				apiBase: '/api/v1/dashboard',
				access: 'All authenticated roles',
				description:
					'Main platform overview — fleet health, active incidents, jobs-per-day charts, and recent activity at a glance.',
				overview:
					'The Dashboard is the landing view after login. It summarizes the state of the whole platform in one screen: a device health gauge, active incident count, a jobs-per-day chart, and a list of recent jobs with their status. It auto-refreshes so the picture stays current without manual reloads.',
				capabilities: [
					'Device health gauge — proportion of the fleet currently reachable',
					'Active incident count from the AI Incidents pipeline',
					'Jobs-per-day chart rendered as line, bar, area, sparkline, or donut',
					'Recent job list with live status indicators',
					'Auto-refresh every 30 seconds — no manual reload needed'
				],
				howItWorks: [
					'On load, the dashboard fetches aggregate counts and recent records from the backend.',
					'Charts are computed from job and incident history over a rolling window.',
					'A timer re-fetches the summary data every 30 seconds and re-renders the widgets.',
					'Each widget links through to its full module — jobs, incidents, or monitoring.'
				],
				steps: [
					'Log in — the Dashboard is the default landing page.',
					'Scan the health gauge and incident count for anything needing attention.',
					'Use the jobs-per-day chart to spot automation spikes or failures.',
					'Click any recent job to open its detail view.'
				],
				technicalNotes: [
					'All widgets auto-refresh on a 30-second interval.',
					'Chart data is aggregated server-side; the frontend only renders the returned series.',
					'The dashboard is read-only — it surfaces data from other modules but does not mutate anything.'
				],
				related: ['monitoring', 'jobs', 'ai-incidents'],
				faq: [
					{
						q: 'How often does the Dashboard update?',
						a: 'Every 30 seconds. A background timer re-fetches the summary data and re-renders the widgets without a full page reload.'
					}
				]
			},
			{
				slug: 'monitoring',
				label: 'SNMP Monitoring',
				icon: 'Activity',
				appRoute: '/monitoring',
				apiBase: '/api/v1/snmp',
				access: 'Admin, Network Engineer, NOC Operator, Read-Only Viewer',
				callouts: [
					{
						type: 'note',
						text: 'Monitoring refreshes every 60s from the browser, only while a device is selected and the tab is open. Click Poll Now for an on-demand refresh — there is no server-side periodic poll.'
					}
				],
				related: ['topology', 'ai-incidents', 'devices', 'dashboard'],
				description:
					'Real-time SNMP dashboard with per-device charts, interface stats, and live WebSocket updates.',
				overview:
					'The Monitoring module provides a real-time SNMP dashboard for all managed devices. Metrics including interface bandwidth, CPU utilization, memory usage, and system uptime are polled on a configurable interval and displayed as live charts. A dedicated trap receiver also listens for SNMP traps from your devices and feeds them into the AI Incidents pipeline automatically.',
				capabilities: [
					'Poll device metrics via SNMP v1, v2c, or v3 on a configurable interval',
					'Fleet-wide health summary: online/offline status, uptime, and top bandwidth consumers',
					'Per-device detail view with line, area, bar, and gauge charts',
					'Live chart updates via WebSocket — no manual refresh required',
					'Receive and display SNMP traps for interface-down events and threshold breaches',
					'Interface name resolution — human-readable ifDescr names cached across restarts'
				],
				howItWorks: [
					'A Celery Beat scheduler triggers SNMP polling tasks at the configured interval (default: 60 seconds).',
					'The Celery worker performs SNMP walks against each device, collecting interface stats, system OIDs (uptime, CPU, memory), and any custom OIDs configured.',
					'Collected metrics are stored as time-series rows in the snmp_metrics table and cached in Valkey.',
					'The browser receives live metric updates via WebSocket — charts refresh without a page reload.',
					'A separate trap receiver service listens on UDP port 162. On receiving a trap, it parses the OIDs and forwards the event to the AI Incidents pipeline for LLM analysis.'
				],
				steps: [
					'Run the MikroTik commands below to enable SNMP with a read-only community.',
					'Navigate to /settings in Crux and configure the SNMP community string, version (v2c), and polling interval.',
					'Open /monitoring to see the fleet-wide health summary.',
					'Click any device to open its detail view: per-interface bandwidth charts, CPU/memory graphs, and uptime.',
					'Configure SNMP traps on each device (see AI Incidents) to enable automatic incident detection.'
				],
				commands: [
					{
						label: 'Enable SNMP Service',
						code: `/snmp set enabled=yes contact="admin@example.com" location="Server Room"`
					},
					{
						label: 'Add Read-Only SNMP Community',
						code: `/snmp community add name=crux-snmp read-access=yes write-access=no addresses=<crux-server-ip>
/snmp community print`
					},
					{
						label: 'Verify SNMP Configuration',
						code: `/snmp print
/snmp community print`
					},
					{
						label: 'Check Interface OIDs (for custom polling)',
						code: `/interface print detail
/interface ethernet print stats`
					}
				],
				technicalNotes: [
					'Supports SNMP v1, v2c, and v3 (with auth + priv for v3).',
					'The SNMP trap receiver runs as a separate container service on UDP port 162 — ensure this port is reachable from your devices.',
					'Interface name resolution uses a persistent cache (interface_names table) so human-readable names survive backend restarts.',
					'WebSocket stream: /api/v1/snmp/stream/:device_id — one stream per device per connected client.',
					'High-frequency polling will grow the snmp_metrics table rapidly — configure PostgreSQL retention or partitioning accordingly.'
				]
			},
			{
				slug: 'topology',
				label: 'Topology',
				icon: 'Network',
				appRoute: '/topology',
				apiBase: '/api/v1/topology',
				access: 'All authenticated roles (view)',
				callouts: [
					{
						type: 'note',
						text: 'Topology only shows links between MANAGED devices, and only where LLDP/CDP is enabled. Unknown neighbors (printers, random hosts) are invisible, and Layer-3 IP adjacencies are not drawn.'
					}
				],
				related: ['devices', 'monitoring', 'visual-editor'],
				description:
					'Live network topology map built from LLDP/CDP discovery with link-status overlays.',
				overview:
					'Topology provides a live visual map of your network built from LLDP and CDP neighbor discovery. It renders every managed device as a node on an interactive canvas, with edges representing physical links. Link status overlays from the latest SNMP poll show which connections are up or down at a glance. Discovery is triggered on demand and updates stream to the canvas in real time.',
				capabilities: [
					'Discover network topology via LLDP neighbor data from all managed devices',
					'Interactive SvelteFlow canvas — pan, zoom, and drag nodes',
					'Link status overlays — instantly see which connections are up or down',
					'Click any node to inspect device details: IP, vendor, platform, and connected interfaces',
					'Real-time discovery updates via WebSocket — nodes appear as they are discovered',
					'Topology links persisted in the database — canvas reloads without re-running discovery'
				],
				howItWorks: [
					'Crux issues LLDP neighbor print commands to each managed device via SSH.',
					'Neighbor data (device name, local port, remote port, remote IP) is parsed and stored as topology_links rows in PostgreSQL.',
					'The SvelteFlow canvas renders devices as nodes and links as edges. Edge colors reflect the link state from the latest SNMP poll.',
					'A WebSocket connection streams topology updates to the browser in real time as discovery progresses.'
				],
				steps: [
					'Run the MikroTik commands below to enable neighbor discovery on all interfaces.',
					'Navigate to /topology and click Discover to trigger a fresh LLDP scan.',
					'Watch the canvas as nodes appear — the WebSocket streams each discovered link in real time.',
					'Click any node to see device details: IP, vendor, platform, and interface list.',
					'Link colors indicate status: green = up, red = down, gray = unknown.'
				],
				commands: [
					{
						label: 'Enable LLDP Neighbor Discovery on All Interfaces',
						code: `/ip neighbor discovery-settings set discover-interface-list=all`
					},
					{
						label: 'Print All Discovered Neighbors',
						code: `/ip neighbor print detail`
					},
					{
						label: 'Filter Neighbors by Interface',
						code: `/ip neighbor print where interface=ether1`
					},
					{
						label: 'Verify Discovery is Active',
						code: `/ip neighbor discovery-settings print`
					}
				],
				technicalNotes: [
					'Discovery requires SSH access to each device — credentials must be configured in the vault.',
					'MikroTik uses its own neighbor discovery protocol (MNDP) which is LLDP-compatible. Crux reads /ip neighbor output.',
					'Topology links are stored in the topology_links table and reused on subsequent page loads.',
					'The canvas is built with @xyflow/svelte (SvelteFlow) — node positions can be rearranged and are preserved in the session.',
					'Devices not reachable during discovery will not appear as neighbors, even if physical links exist.'
				]
			},
			{
				slug: 'logs',
				label: 'Device Logs',
				icon: 'ScrollText',
				appRoute: '/logs',
				apiBase: 'GET /api/v1/devices/{id}/logs',
				access: 'Admin, Network Engineer, NOC Operator, Security Auditor',
				description:
					'Live SSH fetch of on-device logs — per-vendor command executed on demand and streamed to the UI.',
				overview:
					"Device Logs lets you view what a device itself has logged — syslog buffers, authentication events, interface flaps — without SSHing in manually. Crux runs the right per-vendor log command based on the device's platform field, fetches the output live over SSH, and renders it in a terminal-style pane with line numbers and search.",
				capabilities: [
					"Fetch on-device logs live over SSH using the device's stored credential",
					'Automatic per-vendor command selection based on the platform field',
					'Terminal-style rendering with line numbers',
					'Client-side search to filter visible lines',
					'Pull model — you trigger each fetch on demand'
				],
				prerequisites: [
					'The device must be registered with a linked credential that can reach it over SSH.'
				],
				tables: [
					{
						title: 'Vendor-specific commands',
						headers: ['Vendor', 'Command'],
						rows: [
							['Cisco IOS / IOS-XE', 'show logging'],
							['Cisco NX-OS', 'show logging'],
							['MikroTik RouterOS', '/log print'],
							['Juniper Junos', 'show log messages'],
							['Arista EOS', 'show logging']
						]
					},
					{
						title: 'Device Logs vs AI Incident Logs',
						headers: ['Device Logs', 'AI Incident Logs'],
						rows: [
							['Pull model — you trigger a fetch', 'Push model — device posts to webhook'],
							['On-demand only', 'Real-time stream'],
							['No analysis — raw text', 'LLM-analyzed, classified, stored'],
							['Use for troubleshooting', 'Use for continuous monitoring']
						]
					}
				],
				howItWorks: [
					'You select a device and click Fetch.',
					"Crux picks the correct log command from the device's platform field.",
					'It SSHes to the device using the stored credential and runs the command.',
					'The raw output streams back and renders in a terminal-style pane.'
				],
				steps: [
					'Go to /logs and select a device from the list.',
					'Click Fetch — Crux SSHes in and runs the vendor log command.',
					'Read the output in the terminal pane; use the search box to filter lines.',
					'Paste interesting lines into the AI Agent for analysis if needed.'
				],
				callouts: [
					{
						type: 'warning',
						text: 'Fetched logs are NOT cached — every click hits the device live. Avoid excessive fetches on devices with slow CPUs.'
					}
				],
				technicalNotes: [
					'The log command is selected automatically from the device platform field.',
					'No caching — each fetch is a live SSH session.',
					'Distinct from AI Incident Logs, which are event-driven and LLM-analyzed.'
				],
				faq: [
					{
						q: 'Why is fetching slow on some devices?',
						a: 'Logs are pulled live over SSH with no caching. On devices with slow CPUs or large log buffers the fetch takes longer — it is not a Crux delay.'
					}
				],
				related: ['ai-incidents', 'ai-agent', 'devices']
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
				apiBase: '/api/v1/ai/chat, /api/v1/ai/analyze',
				access: 'Admin, AI Analyst, Network Engineer',
				description:
					'On-demand log analysis and conversational assistant — paste device output, ask questions, get AI summaries and suggested fixes.',
				overview:
					'AI Agent speeds up incident triage. Instead of parsing 2000 lines of syslog manually, you let an LLM surface what looks abnormal, the probable root cause, the commands to run next, and suggested remediation. It works in two modes — free-form Chat with session memory, and one-shot Analyze that returns structured JSON.',
				capabilities: [
					'Chat mode — free-form conversation with memory of the current session',
					'Analyze mode — paste a log block, get structured JSON (summary, severity, anomaly flag, actions)',
					'Token-by-token streaming via Server-Sent Events so long answers feel fast',
					'Seeded with a network-aware system prompt (Cisco, MikroTik, Juniper, Arista)',
					'Privacy default — device inventory is not auto-injected; you pass data explicitly',
					'Works with any OpenAI-compatible provider via LLM_BASE_URL / LLM_API_KEY / LLM_MODEL'
				],
				tables: [
					{
						title: 'Two modes',
						headers: ['Mode', 'Use it for'],
						rows: [
							['Chat', 'Free-form Q&A with session memory — "Why is BGP flapping here?"'],
							['Analyze', 'One-shot structured analysis of a pasted log block, returned as JSON']
						]
					}
				],
				howItWorks: [
					'In Chat mode you converse with the LLM; it remembers the current session context.',
					'In Analyze mode you paste a log block and the LLM returns structured JSON: summary, severity, is_anomaly, and recommended_actions.',
					'Responses stream token-by-token via SSE so the UI renders progressively.',
					'The agent is seeded with a system prompt describing the platform and common vendors, and is told to cite specific log lines.',
					'Your real device inventory is NOT auto-injected — a privacy default. Pass device data explicitly in chat if you want it referenced.'
				],
				steps: [
					'Navigate to /ai-agent.',
					'For triage, switch to Analyze mode and paste a log block — read the structured result.',
					'For exploration, use Chat mode and ask follow-up questions about the output.',
					'Copy any suggested commands into a Job to act on the recommendation.'
				],
				commands: [
					{
						label: 'Analyze mode — structured JSON response',
						code: `{
  "summary": "...",
  "severity": "warning|high|critical",
  "is_anomaly": true,
  "recommended_actions": ["...", "..."]
}`
					}
				],
				commandsLabel: 'Response Shape',
				callouts: [
					{
						type: 'note',
						text: 'The agent does not automatically see your device inventory — this is a privacy default. If you want a specific device referenced, paste its data into the chat explicitly.'
					}
				],
				technicalNotes: [
					'Endpoints: /api/v1/ai/chat (conversational) and /api/v1/ai/analyze (one-shot).',
					'Streaming uses Server-Sent Events — tokens render as they arrive.',
					'Provider is configured via LLM_BASE_URL / LLM_API_KEY / LLM_MODEL — any OpenAI-compatible API.',
					'For fully local inference, point LLM_BASE_URL at an Ollama instance.'
				],
				faq: [
					{
						q: 'Does the AI Agent see my devices automatically?',
						a: 'No. Device inventory is not injected into the prompt by default for privacy. Paste the relevant device data into the chat if you want it considered.'
					},
					{
						q: 'How is this different from AI Diagnostics?',
						a: 'AI Agent is conversational and works on text you paste. AI Diagnostics is device-targeted — it collects live SNMP and syslog for a specific device automatically.'
					}
				],
				related: ['ai-incidents', 'mop-generator', 'logs']
			},
			{
				slug: 'ai-diagnostics',
				label: 'AI Diagnostics',
				icon: 'Bot',
				appRoute: '/ai-diagnostics',
				apiBase: '/api/v1/ai',
				access: 'Admin, AI Analyst, Network Engineer',
				related: ['ai-incidents', 'ai-agent', 'monitoring'],
				description:
					'On-demand fault analysis — trigger a diagnostic and receive root cause and remediation steps streamed in real time.',
				overview:
					'AI Diagnostics is an on-demand fault analysis tool. You select a device, trigger a diagnostic, and Crux collects current SNMP metrics, interface state, and recent syslog entries before sending them to an LLM for root-cause analysis. The result — root cause assessment plus step-by-step remediation — streams back to the browser in real time via Server-Sent Events.',
				capabilities: [
					'Trigger on-demand diagnostics for any managed device',
					'LLM analyzes live SNMP data, interface state, and syslog entries',
					'Root cause assessment plus step-by-step remediation steps',
					'Results stream token-by-token via SSE — no waiting for a full response',
					'Completed diagnostics saved automatically for future reference',
					'Compatible with any OpenAI-compatible provider: Groq, DeepSeek, Gemini, Ollama'
				],
				howItWorks: [
					'You trigger a diagnostic for a specific device. Crux collects SNMP metrics, interface state, and recent syslog entries for that device.',
					'The collected data is packaged into a structured prompt and sent to the configured LLM provider.',
					'The LLM response streams back to the browser via Server-Sent Events (SSE) — you see the analysis token-by-token as it is generated.',
					'Completed diagnostics are stored in the ai_analysis_logs table for future reference.'
				],
				steps: [
					'Ensure the MikroTik device has logging enabled (see commands below).',
					'Navigate to /ai-diagnostics and select the target device.',
					'Click Run Diagnostic — the browser opens a streaming panel.',
					'Review the root cause assessment and remediation suggestions as they stream in.',
					'Completed diagnostics are saved automatically — revisit them from the history list.'
				],
				commands: [
					{
						label: 'View System Logs (what Crux reads)',
						code: `/log print`
					},
					{
						label: 'Filter Logs by Severity',
						code: `/log print where topics~"error"
/log print where topics~"warning"
/log print where topics~"critical"`
					},
					{
						label: 'Check System Resource State',
						code: `/system resource print`
					},
					{
						label: 'Print Interface Status Summary',
						code: `/interface print detail
/interface ethernet print stats`
					},
					{
						label: 'Enable Remote Logging to Syslog (optional)',
						code: `/system logging action add name=syslog target=remote remote=<syslog-server-ip> remote-port=514
/system logging add topics=error,warning,critical action=syslog`
					}
				],
				technicalNotes: [
					'Distinct from AI Incidents: Diagnostics are user-triggered (on-demand); Incidents are event-driven (SNMP trap-triggered, automatic).',
					'Streaming uses SSE (Server-Sent Events) — a persistent HTTP connection where the server pushes tokens progressively.',
					'LLM context includes: device metadata, last SNMP poll data, interface state, and recent syslog lines.',
					'For full on-premise privacy, configure Ollama as the LLM provider — all inference runs locally on your server.',
					'Compatible providers: Groq (default), OpenAI, Azure OpenAI, DeepSeek, Google Gemini, and any Ollama model.'
				]
			},
			{
				slug: 'ai-incidents',
				label: 'AI Incidents',
				icon: 'ShieldAlert',
				appRoute: '/ai-incidents',
				apiBase: '/api/v1/webhooks/logs',
				access: 'Admin, AI Analyst, Security Auditor',
				callouts: [
					{
						type: 'note',
						text: 'Inbound webhook auth uses the WEBHOOK_SECRET shared secret sent as the X-Webhook-Secret header. When an incident is high/critical AND an anomaly, all admins get an in-app notification.'
					}
				],
				related: ['ai-agent', 'notifications', 'audit-logs', 'logs'],
				description:
					'Automated incident log — every SNMP trap analyzed by AI, with approval workflow and feedback loop.',
				overview:
					'AI Incidents is an automated incident log. Every SNMP trap received by the platform is automatically passed to the LLM for analysis, and the result is stored as an incident record. You can review the AI-generated summary, approve or reject the assessment, and give thumbs-up or thumbs-down feedback. Failed LLM calls are retried automatically, and a daily background task re-attempts any persistent failures.',
				capabilities: [
					'Every SNMP trap automatically passed to the LLM for root-cause analysis',
					'AI-generated incident summaries with severity score stored in a persistent log',
					'Thumbs up / thumbs down feedback loop per incident',
					'Approval workflow — assessments can be approved or rejected',
					'Automatic retry on LLM failure (up to 5 attempts with exponential backoff)',
					'Daily background task re-attempts all persistent failures'
				],
				howItWorks: [
					'The SNMP trap receiver service listens on UDP port 162. When a trap arrives, it is parsed and forwarded to a Celery analyze_log task.',
					'The task collects context (device metadata, trap OIDs, severity, recent SNMP metrics) and sends a structured prompt to the LLM.',
					'The LLM generates an incident summary: root cause, affected service, severity level, and recommended action.',
					'The result is stored in the ai_analysis_logs table and appears in the AI Incidents feed immediately.',
					'Failed LLM calls are retried up to 5 times. Persistent failures are re-attempted by a daily Celery Beat task.'
				],
				steps: [
					'Run the MikroTik commands below to configure SNMP traps pointing to the Crux server.',
					'Navigate to /ai-incidents to see the incident feed.',
					'Trigger a test by disabling and re-enabling an interface — a trap should appear within seconds.',
					'Click any incident to expand the full LLM-generated analysis.',
					'Use thumbs-up / thumbs-down to provide accuracy feedback on the assessment.'
				],
				commands: [
					{
						label: 'Configure SNMP Trap Destination',
						code: `/snmp set trap-target=<crux-server-ip> trap-community=crux-snmp trap-version=2`
					},
					{
						label: 'Enable Interface-State Trap Generators',
						code: `/snmp set trap-generators=interfaces`
					},
					{
						label: 'Verify Trap Configuration',
						code: `/snmp print`
					},
					{
						label: 'Test: Trigger an Interface-Down Trap',
						code: `/interface set ether2 disabled=yes
# wait 2-3 seconds, then re-enable
/interface set ether2 disabled=no`
					}
				],
				technicalNotes: [
					'Distinct from AI Diagnostics: Incidents are event-driven (SNMP trap-triggered, automatic); Diagnostics are user-triggered (on-demand).',
					'The SNMP trap receiver runs as a separate container service listening on UDP port 162.',
					'Retry policy: 5 attempts, exponential backoff. A daily Celery Beat task re-attempts all permanently failed analyses.',
					'Severity levels assigned by the LLM: critical, high, medium, low, info.',
					'Approval workflow actions (approve, reject) are recorded in the immutable audit log.'
				]
			},
			{
				slug: 'mop-generator',
				label: 'MoP Generator',
				icon: 'FileText',
				appRoute: '/mop-generator',
				apiBase: '/api/v1/ai/generate-mop (SSE stream)',
				access: 'Admin, Network Engineer, AI Analyst',
				related: ['mop-history', 'ai-agent', 'jobs'],
				description:
					'AI-generated Method of Procedure documents for network change management, exportable as .docx.',
				overview:
					"The MoP Generator creates structured Method of Procedure documents for network change management. You describe the planned change in plain language, select the affected devices, and Crux's AI generates a complete, professionally structured MoP document streamed to the browser in real time. The finished document can be exported as a .docx file with a branded header and footer.",
				capabilities: [
					'Generate structured MoP documents from a plain-language change description',
					'AI-assisted 14-section content: objective, prerequisites, CLI commands, rollback, sign-off, and more',
					'Output streams token-by-token via SSE — no waiting for a full response',
					'Select affected devices from your inventory to include device-specific CLI steps',
					'Export to .docx with structured headings and branded layout',
					'All generated MoPs saved automatically to MoP History'
				],
				howItWorks: [
					'You fill in the change description, affected devices, planned change window, and risk level.',
					'Crux assembles a structured prompt that includes your inputs and the metadata of the selected devices.',
					'The LLM generates a 14-section MoP document covering all required change management artifacts.',
					'The output streams to the browser via SSE. Once complete, you can review, copy, or export it.',
					'Exported .docx files are generated server-side using python-docx, with correct heading styles and structured content.'
				],
				steps: [
					'Navigate to /mop-generator.',
					'Enter a plain-language description of the planned change (e.g. "Replace failed uplink on core switch").',
					'Select the affected MikroTik devices from the inventory picker.',
					'Set the planned change window and risk level.',
					'Click Generate — the MoP streams to the screen. Review and click Export to download the .docx.'
				],
				commands: [
					{
						label: 'Example: Pre-change Verification Commands (included in MoP)',
						code: `/interface print detail
/ip address print
/ip route print
/system resource print`
					},
					{
						label: 'Example: Change Commands (generated in MoP)',
						code: `# Add new VLAN interface
/interface vlan add name=vlan100 vlan-id=100 interface=ether1

# Assign IP to new VLAN
/ip address add address=10.100.0.1/24 interface=vlan100

# Enable interface
/interface set vlan100 disabled=no`
					},
					{
						label: 'Example: Post-change Validation Commands (included in MoP)',
						code: `/interface print where name=vlan100
/ip address print where interface=vlan100
/ping 10.100.0.2 count=4`
					},
					{
						label: 'Example: Rollback Commands (generated in MoP)',
						code: `/interface set vlan100 disabled=yes
/ip address remove [find interface=vlan100]
/interface vlan remove vlan100`
					}
				],
				technicalNotes: [
					'MoP document structure (14 sections): Description, Prerequisites, Change Window, Affected Devices, Port Allocation, Dependency Matrix, Timeline, CLI Commands per device, Risk Assessment, Rollback Procedure, Validation Steps, Post-change Checks, Approvals, Sign-off.',
					'Streaming uses SSE — the document appears progressively, so large MoPs do not require waiting for a complete response.',
					'Rate limited at 60 requests per minute per authenticated user (enforced via Valkey sliding window).',
					'All generated MoPs are saved automatically to the mop_history table.',
					'.docx export is generated server-side using python-docx — no client-side libraries required.'
				]
			},
			{
				slug: 'mop-history',
				label: 'MoP History',
				icon: 'ClipboardList',
				appRoute: '/mop-history',
				apiBase: '/api/v1/ai/mop-documents',
				access: 'Admin, Network Engineer, AI Analyst',
				related: ['mop-generator', 'audit-logs'],
				description:
					'Archive of all generated MoP documents with full content retrieval and re-export.',
				overview:
					'MoP History is the archive of all Method of Procedure documents generated by the platform. Every MoP generated via the MoP Generator is automatically saved with its full content, creation timestamp, affected devices, and change window. You can browse, search, view, and re-export any historical MoP without needing to regenerate it.',
				capabilities: [
					'Browse all previously generated MoP documents in reverse chronological order',
					'Filter by date range or search by title',
					'View the full content of any historical MoP',
					'Re-export any historical MoP as a .docx file',
					'Records are immutable — change history integrity is preserved'
				],
				howItWorks: [
					'When a MoP is generated via the MoP Generator, its full content and metadata are automatically saved to the mop_history table.',
					'The history page lists all saved MoPs in reverse chronological order with title, creation timestamp, and affected device list.',
					'You can open any MoP to view its full content in the browser.',
					'Re-export generates a fresh .docx from the stored content — the output is identical to the original export.'
				],
				steps: [
					'Navigate to /mop-history.',
					'Browse the list or use the date filter or title search to find a specific document.',
					'Click a MoP row to open the full content viewer.',
					'Click Export to download the MoP as a .docx file.'
				],
				technicalNotes: [
					'MoP records are immutable — they cannot be edited after generation, preserving the integrity of change records.',
					'Stored metadata: title, affected devices, change window, generating user, creation timestamp, and full content (JSON).',
					'Re-export generates a fresh .docx from stored JSON — the output is structurally identical to the original.',
					'Records are retained indefinitely — there is no automatic expiry or purge policy.',
					'MoP History is append-only: generating a new MoP creates a new record, even for similar changes.'
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
				apiBase: '/api/v1/jobs',
				access: 'Admin (all), Network Engineer (create/approve), Network Operator (view)',
				description:
					'Async job execution engine — queue, approve, dispatch, and track any automation task that runs against network devices.',
				overview:
					'Jobs is the core execution engine for all automation in Crux. Every mutation against a production device — config push, command run, backup, or firmware upgrade — goes through the job system so it gets queued instead of blocking the UI, approved by a second engineer when policy requires, logged with full output for audit, and retried or rolled back on failure.',
				capabilities: [
					'Queue any automation task against one or many devices instead of blocking the UI',
					'Approval workflow with four-eyes principle — the submitter cannot approve their own job',
					'Full output capture — stdout, stderr, and exit code stored per target device',
					'Eight lifecycle states from draft to succeeded/failed/rejected, all timestamped',
					'Autonomous job types (backup, health_check) skip approval when whitelisted',
					'Every approval and rejection recorded in the immutable audit log'
				],
				prerequisites: [
					'At least one device registered in Devices with a linked credential.',
					'A credential in the vault that can reach the target device over SSH.',
					'For approval-gated types: a second user with the Network Engineer or Admin role.'
				],
				callouts: [
					{
						type: 'warning',
						text: 'Four-eyes principle is enforced: the engineer who submits a job cannot approve it. A second engineer or admin must sign off on sensitive job types.'
					},
					{
						type: 'tip',
						text: 'Add a job type to the AUTONOMOUS_JOB_TYPES env var to let it bypass approval — backup and health_check are auto-approved by default.'
					}
				],
				howItWorks: [
					'A job is created with a type (config_push, run_command, backup, etc.), a set of target devices, and parameters (a config snippet, command string, or template values).',
					'On submit the job enters queued, or pending_approval if its type requires sign-off.',
					'An authorized engineer reviews the params and target devices, then approves or rejects. The submitter cannot approve their own job.',
					'A Celery worker picks up approved jobs. For each device it loads credentials, connects via Netmiko (SSH) or a NETCONF/RESTCONF client, executes, and captures stdout/stderr.',
					'The job record is updated with per-device output and the final state — all transitions are timestamped.'
				],
				diagram: {
					title: 'Lifecycle',
					ascii: `draft → queued → pending_approval → approved → running → succeeded
                                ↘ rejected            ↘ failed`
				},
				tables: [
					{
						title: 'Job states',
						headers: ['State', 'Meaning'],
						rows: [
							['draft', 'Created, not yet submitted'],
							['queued', 'Awaiting dispatcher pickup'],
							['pending_approval', 'Needs human sign-off (sensitive job types)'],
							['approved', 'Cleared for execution'],
							['running', 'Worker is actively executing'],
							['succeeded', 'Finished cleanly'],
							['failed', 'Error occurred — output log has detail'],
							['rejected', 'Approver denied']
						]
					},
					{
						title: 'Job types',
						headers: ['Type', 'Purpose', 'Auto-approve?'],
						rows: [
							['config_push', 'Send a config snippet to one or more devices', 'No'],
							['run_command', 'Execute a vendor command, capture output', 'No'],
							['backup', 'Fetch running-config over SSH, store as text', 'Yes'],
							['health_check', 'SSH reachability + basic commands', 'Yes'],
							['firmware_upgrade', 'SCP image + install + reload', 'No']
						]
					}
				],
				steps: [
					'Navigate to /jobs and click New Job.',
					'Select a job template or write an inline script, then choose the target device(s).',
					'Set the parameters — config snippet, command string, or template values.',
					'Submit. The job enters queued, or pending_approval for sensitive types.',
					'A second engineer approves it; watch the per-device output stream in the job detail view.'
				],
				commands: [
					{
						label: 'Example: Run Command payload (MikroTik)',
						code: `/interface ethernet set ether1 speed=1Gbps-full-duplex auto-negotiation=no comment="Uplink to core"
/interface print where name=ether1`
					},
					{
						label: 'Example: Config Push payload (firewall)',
						code: `/ip firewall filter add chain=input protocol=tcp dst-port=22 src-address=10.0.0.0/8 action=accept comment="Allow SSH from internal"
/ip firewall filter add chain=input protocol=tcp dst-port=22 action=drop comment="Block all other SSH"
/ip firewall filter print`
					}
				],
				technicalNotes: [
					'Lifecycle states: draft, queued, pending_approval, approved, running, succeeded, failed, rejected.',
					'Job types: config_push, run_command, backup, health_check, firmware_upgrade.',
					'Auto-approved types are configured via the AUTONOMOUS_JOB_TYPES environment variable.',
					'Execution is handled by Celery workers connecting over Netmiko (SSH) or NETCONF/RESTCONF.',
					'Every approval and rejection is written to the audit log with actor, timestamp, and job reference.',
					'Each job row exposes a timeline of state transitions, per-device output, and approval history.'
				],
				troubleshooting: [
					{
						problem: 'Job stuck in pending_approval.',
						cause:
							'The job type requires sign-off and no second engineer has approved it, or the only available approver is the submitter.',
						fix: 'Have a different user with the Network Engineer or Admin role approve it — the submitter cannot approve their own job.'
					},
					{
						problem: 'Job fails immediately with a connection error.',
						cause: 'The linked credential is wrong, or the device is unreachable over SSH.',
						fix: 'Open the device and run a connectivity probe; verify the credential with Live Test in the vault before re-running.'
					}
				],
				faq: [
					{
						q: 'Why must a second engineer approve my job?',
						a: 'Sensitive job types follow the four-eyes principle — a second reviewer reduces the risk of an accidental change to production. Whitelist a type in AUTONOMOUS_JOB_TYPES if it is safe to auto-approve.'
					},
					{
						q: 'Can one job target many devices at once?',
						a: 'Yes. A job can have multiple target devices; the worker executes against each one and stores per-device output and exit codes.'
					}
				],
				related: ['templates', 'visual-editor', 'audit-logs', 'notifications', 'integrations']
			},
			{
				slug: 'visual-editor',
				label: 'Visual Editor',
				icon: 'Workflow',
				appRoute: '/visual-editor',
				access: 'Admin, Network Engineer',
				description:
					'Node-based canvas for building job templates visually — drag devices, actions, and flow blocks onto a graph that compiles to executable YAML.',
				overview:
					'Some templates are easier to reason about as diagrams than as nested YAML. The Visual Editor renders every step as a node on a SvelteFlow canvas, with typed connectors showing data flow between steps. The graph serializes to the same YAML format as hand-written templates, so you can round-trip: build visually, export YAML, edit, and re-import.',
				capabilities: [
					'Drag-and-drop node palette: device, command, config block, condition, wait, notify',
					'Typed connectors show data flow between steps',
					'Click any node to edit its fields in a properties panel',
					'Pan, zoom, duplicate (Ctrl+D), and delete nodes on an interactive canvas',
					'Serialize the graph to template YAML — round-trips with hand-written templates'
				],
				tables: [
					{
						title: 'Node types',
						headers: ['Node', 'Purpose'],
						rows: [
							['Device', 'A target device selector (by tag, vendor, or explicit list)'],
							['Command', 'Execute a CLI command, capture output'],
							['Config block', 'Multi-line configuration snippet'],
							['Condition', 'Branch based on previous output (regex match, exit code)'],
							['Wait', 'Delay between steps'],
							['Notify', 'Emit a notification or fire a webhook']
						]
					}
				],
				howItWorks: [
					'You start a new diagram on a blank canvas and drag nodes from the palette.',
					'Edges drawn between output and input ports define the flow of execution.',
					'Clicking a node opens a properties panel to configure its fields.',
					'Downloading serializes the canvas to template YAML.',
					'Saving imports the YAML into the Templates library for use by Jobs.'
				],
				steps: [
					'Open /visual-editor and create a new diagram.',
					'Drag nodes from the palette and connect their ports to define the flow.',
					'Click each node to configure its properties.',
					'Download to export YAML, or Save to import it into Templates.',
					'Run the resulting template from the Jobs module.'
				],
				callouts: [
					{
						type: 'tip',
						text: 'The graph exports to the same YAML as hand-written templates — build visually, export, tweak the YAML by hand, then re-import. Full round-trip.'
					}
				],
				technicalNotes: [
					'The canvas is built with SvelteFlow (@xyflow/svelte).',
					'Edges are animated/dashed to indicate data-flow direction.',
					'Export format is identical to hand-authored template YAML, enabling round-trip editing.'
				],
				related: ['templates', 'jobs']
			},
			{
				slug: 'templates',
				label: 'Templates',
				icon: 'FileCode2',
				appRoute: '/templates',
				apiBase: '/api/v1/templates',
				access: 'Admin, Network Engineer',
				callouts: [
					{
						type: 'note',
						text: 'Template YAML is sandboxed — commands can be parameterized, but no arbitrary Python execution is allowed. Every edit creates a new revision and is recorded in the audit log.'
					}
				],
				related: ['jobs', 'visual-editor', 'audit-logs'],
				description:
					'Vendor-specific job template library — run common operations without writing raw CLI commands.',
				overview:
					'Templates are vendor-specific, pre-built job definitions that let you run common operations without writing raw CLI commands. Templates are grouped by vendor and category. You select a template, fill in the required parameters, and submit it as a standard job that goes through the normal approval workflow.',
				capabilities: [
					'Pre-built templates for MikroTik RouterOS and other vendors',
					'Browse and search templates by vendor, platform, or category',
					'Preview the command structure and required parameters before using',
					'Create jobs from templates by filling parameter fields — no CLI knowledge required',
					'Template-based jobs go through the same approval workflow as manual jobs'
				],
				howItWorks: [
					'Templates are stored as structured YAML files in the backend (infrastructure/db/templates/), organized by vendor and platform.',
					'Each template defines: name, description, vendor, platform, category, required parameters, and the CLI command sequence with parameter placeholders.',
					'When you create a job from a template, Crux substitutes your parameter values into the command sequence and dispatches it as a standard job.',
					'The resulting job goes through the normal approval workflow before execution.'
				],
				steps: [
					'Navigate to /templates and browse the MikroTik section.',
					'Select a template (e.g. "Add VLAN Interface" or "Disable Unused Services").',
					'Preview the command structure and required parameters.',
					'Click Use Template — fill in the parameter fields (e.g. VLAN ID, interface name, IP address).',
					'Submit — a job is created from the template and enters the approval queue.'
				],
				commands: [
					{
						label: 'Template Example: Disable Unused Services (Security Hardening)',
						code: `/ip service set telnet disabled=yes
/ip service set ftp disabled=yes
/ip service set www disabled=yes
/ip service set api disabled=yes
/ip service print`
					},
					{
						label: 'Template Example: Configure NTP Client',
						code: `/system ntp client set enabled=yes mode=unicast servers=pool.ntp.org
/system ntp client print`
					},
					{
						label: 'Template Example: Add OSPF Neighbor',
						code: `/routing ospf instance add name=default router-id=10.0.0.1
/routing ospf area add instance=default name=backbone area-id=0.0.0.0
/routing ospf interface-template add area=backbone interfaces=ether1 type=ptp
/routing ospf print`
					},
					{
						label: 'Template Example: Bandwidth Test (Health Check)',
						code: `/tool bandwidth-test address=<target-ip> direction=both duration=5s`
					}
				],
				technicalNotes: [
					'Templates are YAML files in infrastructure/db/templates/ — add new ones by creating files there and restarting the backend.',
					'Supported vendors out of the box: Cisco IOS, Cisco IOS-XE, MikroTik RouterOS, Juniper JunOS, Arista EOS.',
					'Template parameters are validated before job creation — required fields must be non-empty.',
					'All template-based jobs are auditable and approval-gated.',
					'Custom templates can be added without modifying application code.'
				]
			},
			{
				slug: 'schedules',
				label: 'Schedules',
				icon: 'CalendarClock',
				appRoute: '/schedules',
				apiBase: '/api/v1/devices/{id}/backup-schedules',
				access: 'Admin, Network Engineer, Backup Administrator',
				related: ['backups', 'jobs'],
				description:
					'Cron-based job scheduling with human-readable descriptions, next-run preview, and enable/disable toggle.',
				overview:
					"Schedules automates recurring job execution using cron expressions. You define a schedule — target device, job type or template, and a cron expression — and Crux's Celery Beat dispatcher runs the job automatically at each trigger time. Schedules can be paused and re-enabled at any time without being deleted or losing their history.",
				capabilities: [
					'Schedule any job type or template with a standard cron expression',
					'Human-readable cron description shown alongside the expression',
					'Next-run time preview computed and displayed before saving',
					'Calendar picker UI for common schedule patterns: hourly, daily, weekly, monthly',
					'Enable/disable toggle per schedule — pause without deleting',
					'Multiple schedules can target the same device independently'
				],
				howItWorks: [
					'A schedule stores: target device, job type or template, cron expression, and enabled flag.',
					"Celery Beat checks all active schedules every 60 seconds. When a schedule's cron expression triggers, Beat dispatches the corresponding Celery task.",
					'Scheduled backup and health-check jobs are dispatched autonomously (no approval required).',
					'Next-run time is computed from the cron expression at save time and displayed in the schedule list.'
				],
				steps: [
					'Navigate to /schedules and click New Schedule.',
					'Select the target MikroTik device and job type (e.g. backup).',
					'Enter a cron expression or use the calendar picker.',
					'Review the next-run time preview shown below the cron input.',
					'Save and enable the schedule. Flip the toggle to Disabled to pause at any time.'
				],
				commands: [
					{
						label: 'Verify MikroTik System Clock (critical for cron accuracy)',
						code: `/system clock print
/system ntp client print`
					},
					{
						label: 'Sync Clock with NTP before Setting Schedules',
						code: `/system ntp client set enabled=yes mode=unicast servers=pool.ntp.org
/system clock set time-zone-name=Asia/Jakarta`
					},
					{
						label: 'MikroTik Native Scheduler (for comparison / reference)',
						code: `/system scheduler add name=log-export interval=1d \
  on-event="/export file=daily-backup" \
  start-time=02:00:00 comment="Daily export (reference only — use Crux Schedules instead)"
/system scheduler print`
					}
				],
				technicalNotes: [
					'Cron expressions follow the standard 5-field POSIX format: minute hour day month weekday.',
					'Celery Beat runs every 60 seconds — the actual trigger may be up to 60 seconds later than the scheduled cron time.',
					'Disabling a schedule does not affect jobs already dispatched — those complete normally.',
					'The backup_dispatcher Celery task (runs every 60 seconds) handles dispatching backup schedules.',
					'Schedules for non-autonomous types (push_config, run_command) create jobs that enter the approval queue.'
				]
			},
			{
				slug: 'backups',
				label: 'Backups',
				icon: 'Archive',
				appRoute: '/backups',
				apiBase: '/api/v1/devices/{id}/backups',
				access: 'Admin, Network Engineer, Backup Administrator',
				callouts: [
					{
						type: 'note',
						text: 'Restore is a guided manual step — downloading a backup and applying it via a config_push job. There is no one-click automatic restore yet.'
					}
				],
				related: ['schedules', 'jobs', 'integrations'],
				description:
					'Scheduled configuration snapshots with line-by-line diff comparison and rollback support.',
				overview:
					'Backups automatically captures running configuration snapshots from your devices on a scheduled basis. Every snapshot is stored with a timestamp and the full configuration text. Crux provides a line-by-line diff view so you can immediately see what changed between any two backups, and a rollback feature that pushes a saved configuration back to the device through the standard approval workflow.',
				capabilities: [
					'Schedule automatic configuration backups for any managed device',
					'Manual backup trigger available at any time from the backup page',
					'Browse backup snapshots per device, sorted by timestamp',
					'Line-by-line diff comparison between any two backup versions',
					'Rollback to any previous configuration snapshot via a push_config job',
					'Download the raw configuration text of any backup'
				],
				howItWorks: [
					'When a backup job runs, the Celery worker connects to the device via SSH and runs the appropriate configuration retrieval command.',
					'The raw configuration text is stored in the backups table alongside the device ID, job ID, and timestamp.',
					'The diff view compares two snapshots line-by-line: added lines are highlighted green, removed lines red.',
					"Rollback creates a new push_config job with the selected backup's content as the payload — this job goes through the normal approval workflow."
				],
				steps: [
					'Create a backup schedule at /schedules (select device, set cron, choose backup type).',
					'Or trigger a manual backup: navigate to /backups, select a device, and click Backup Now.',
					'Browse the backup list for the device — sorted by timestamp, newest first.',
					'Select two backups and click Compare to see the line-by-line diff.',
					'To roll back, select a backup and click Restore — a push_config job is created for approval.'
				],
				commands: [
					{
						label: 'What Crux Runs to Capture MikroTik Config',
						code: `/export`
					},
					{
						label: 'Export with Full Default Values',
						code: `/export verbose`
					},
					{
						label: 'Export Specific Subsystem Only',
						code: `/ip address export
/ip route export
/ip firewall export`
					},
					{
						label: 'Save Export to Router Storage (manual reference)',
						code: `/export file=running-config-$(date)
/file print where name~"running-config"`
					}
				],
				technicalNotes: [
					'Backup retrieval uses Netmiko (SSH) — for MikroTik RouterOS, Crux runs /export which outputs the full config as CLI commands.',
					'Raw configuration text is stored as plain text in the backups table.',
					'The backup_dispatcher Celery task runs every 60 seconds to dispatch pending scheduled backups.',
					'Rollback creates a new push_config job — it does not bypass the approval workflow.',
					'There is no built-in retention policy — implement periodic archiving externally if table size is a concern.'
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
				apiBase: '/api/v1/users',
				access: 'Admin only',
				callouts: [
					{
						type: 'note',
						text: 'Invitation tokens are single-use and expire after 24h. The very first admin is not invited — create it once with scripts/bootstrap.py (see Installation). Prefer deactivate over delete to preserve the audit trail.'
					}
				],
				related: ['roles', 'api-keys', 'audit-logs', 'settings'],
				description:
					'Invite-only user account management with role assignment and optional TOTP MFA.',
				overview:
					"Users manages all accounts on the Crux platform. Registration is invite-only — administrators generate invitation links delivered to the recipient's email. Invitations are valid for 48 hours. The recipient sets their password and activates their account. Roles are assigned at invitation time and can be changed at any time. Optional TOTP-based multi-factor authentication is available per user.",
				capabilities: [
					'Invite users by email with a selected role — invitation links valid for 48 hours',
					'Create, view, edit, and deactivate user accounts',
					'Assign and change roles at any time',
					'View per-user activity, last login, and account status',
					'Enable TOTP MFA per user (Google Authenticator, Microsoft Authenticator)',
					'Immediate session revocation on deactivation via Valkey token blacklist'
				],
				howItWorks: [
					"An administrator creates an invitation by entering the recipient's email and selecting a role. Crux generates a one-time token and sends an activation email (valid for 48 hours).",
					'The recipient clicks the activation link, sets their password, and their account becomes active with the assigned role.',
					'Deactivating a user immediately revokes all their active sessions by adding their JWT tokens to the Valkey token blacklist.',
					'TOTP MFA: the user scans a QR code with an authenticator app; on each subsequent login, a 6-digit TOTP code is required.'
				],
				steps: [
					'Navigate to /users and click Invite User.',
					"Enter the recipient's email address and select their role.",
					'Crux sends an activation email with a 48-hour link.',
					'The recipient opens the link, sets a password, and their account is activated.',
					'To change a role, click the user row and select a new role from the dropdown.'
				],
				technicalNotes: [
					'Invitation tokens are single-use and expire after 48 hours — expired tokens return a 404.',
					'TOTP MFA uses time-based one-time passwords (RFC 6238). The shared secret is stored encrypted.',
					'JWT access tokens expire after 30 minutes; refresh tokens expire after 7 days.',
					"Deactivated users' tokens are added to a Valkey blocklist — all requests with those tokens return 401 immediately.",
					'Email delivery uses SMTP configured via SMTP_HOST, SMTP_USERNAME, and SMTP_PASSWORD environment variables.'
				]
			},
			{
				slug: 'roles',
				label: 'Roles & Policies',
				icon: 'ShieldCheck',
				appRoute: '/roles',
				apiBase: '/api/v1/roles',
				access: 'Admin only',
				tables: [
					{
						title: 'Built-in roles',
						headers: ['Role', 'Typical permissions'],
						rows: [
							['Admin', 'Full platform access, all resources'],
							['Network Operator', 'Submit jobs, view backups, run approvals'],
							['Network Engineer', 'Edit templates, create credentials, manage devices'],
							['NOC Operator', 'View monitoring, logs, alerts'],
							['Security Auditor', 'Read audit logs, incident logs, user activity'],
							['Backup Administrator', 'Manage backup schedules and restore'],
							['AI Analyst', 'Use AI Agent, MoP Generator, view incident logs'],
							['Read-Only Viewer', 'Read everything, modify nothing']
						]
					}
				],
				callouts: [
					{
						type: 'tip',
						text: 'Deny beats allow. Build a least-privilege custom role — e.g. "Junior Engineer" allowing read + create on jobs but denying approve, so they can submit work but not self-approve.'
					}
				],
				related: ['users', 'audit-logs', 'security-model'],
				description:
					'Policy-based RBAC with eight built-in roles and support for custom roles with fine-grained access control.',
				overview:
					'Roles & Policies implements policy-based Role-Based Access Control (RBAC) for all platform operations. Crux ships with eight built-in roles covering common personas, from Admin to Read-Only Viewer, and supports custom roles with fine-grained action-and-resource policy definitions. Every sensitive API endpoint is gated by a role check, and all permission checks are recorded in the audit log.',
				capabilities: [
					'Eight built-in roles: Admin, Network Operator, Network Engineer, NOC Operator, Security Auditor, Backup Administrator, AI Analyst, Read-Only Viewer',
					'Create custom roles with scoped action-and-resource policies',
					'Fine-grained policy model: action (e.g. jobs:approve) + resource (e.g. device:*)',
					'Deny > Allow semantics: a deny policy overrides any matching allow policy',
					'Every sensitive operation enforced by role check at the API layer',
					'All permission checks — granted and denied — recorded in the audit log'
				],
				howItWorks: [
					"Every sensitive API endpoint is guarded by a role check. When a request arrives, the user's JWT is decoded, their roles are resolved from the database, and their combined policies are evaluated.",
					'Policies follow an action+resource model: e.g. jobs:approve on resource:* means the role can approve any job.',
					'Deny rules take precedence — if any policy matching the request is a deny, access is blocked regardless of allow policies.',
					'Custom roles are created and stored in the database — no code changes are required.'
				],
				steps: [
					'Navigate to /roles to see all built-in and custom roles.',
					'Click a role to view its assigned policies.',
					'To create a custom role, click New Role — enter a name and add policy pairs (action + resource).',
					'Assign the new role to users from the Users module.',
					'To audit who holds which role, use the Users list filtered by role.'
				],
				technicalNotes: [
					'Built-in roles: Admin (unrestricted), Network Operator, Network Engineer, NOC Operator, Security Auditor, Backup Administrator, AI Analyst, Read-Only Viewer.',
					'Policy actions follow a resource:verb pattern — e.g. credentials:read, jobs:create, roles:assign.',
					'Deny > Allow: a deny policy on any matched action+resource blocks access regardless of allow policies.',
					'The Admin role has unrestricted access to all resources and cannot be modified.',
					'All role assignment changes and access denials are recorded in the audit_logs table.'
				]
			},
			{
				slug: 'notifications',
				label: 'Notifications',
				icon: 'Bell',
				appRoute: '/notifications',
				apiBase: '/api/v1/notifications',
				access: 'All authenticated roles (each user sees their own)',
				tables: [
					{
						title: 'Notifications vs Integrations',
						headers: ['In-app notifications', 'Integrations webhooks'],
						rows: [
							['Visible in the Crux UI', 'Sent to external systems'],
							['Per-user delivery', 'Global per subscription'],
							['No config needed', 'Must be set up by an admin'],
							['For humans logged in', 'For machines / chat channels']
						]
					}
				],
				related: ['integrations', 'jobs', 'ai-incidents'],
				description:
					'In-app notification center for job completions, SNMP alerts, backup results, and AI incident events.',
				overview:
					'Notifications is the in-app alert center for events that matter to your operations team. Every significant platform event — job completion or failure, SNMP trap receipt, AI incident detection, backup result — generates a notification that appears in the sidebar badge and the notifications feed.',
				capabilities: [
					'Notifications for job completion, failure, SNMP traps, AI incidents, and backup results',
					'Unread count badge in the sidebar (displayed as a hexagonal icon)',
					'Mark individual notifications as read, or clear all at once',
					'Notification feed sorted by recency with event type indicators',
					'Notifications are user-scoped — each user sees only events relevant to their activity'
				],
				howItWorks: [
					'Notification records are created by the application layer when key events occur: job status transitions, SNMP trap receipt, AI incident creation, backup completion or failure.',
					'The sidebar displays an unread count badge that is updated on each page navigation.',
					'Opening /notifications shows the full feed for the authenticated user, sorted newest first.',
					'Marking a notification as read updates the read flag on the record — the unread count decrements immediately.'
				],
				steps: [
					'Look for the notification badge in the sidebar — a non-zero count means unread alerts.',
					'Navigate to /notifications to see the full feed.',
					'Click a notification to view its detail (e.g. which job failed, which device sent a trap).',
					'Mark notifications as read individually, or use Mark All Read to clear the badge.',
					'For external alerting, configure Integrations (Webhook or Telegram) to deliver notifications outside the platform.'
				],
				technicalNotes: [
					'Notification records are stored in the notifications table and scoped to user_id — each user sees only their own feed.',
					'Notifications are not deleted — the read flag is toggled instead, preserving a complete event history.',
					'The sidebar unread count is re-fetched on each page navigation — it is not a persistent WebSocket subscription.',
					'For high-volume environments (many traps), consider using the Integrations module to route critical alerts externally.'
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
				apiBase: '/api/v1/settings (read-only)',
				access: 'Admin',
				callouts: [
					{
						type: 'note',
						text: 'Settings is mostly a read-only mirror of environment variables — secret values are never returned. To change config, edit .env and restart the backend; hot-reload is intentionally not supported.'
					}
				],
				related: ['configuration', 'security-model'],
				description:
					'Platform-wide configuration for SNMP polling, AI provider, and system-level defaults.',
				overview:
					'Global Settings is the central configuration panel for platform-wide behaviors: SNMP polling parameters, AI provider endpoint and model, and system-level defaults. Changes here affect all devices and all users on the platform. SNMP changes take effect on the next poll cycle; AI provider changes take effect immediately.',
				capabilities: [
					'Configure SNMP version (v1, v2c, v3), community string, and polling interval',
					'Set the AI provider base URL, API key, and model name',
					'Compatible with any OpenAI-compatible LLM provider: Groq, OpenAI, DeepSeek, Gemini, Ollama',
					'Set platform-wide defaults for job behavior and automation',
					'SNMP v3 auth and privacy protocol configuration'
				],
				howItWorks: [
					'Settings are stored as environment variables for sensitive values and as database config records for runtime-adjustable values.',
					'SNMP configuration is read by the Celery worker at the start of each polling task — changes take effect on the next poll cycle.',
					'AI provider configuration is read at inference time — changes take effect immediately for the next LLM call.'
				],
				steps: [
					'Navigate to /settings.',
					'Under SNMP: set the community string matching your MikroTik SNMP community, version (v2c), and polling interval.',
					'Under AI Provider: enter the base URL, API key, and model name for your chosen provider.',
					'Save — SNMP changes apply on the next poll cycle; AI changes apply immediately.'
				],
				commands: [
					{
						label: 'Get SNMP Community String from MikroTik',
						code: `/snmp community print`
					},
					{
						label: 'Get SNMP Version Configured on MikroTik',
						code: `/snmp print`
					},
					{
						label: 'Verify MikroTik is Responding to SNMP Polls',
						code: `# Run from the Crux server shell (requires snmpget installed)
snmpget -v2c -c crux-snmp <mikrotik-ip> 1.3.6.1.2.1.1.1.0`
					}
				],
				technicalNotes: [
					'LLM provider: any OpenAI-compatible API is supported — Groq (default), OpenAI, Azure OpenAI, DeepSeek, Gemini, or local Ollama.',
					'For local/private inference, set LLM_BASE_URL to your Ollama instance (e.g. http://localhost:11434/v1).',
					'SNMP v3 requires additional parameters: SNMP_AUTH_PROTOCOL (MD5/SHA), SNMP_AUTH_KEY, SNMP_PRIV_PROTOCOL (DES/AES), SNMP_PRIV_KEY.',
					'Changing JWT_SECRET_KEY or ENCRYPTION_KEY requires a backend restart and will invalidate all active sessions.'
				]
			},
			{
				slug: 'audit-logs',
				label: 'Audit Logs',
				icon: 'ScrollText',
				appRoute: '/audit-logs',
				apiBase: '/api/v1/audit-logs',
				access: 'Admin, Security Auditor',
				callouts: [
					{
						type: 'warning',
						text: 'Audit rows are insert-only — there is no UPDATE or DELETE endpoint, so even admins cannot tamper with the record from the UI. Each entry stores before/after JSON snapshots, actor, and source IP.'
					}
				],
				related: ['users', 'roles', 'api-keys', 'security-model'],
				description:
					'Immutable, append-only audit trail of all sensitive operations across the platform.',
				overview:
					'Audit Logs is an immutable, append-only record of every sensitive operation performed on the platform. Every action that creates, modifies, or deletes a resource — credential access, role assignment, job approval, user invitation, backup restore — is recorded with the acting user, their source IP, the resource affected, and a UTC timestamp. Records cannot be deleted or modified.',
				capabilities: [
					'Log of every sensitive operation: credential access, role changes, job approval, user management',
					'Immutable — no API endpoint exists to delete or modify audit records',
					'Each record includes: user, action, resource, source IP, and UTC timestamp',
					'Filter by user, action type, resource, or time range',
					'Export filtered view for compliance reporting',
					'Permission check failures (access denied events) are also logged'
				],
				howItWorks: [
					'The application layer writes an audit record after every sensitive operation completes, before the HTTP response is returned.',
					'The audit_logs table is append-only — the database role has no DELETE or UPDATE permission on this table.',
					'Each record contains: user_id, username, action, resource identifier, JSON details, source IP, and UTC timestamp.',
					'The audit log is searchable and filterable by user, action type, resource, and date range.'
				],
				steps: [
					'Navigate to /audit-logs.',
					'Use the filters to narrow by user, action type, or date range.',
					'Click any log entry to expand its full detail, including the JSON payload.',
					'Use the export function to download the filtered results for compliance reporting.'
				],
				technicalNotes: [
					'Append-only enforcement is at the application layer — the DB user cannot DELETE or UPDATE audit_logs rows.',
					'Actions tracked: auth:login, auth:logout, credential:create, credential:decrypt, job:create, job:approve, job:reject, role:assign, user:invite, backup:restore, and more.',
					'Source IP is captured from X-Forwarded-For (when behind a reverse proxy) or the direct connection IP.',
					'Audit records are never purged automatically — implement external archiving for long-term compliance retention.',
					'Permission check failures are logged as action:denied entries — use them to detect unauthorized access attempts.'
				]
			},
			{
				slug: 'integrations',
				label: 'Integrations',
				icon: 'Plug',
				appRoute: '/integrations',
				apiBase: '/api/v1/integrations',
				access: 'Admin only',
				tables: [
					{
						title: 'Delivery headers',
						headers: ['Header', 'Value'],
						rows: [
							['Content-Type', 'application/json'],
							['X-Crux-Event', '<event name>'],
							['X-Crux-Signature', 'sha256=<hmac> (when a secret is set)']
						]
					},
					{
						title: 'Integrations vs Notifications',
						headers: ['Integrations', 'Notifications'],
						rows: [
							['Outbound HTTP', 'In-app UI feed'],
							['For external systems', 'For humans in the Crux UI'],
							['Admin-configured', 'Auto-generated per event']
						]
					}
				],
				callouts: [
					{
						type: 'warning',
						text: 'Delivery is fire-and-forget with a 5-second timeout and NO retry. If the receiver is down, that event is lost — build retry logic on your side if you need guaranteed delivery.'
					}
				],
				related: ['jobs', 'backups', 'notifications', 'audit-logs'],
				description:
					'Outbound webhooks and Telegram bot for delivering real-time events to external systems.',
				overview:
					'Integrations connects Crux to external systems via outbound webhooks and Telegram bot messages. You define which events trigger each integration, and Crux delivers real-time JSON payloads to your endpoints — compatible with Slack, Splunk, Grafana Alerting, and any custom HTTP receiver. Payloads are signed with HMAC-SHA256 so your receiver can verify authenticity.',
				capabilities: [
					'Outbound webhooks — send HTTP POST callbacks to any endpoint on platform events',
					'HMAC-SHA256 payload signing for webhook receiver verification',
					'Telegram bot integration — receive formatted alerts in a Telegram channel',
					'Select which events trigger each integration: job events, backup events, AI incidents, SNMP traps',
					'Test integrations before activating — send a sample payload to verify connectivity',
					'Compatible with Slack, Splunk, Grafana Alerting, and any custom HTTP endpoint'
				],
				howItWorks: [
					'You create a webhook subscription by providing an endpoint URL, selecting event triggers, and optionally entering a shared secret.',
					'When a matching event occurs, Crux sends an HTTP POST to your endpoint with the event payload as JSON.',
					'If a shared secret is configured, the payload includes an X-Crux-Signature header (HMAC-SHA256) for verification.',
					'Telegram integration sends formatted messages to a configured chat or channel using a Telegram Bot token.'
				],
				steps: [
					'Navigate to /integrations.',
					'Click Add Webhook — enter the endpoint URL and select the events to trigger it.',
					'Optionally enter a shared secret — Crux will sign all payloads with HMAC-SHA256.',
					'Click Test to send a sample payload and verify connectivity.',
					'For Telegram: enter your Bot Token and Chat ID, enable the events you want, and click Save.'
				],
				commands: [
					{
						label: 'Send MikroTik Syslog to Crux Webhook Inbound Endpoint',
						code: `/system logging action add name=crux-webhook target=remote \
  remote=<crux-server-ip> remote-port=514 bsd-syslog=yes
/system logging add topics=error,warning,critical action=crux-webhook
/system logging action print`
					},
					{
						label: 'Verify Syslog Action is Active',
						code: `/system logging action print where name=crux-webhook
/system logging print`
					}
				],
				technicalNotes: [
					'Outbound webhook delivery is synchronous with no built-in retry — implement retry logic on your receiver if needed.',
					'HMAC-SHA256 signature: HMAC(secret, request_body) delivered in the X-Crux-Signature header.',
					'Inbound webhook endpoint (syslog/Wazuh ingestion) is rate-limited at 60 requests per minute per source IP.',
					'Telegram messages are formatted with Markdown: severity emoji, device name, event description, and timestamp.',
					'Webhook payload schema: {event, timestamp, resource_type, resource_id, data} — consistent across all event types.'
				]
			}
		]
	},
	{
		key: 'developer',
		label: 'Developer',
		modules: [
			{
				slug: 'news',
				label: 'Networking News',
				icon: 'Rss',
				appRoute: '/news',
				apiBase: 'GET /api/v1/news',
				access: 'All authenticated roles',
				description:
					'Networking news and CVE feed — aggregates headlines from external sources so you stay current without leaving the platform.',
				overview:
					'News surfaces three things network engineers should track: critical CVEs affecting gear they operate, vendor security advisories, and major outages or protocol changes. Crux fans out to NVD, CurrentsAPI, and GNews in parallel, merges the results, and presents a single feed sorted newest-first. Missing API keys degrade gracefully — the remaining sources still return.',
				capabilities: [
					'Aggregated feed from NVD (CVEs), CurrentsAPI (tech news), and GNews (keyword-filtered)',
					'Sorted by publish date, newest first',
					'Category badges (e.g. "CVE", "CVSS 9.8 · Critical") for visual skimming',
					'Click any headline to open the source article in a new tab',
					'Graceful degradation — a missing API key just drops that one source'
				],
				prerequisites: [
					'NVD requires no key. For the other sources, register free API keys (see commands).'
				],
				tables: [
					{
						title: 'Sources',
						headers: ['Source', 'Auth', 'Content'],
						rows: [
							['NVD', 'None', 'Latest published CVEs (newest first)'],
							['CurrentsAPI', 'CURRENTS_API_KEY', 'Technology news (free: 600 req/day)'],
							[
								'GNews',
								'GNEWS_API_KEY',
								'Keyword-filtered: network, cisco, firewall, CVE (free: 100/day)'
							]
						]
					},
					{
						title: 'Feed item shape',
						headers: ['Field', 'Purpose'],
						rows: [
							['title', 'Headline'],
							['source', 'Domain (e.g. nvd.nist.gov)'],
							['summary', 'First 200 characters'],
							['url', 'Link to the full article'],
							['publishedAt', 'ISO timestamp'],
							['categories', 'Tags like ["CVE", "CVSS 9.8 · Critical"]']
						]
					}
				],
				howItWorks: [
					'The frontend calls GET /api/v1/news.',
					'The backend fans out to NVD, CurrentsAPI, and GNews in parallel using asyncio.',
					'Results are merged, sorted by publishedAt descending, and returned.',
					'There is no caching and no background job — the request is simple and stateless.'
				],
				steps: [
					'Register free API keys at CurrentsAPI and GNews (NVD needs none).',
					'Add CURRENTS_API_KEY and GNEWS_API_KEY to your .env.',
					'Open /news to browse the merged feed.',
					'Skim category badges and click any headline to read the source.'
				],
				commands: [
					{
						label: 'Add news API keys to .env',
						code: `CURRENTS_API_KEY=<key>   # https://currentsapi.services/en/register
GNEWS_API_KEY=<key>      # https://gnews.io/register
# NVD requires no key`
					}
				],
				commandsLabel: 'Example .env Values',
				callouts: [
					{
						type: 'note',
						text: 'Missing API keys degrade gracefully — if CURRENTS_API_KEY or GNEWS_API_KEY is absent, those sources are skipped and the remaining ones (including key-free NVD) still return.'
					}
				],
				technicalNotes: [
					'Backend fans out to all sources in parallel via asyncio, then merges and sorts.',
					'No caching and no background jobs — each request hits the sources live.',
					'NVD is always available (no key); Currents and GNews are optional enrichments.'
				],
				related: ['ai-incidents']
			},
			{
				slug: 'api-keys',
				label: 'API Keys',
				icon: 'KeySquare',
				appRoute: '/api-keys',
				apiBase: '/api/v1/api-keys',
				access: 'Admin, Network Engineer (own keys)',
				tables: [
					{
						title: 'JWT vs API Key',
						headers: ['JWT', 'API Key'],
						rows: [
							['Issued at login', 'Issued manually'],
							['Short-lived (30m / 7d)', 'Long-lived (until revoked)'],
							['For browser sessions', 'For scripts / CI / bots'],
							['User presence required', 'Headless, no interaction']
						]
					}
				],
				related: ['roles', 'audit-logs', 'api-docs'],
				description: 'Generate and manage API keys for programmatic access to the Crux API.',
				overview:
					"API Keys provides programmatic access to the Crux API for external tools, scripts, and automation pipelines. Each key is scoped to a user and inherits that user's role and permissions. Keys can be revoked at any time and usage is tracked per key. The plaintext key is shown only once at generation — Crux stores only the HMAC hash.",
				capabilities: [
					'Generate scoped API keys for external tools and scripts',
					"Keys inherit the permissions of the generating user's role",
					'Optional expiry date — keys without an expiry are valid until revoked',
					'View last-used timestamp and request count per key',
					'Revoke any key instantly — all subsequent requests with that key return 401',
					'Keys are shown in plaintext only once at generation time'
				],
				howItWorks: [
					'An API key is generated as an HMAC-SHA256 token. Crux stores only the hash — the plaintext value is displayed once at generation.',
					"When a request includes Authorization: Bearer <key>, Crux resolves the key to a user identity and applies that user's RBAC policies.",
					'Last-used timestamp and request count are updated on each authenticated request.',
					'Revoking a key removes it from the api_keys table — subsequent requests with that key return 401 immediately.'
				],
				steps: [
					'Navigate to /api-keys and click Generate Key.',
					'Enter a label (e.g. "Ansible integration") and optionally set an expiry date.',
					'Copy the key immediately — it is shown in plaintext only once.',
					'Include the key in API requests via the Authorization: Bearer <key> header.',
					'To revoke, click Revoke next to the key — invalidation is immediate.'
				],
				commands: [
					{
						label: 'Enable MikroTik REST API Service (for RESTCONF-based jobs)',
						code: `/ip service set api disabled=no port=8728
/ip service set api-ssl disabled=no port=8729`
					},
					{
						label: 'Restrict API Access to Crux Server Only',
						code: `/ip service set api address=<crux-server-ip>/32
/ip service set api-ssl address=<crux-server-ip>/32
/ip service print where name=api or name=api-ssl`
					},
					{
						label: 'Create Dedicated API-Only User on MikroTik',
						code: `/user add name=crux-api password="ApiSecure123!" group=full comment="Crux API integration"
/user print where name=crux-api`
					},
					{
						label: 'Test Crux API Access with curl',
						code: `curl -s -H "Authorization: Bearer <crux-api-key>" \
  http://<crux-server>:8000/api/v1/devices | python3 -m json.tool`
					}
				],
				technicalNotes: [
					'Keys are HMAC-SHA256 tokens — the plaintext value is never stored server-side after generation.',
					"Key permissions inherit the generating user's role — a key created by a Read-Only Viewer cannot approve jobs.",
					'Expiry is optional — keys without an expiry are valid indefinitely until explicitly revoked.',
					'API keys bypass TOTP MFA — use them only in secure, automated contexts and never commit them to source control.',
					'Revoked keys are removed from the api_keys table; invalidation is immediate with no propagation delay.'
				]
			},
			{
				slug: 'api-docs',
				label: 'API Docs',
				icon: 'BookOpen',
				appRoute: '/api-docs',
				apiBase: '/openapi.json — Swagger at :8000/docs, ReDoc at :8000/redoc',
				access: 'Public when APP_DEBUG=true, authenticated in production',
				related: ['api-keys'],
				description:
					'Interactive OpenAPI / Swagger documentation for all Crux backend endpoints with live try-it-out.',
				overview:
					"API Docs is the interactive OpenAPI documentation for all Crux backend endpoints. Built on FastAPI's native OpenAPI support, it provides a live try-it-out interface where you can authenticate with your API key and execute real API calls against the backend directly from the browser. The spec is auto-generated from the codebase and is always up to date.",
				capabilities: [
					'Full OpenAPI 3.0 specification auto-generated from the backend codebase',
					'Interactive Swagger UI with live try-it-out for every endpoint',
					'Authenticate with your API key directly in the Swagger UI',
					'Endpoints grouped by tag: auth, devices, jobs, backups, SNMP, topology, AI, and more',
					'Downloadable OpenAPI JSON spec for generating client SDKs',
					'ReDoc alternative UI available for a read-only documentation view'
				],
				howItWorks: [
					'FastAPI automatically generates an OpenAPI 3.0 schema from all router definitions, type annotations, and Pydantic request/response models.',
					'The Swagger UI is served at /api/v1/docs on the backend — the Crux frontend links to it from /api-docs.',
					'You authenticate by clicking Authorize in Swagger and entering Bearer <your-api-key>.',
					'All subsequent try-it-out requests are sent with your credentials against the live backend.'
				],
				steps: [
					'Navigate to /api-docs (links to the backend Swagger UI at /api/v1/docs).',
					'Click Authorize and enter: Bearer <your-api-key> from the API Keys module.',
					'Browse the endpoint list — grouped by tag.',
					'Expand any endpoint, click Try it out, fill in parameters, and click Execute.',
					'Download the full OpenAPI JSON spec from <backend-url>/api/v1/openapi.json for SDK generation.'
				],
				commands: [
					{
						label: 'Fetch OpenAPI Spec (from Crux server)',
						code: `curl -s http://<crux-server>:8000/api/v1/openapi.json | python3 -m json.tool`
					},
					{
						label: 'Generate Python Client from OpenAPI Spec',
						code: `openapi-generator-cli generate \
  -i http://<crux-server>:8000/api/v1/openapi.json \
  -g python \
  -o ./crux-python-client`
					},
					{
						label: 'Quick API Test: List All Devices',
						code: `curl -s -H "Authorization: Bearer <crux-api-key>" \
  http://<crux-server>:8000/api/v1/devices | python3 -m json.tool`
					}
				],
				technicalNotes: [
					'The OpenAPI spec is auto-generated by FastAPI — it always reflects the current codebase and requires no manual sync.',
					'JSON spec available at: <backend-url>/api/v1/openapi.json — use with openapi-generator-cli to generate typed clients.',
					'All endpoints in the spec require authentication — unauthenticated try-it-out requests return 401.',
					'ReDoc alternative UI available at <backend-url>/api/v1/redoc — read-only, no try-it-out.',
					'The spec is regenerated on every backend restart — there is no stale-spec risk.'
				]
			}
		]
	}
];
