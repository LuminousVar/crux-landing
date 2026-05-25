export interface DocModule {
	slug: string;
	label: string;
	icon: string;
	description: string;
	capabilities: string[];
	appRoute: string;
	overview: string;
	howItWorks: string[];
	steps: string[];
	commands?: { label: string; code: string }[];
	technicalNotes: string[];
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
				slug: 'credentials',
				label: 'Credentials',
				icon: 'KeyRound',
				appRoute: '/credentials',
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
				slug: 'monitoring',
				label: 'SNMP Monitoring',
				icon: 'Activity',
				appRoute: '/monitoring',
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
			}
		]
	},
	{
		key: 'ai',
		label: 'AI',
		modules: [
			{
				slug: 'ai-diagnostics',
				label: 'AI Diagnostics',
				icon: 'Bot',
				appRoute: '/ai-diagnostics',
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
				description:
					'Background job execution engine with human approval workflow, full output capture, and audit trail.',
				overview:
					'Jobs is the core execution engine for all automation tasks in Crux. Every operation that touches a device — pushing configuration, running commands, taking backups — is modeled as a job. By default, jobs require human approval before execution, creating an auditable gate for all changes. Every approval, rejection, and execution output is captured and immutably logged.',
				capabilities: [
					'Create and run background jobs against any managed device',
					'Approval workflow: awaiting_approval → approved → running → success/failed',
					'Full output capture — stdout and stderr stored for every job execution',
					'Seven job statuses: awaiting_approval, approved, running, success, failed, rejected, cancelled',
					'Whitelist autonomous job types (backup, health_check) to bypass approval',
					'Every approval and rejection recorded in the immutable audit log'
				],
				howItWorks: [
					'A job is created with a type (push_config, run_command, run_backup), a target device, and a payload (commands or template parameters).',
					'On creation, the job enters awaiting_approval status and appears in the approval queue.',
					'An authorized approver reviews the job and approves or rejects it. Approval dispatches the job to the Celery worker queue.',
					'The worker connects to the device using the linked credential, executes the operation, and captures the full output.',
					'The job transitions through statuses: approved → running → success or failed. All transitions are timestamped.'
				],
				steps: [
					'Navigate to /jobs and click New Job.',
					'Select the job type (run_command) and the target MikroTik device.',
					'Fill in the payload — enter the MikroTik CLI commands to execute.',
					'Submit — the job enters awaiting_approval.',
					'An authorized user approves the job. Monitor the live execution output in the job detail view.'
				],
				commands: [
					{
						label: 'Example: Push Interface Configuration (run_command payload)',
						code: `/interface ethernet set ether1 speed=1Gbps-full-duplex auto-negotiation=no comment="Uplink to core"
/interface print where name=ether1`
					},
					{
						label: 'Example: Add Static Route (run_command payload)',
						code: `/ip route add dst-address=0.0.0.0/0 gateway=203.0.113.1 comment="Default route" distance=1
/ip route print where dst-address=0.0.0.0/0`
					},
					{
						label: 'Example: Firewall Rule Deployment (push_config payload)',
						code: `/ip firewall filter add chain=input protocol=tcp dst-port=22 src-address=10.0.0.0/8 action=accept comment="Allow SSH from internal"
/ip firewall filter add chain=input protocol=tcp dst-port=22 action=drop comment="Block all other SSH"
/ip firewall filter print`
					}
				],
				technicalNotes: [
					'Job statuses: awaiting_approval, approved, running, success, failed, rejected, cancelled.',
					'Autonomous types that bypass approval: backup, health_check.',
					'Approval-required types: push_config, run_command.',
					'Celery worker concurrency defaults to 2 — increase for higher throughput on more capable hardware.',
					'Every approval and rejection action is recorded in the audit_logs table with actor identity, timestamp, and job reference.',
					'Job output (stdout + stderr) is stored in the jobs table — manage table size with periodic archiving.'
				]
			},
			{
				slug: 'templates',
				label: 'Templates',
				icon: 'FileCode2',
				appRoute: '/templates',
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
				slug: 'api-keys',
				label: 'API Keys',
				icon: 'KeySquare',
				appRoute: '/api-keys',
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
