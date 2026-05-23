# CLAUDE.md — Crux Company Profile

Company profile / landing page for the **Crux DevNet Platform**.
Design reference: [browseros.com](https://www.browseros.com/) — single-page scrolling,
numbered feature sections, hero stats row, use cases grid, FAQ accordion.
Dark theme only. No authentication, no API calls — all content is static.

---

## Commands

```bash
bun run dev        # dev server → http://localhost:5174
bun run build      # production build (adapter-static)
bun run preview    # preview production build
bun run format     # prettier --write .
bun run lint       # prettier --check + eslint
bun run check      # svelte-check (type-check)
```

Always use `bun run` — never invoke `vite`, `eslint`, or `svelte-check` directly.

---

## Stack

| Layer       | Tool                                       |
| ----------- | ------------------------------------------ |
| Framework   | SvelteKit + `@sveltejs/adapter-static`     |
| Language    | TypeScript strict                          |
| Styling     | Tailwind CSS v4 (Vite plugin)              |
| Icons       | lucide-svelte                              |
| Package Mgr | bun                                        |

No backend calls. No cookies. No form actions.

---

## Code Style

- **Tabs** for indentation (not spaces)
- **Single quotes**, no trailing commas
- Line length: **100** characters (Prettier enforced)
- Run `bun run format` before `bun run lint`

---

## Svelte 5 — Runes Mode (MANDATORY)

| Rune          | Purpose              |
| ------------- | -------------------- |
| `$state()`    | reactive local state |
| `$derived()`  | computed values      |
| `$effect()`   | side effects         |
| `$props()`    | component props      |

Never use the legacy Options API (`export let`, `$:`, `onMount` from legacy).

---

## Design System — Crux Dark

Permanently dark. Define these tokens in `src/app.css` as CSS custom properties;
Tailwind v4 auto-generates utility classes from them.

| CSS variable           | Hex       | Tailwind class    | Usage                              |
| ---------------------- | --------- | ----------------- | ---------------------------------- |
| `--color-canvas`       | `#0b0c10` | `bg-canvas`       | Page background — deepest layer    |
| `--color-surface`      | `#15171e` | `bg-surface`      | Cards, navbar background           |
| `--color-elevated`     | `#1e212b` | `bg-elevated`     | Hover rows, code blocks            |
| `--color-edge`         | `#2a2d3e` | `border-edge`     | Dividers, card outlines            |
| `--color-content`      | `#f1f5f9` | `text-content`    | Primary text, headings             |
| `--color-muted`        | `#94a3b8` | `text-muted`      | Secondary text, captions           |
| `--color-accent`       | `#3b82f6` | `*-accent`        | CTAs, active links, highlights     |
| `--color-accent-muted` | `#2563eb` | `bg-accent-muted` | Hover on accent elements           |
| `--color-success`      | `#22c55e` | `text-success`    | Status indicators                  |
| `--color-warning`      | `#f59e0b` | `text-warning`    | Caution states                     |
| `--color-danger`       | `#ef4444` | `text-danger`     | Error / destructive                |

### Visual Rules

- **No hardcoded hex** in `.svelte` files — always use token classes
- **Flat surfaces only** — no background gradients; accent-colored divider lines are allowed
- **No glow, no box-shadow on static cards** — elevation via background step
- **Monospace (`font-mono`)** for: section numbers (`01 //`), stat values, code snippets, version strings
- **Section numbers:** format is `01 // LABEL` in `font-mono text-xs text-muted uppercase tracking-widest`
- **Section labels** above headings: `text-xs font-medium uppercase tracking-wide text-muted`
- **CTA buttons:** primary = filled accent; secondary = ghost with accent border
- **No decorative animations** — scroll-triggered fade-in is acceptable (`duration-500`), nothing else
- **Anti AI Slop:** no "revolutionize / seamless / cutting-edge / game-changing." Copy must be
  specific, technical, and accurate to what Crux actually does.
- **Anti RGB:** no rainbow gradients, no neon glow, no colorful icon backgrounds.

---

## Page Layout — Section Order

```
┌─────────────────────────────────────┐
│  Navbar  (sticky, transparent → surface on scroll)
├─────────────────────────────────────┤
│  Hero    (full viewport height)
│    Eyebrow label
│    Headline (2–3 lines, large)
│    Subheadline (1–2 sentences)
│    CTA buttons (primary + secondary)
│    Stats row  (4 key numbers)
│    Product screenshot / terminal mock
├─────────────────────────────────────┤
│  Features  (numbered: 01–06)
│    Each feature = full-width row, alternating image side
│    "01 // MONITOR"  heading pattern
├─────────────────────────────────────┤
│  UseCases  (who it's for)
│    Grid of role cards: Network Engineer, IT Admin, SOC Analyst …
├─────────────────────────────────────┤
│  TechStack  (technology logos + layer grouping)
├─────────────────────────────────────┤
│  FAQ  (accordion)
├─────────────────────────────────────┤
│  Footer
└─────────────────────────────────────┘
```

---

## Component Architecture

### Routes

| File                        | Responsibility                                             |
| --------------------------- | ---------------------------------------------------------- |
| `src/routes/+layout.svelte` | Import `app.css`, render `<Navbar>` + `{@render children()}` |
| `src/routes/+page.svelte`   | Compose all sections in order; zero logic here             |

### Section Components (`src/lib/components/sections/`)

| Component           | Description                                                                 |
| ------------------- | --------------------------------------------------------------------------- |
| `Navbar.svelte`     | Logo wordmark, nav links, GitHub link, "Get Started" CTA. Sticky. Transparent until scroll, then `bg-surface/90 backdrop-blur`. |
| `Hero.svelte`       | Eyebrow label → Large headline → Subheadline → CTA row → Stats row → Screenshot/terminal block. |
| `Features.svelte`   | Wrapper that renders six `<FeatureRow>` components, alternating layout.     |
| `UseCases.svelte`   | Section heading + grid of `<UseCaseCard>` components (3-column desktop).    |
| `TechStack.svelte`  | Section heading + tech items grouped by layer (Frontend · Backend · Data · Networking · AI). |
| `Faq.svelte`        | Section heading + list of `<FaqItem>` accordion items.                      |
| `Footer.svelte`     | Logo, nav columns, GitHub + socials, copyright.                             |

### UI Primitives (`src/lib/components/ui/`)

| Component          | Props                                                       | Description                                              |
| ------------------ | ----------------------------------------------------------- | -------------------------------------------------------- |
| `FeatureRow.svelte`| `number: string`, `tag: string`, `title`, `description`, `imageSide?: 'left'\|'right'`, `slot: screenshot` | Full-width numbered feature row with text + visual. |
| `StatItem.svelte`  | `value: string`, `label: string`                           | Single stat (number + label) in the hero stats row.      |
| `UseCaseCard.svelte` | `role: string`, `description: string`, `icon`            | Role card in the use cases grid.                         |
| `FaqItem.svelte`   | `question: string`, `answer: string`                       | Accordion item — toggle open/close with `$state`.        |
| `TechGroup.svelte` | `layer: string`, `items: { name: string, icon?: string }[]`| One row of tech badges grouped by layer label.           |
| `Badge.svelte`     | `label: string`                                            | Small pill badge (e.g. "Open Source", "On-Premise").     |

---

## Content — Exact Copy

### Navbar
- Logo: `crux` wordmark (monospace, accent colored)
- Links: Features · Use Cases · Tech · FAQ
- Right: GitHub icon link · `Get Started →` (accent button)

### Hero
- **Eyebrow:** `Open-Source Network Operations Platform`
- **Headline:** `Automate. Monitor. Respond.` (or similar — keep ≤ 4 words per line, 3 lines max)
- **Subheadline:** `Crux is an on-premise platform for network engineers to automate
  configuration jobs, monitor device health via SNMP, and respond to incidents with
  AI-assisted analysis.`
- **CTA primary:** `Get Started` → `#features` anchor
- **CTA secondary:** `View on GitHub` → GitHub repo URL
- **Stats row (4 items):**
  - `6` — Automation job types
  - `AES-256` — Credential encryption
  - `100%` — On-premise deployment
  - `OpenAI-compatible` — AI provider support

### Features (numbered rows)

Each row follows the format `{number} // {TAG}`:

| # | Tag | Title | Description |
|---|-----|-------|-------------|
| 01 | MONITOR | Real-Time SNMP Monitoring | Poll device metrics on a configurable interval. Receive SNMP traps for interface-down events and route them straight into the AI incident analyzer. |
| 02 | AUTOMATE | Scheduled Automation Jobs | Define backup, health check, and config-push jobs with cron schedules. Require human approval for critical operations — or whitelist trusted job types for autonomous execution. |
| 03 | ANALYZE | AI Incident Analysis | Every SNMP trap is passed to an OpenAI-compatible LLM for root-cause assessment. Swap providers (Groq, DeepSeek, Gemini) by changing three env vars — no code changes. |
| 04 | SECURE | AES-256 Credential Vault | Device passwords, SSH keys, and API tokens are encrypted at rest with Fernet (AES-256). Secrets are never returned by the API — only decrypted inside the execution layer. |
| 05 | ACCESS | Role-Based Access Control | Admin, Operator, and Viewer roles with a policy-based IAM engine. Every sensitive operation is recorded in an immutable audit log. |
| 06 | STORE | Firmware Repository | Upload, version, and distribute firmware images. Every file is verified with a SHA-256 checksum at upload and available for on-demand download. |

### Use Cases (who uses Crux)

| Role | Description |
|------|-------------|
| Network Engineer | Automate daily backup and health-check jobs across hundreds of devices without writing custom scripts. |
| IT Administrator | Manage device credentials centrally, enforce role-based access, and audit every configuration change. |
| SOC Analyst | Get instant AI-generated root-cause summaries for SNMP trap floods and interface-down events. |
| DevOps / Infra | Deploy Crux entirely on-premise via Podman Compose. No cloud dependencies, no telemetry. |

### Tech Stack Groups

| Layer | Technologies |
|-------|-------------|
| Frontend | SvelteKit, Tailwind CSS v4, TypeScript |
| Backend | FastAPI, SQLAlchemy Core (async), Celery |
| Data | PostgreSQL 18, Valkey (Redis fork) |
| Networking | Netmiko, NAPALM, pysnmp |
| AI | OpenAI-compatible API (Groq / DeepSeek / Gemini) |
| Deployment | Podman Compose, on-premise Linux |

### FAQ

| Question | Answer |
|----------|--------|
| Is Crux free to use? | Yes. Crux is open-source and self-hosted. There are no SaaS tiers, usage fees, or telemetry. |
| What devices are supported? | Any device reachable via SNMP v2c/v3 or SSH. Netmiko supports 100+ vendor platforms including Cisco, Juniper, Arista, and MikroTik. |
| Which AI providers work with Crux? | Any OpenAI-compatible provider: Groq, DeepSeek, Gemini (via OpenRouter), or a local model via Ollama. Set three env vars to switch. |
| How is it deployed? | Via Podman Compose (or Docker Compose). A single `compose.yaml` starts Postgres, Valkey, the FastAPI backend, Celery workers, and the SvelteKit frontend. |
| Can I contribute? | Yes. The repository accepts pull requests. See the contributing guide in the repo README. |

### Footer columns
- **Product:** Features · Use Cases · Tech Stack · FAQ
- **Connect:** GitHub · (optional: email)
- **Legal:** MIT License
- **Copyright:** `© 2025 Crux. Built as an academic project.`

---

## Navbar Scroll Behavior

Navbar starts transparent (`bg-transparent`). On scroll past 60 px, add `bg-surface/90 backdrop-blur-md border-b`.
Use `$effect` + `window.addEventListener('scroll', ...)` in `Navbar.svelte`.

## FAQ Accordion Behavior

Each `FaqItem` holds `let open = $state(false)`.
Toggle on click. Animate height with `max-height` CSS transition (`duration-300`).
Only one item open at a time is **not** required — allow multiple open simultaneously.

## Feature Row Layout

Desktop: text block (left or right, alternating per row) + visual/screenshot (opposite side).
Mobile: stack vertically, visual below text always.
Visual placeholder: a dark card (`bg-elevated border rounded-lg`) with a terminal-style mock
or a descriptive label — actual screenshots can be swapped in later.

---

## Routing

Single-page site. No dynamic routes.

```
src/routes/
  +layout.svelte   → Navbar + global styles
  +page.svelte     → all sections composed in order
```

Nav links use `href="#features"`, `href="#use-cases"` etc.
Each section component renders its root element as `<section id="...">`.

---

## Accessibility

- `<nav aria-label="Main navigation">` on Navbar
- Each `<section>` has `aria-labelledby` pointing to its `<h2>`
- Images / mockups have descriptive `alt` text
- CTA links are `<a>` tags, not `<button>`
- FAQ accordion uses `aria-expanded` + `aria-controls` on the toggle button

---

## Strict Workflow Rules

- **Manual Git Control**: Claude Code is **STRICTLY FORBIDDEN** from running `git add`,
  `git commit`, or manipulating Git history. Stop after generating code and inform the user
  to review and commit manually.
