![alt text](image.png)# Crux — Company Profile

Landing page and documentation site for [Crux](https://github.com/LuminousVar/crux-landing), an open-source, on-premise network operations platform. Built as a fully static site with SvelteKit and Tailwind CSS v4 — dark theme only, no backend, no telemetry.

## Stack

| Layer            | Tool                                                 |
| ---------------- | ---------------------------------------------------- |
| Framework        | SvelteKit + `@sveltejs/adapter-static`               |
| Language         | TypeScript (strict, Svelte 5 runes)                  |
| Styling          | Tailwind CSS v4                                      |
| Font             | Inter (self-hosted via `@fontsource-variable/inter`) |
| Icons            | lucide-svelte, simple-icons                          |
| Syntax highlight | Shiki (build-time, in docs)                          |
| Package Manager  | bun                                                  |
| Deployment       | Any static host (Vercel, Netlify, etc.)              |

## Getting Started

```bash
# Install dependencies
bun install

# Start dev server → http://localhost:5174
bun run dev

# Type-check
bun run check

# Lint + format check
bun run lint

# Format
bun run format
```

> Always use `bun run` — never invoke `vite`, `eslint`, or `svelte-check` directly.

## Building

```bash
bun run build
bun run preview
```

Output is in `build/` — fully static, no server required (`fallback: 404.html`).

## Environment Variables

Copy `.env.example` to `.env` at the project root and fill in the values:

```env
# Demo request form (src/routes/demo) — safe to expose, it is a public endpoint
PUBLIC_FORMSPREE_URL=https://formspree.io/f/YOUR_FORM_ID

# AI Chat Widget — get a free key at console.groq.com. NOT PUBLIC_-prefixed. See below.
GROQ_API_KEY=gsk_your_key_here

# Optional, only if you are not using Groq's defaults
# LLM_BASE_URL=https://api.groq.com/openai/v1
# LLM_MODEL=llama-3.3-70b-versatile
```

| Variable               | Used by       | Description                                           |
| ---------------------- | ------------- | ----------------------------------------------------- |
| `PUBLIC_FORMSPREE_URL` | `/demo` page  | Formspree endpoint for the "Get a Demo" request form. |
| `GROQ_API_KEY`         | `api/chat.js` | LLM provider key. Read **server-side only**.          |
| `LLM_BASE_URL`         | `api/chat.js` | Optional. OpenAI-compatible base URL.                 |
| `LLM_MODEL`            | `api/chat.js` | Optional. Model id, e.g. `llama-3.3-70b-versatile`.   |

> [!CAUTION]
> **Never give a secret a `PUBLIC_` prefix.** SvelteKit writes _every_ `PUBLIC_*` variable
> present at build time into `_app/env.js`, which is served to the browser — **whether or
> not any code imports it**. Removing the import is not enough; renaming the variable is
> what matters. The chat key used to be `PUBLIC_LLM_API_KEY` and was readable at
> `https://crux.watch/_app/env.js` by anyone. It now lives behind `api/chat.js` as
> `GROQ_API_KEY`, and the browser never sees the provider, the model, or the key.
>
> Verify after any deploy: `curl -s https://crux.watch/_app/env.js` must contain no secret.
>
> The widget's daily question cap is `localStorage`-based and therefore cosmetic. Real cost
> protection is the size limits in `api/chat.js` plus a spending limit set in the provider
> dashboard.

## Project Structure

```
src/
├── routes/
│   ├── +layout.svelte        # Global — Navbar (non-docs) + AIChatWidget
│   ├── +page.svelte          # Landing page — composes all sections
│   ├── demo/                 # "Get a Demo" request form (Formspree)
│   └── docs/                 # Documentation site
│       ├── +layout.svelte    # Docs shell
│       ├── +page.svelte      # Docs index
│       └── [slug]/           # One prerendered page per doc module
└── lib/
    ├── components/
    │   ├── AIChatWidget.svelte  # Floating "Crux Assistant" chat
    │   ├── sections/            # Landing-page sections (Hero, Demo, …)
    │   └── ui/                  # Reusable primitives (Badge, Callout, …)
    ├── actions/reveal.ts        # Bidirectional scroll-reveal action
    ├── docs.ts                  # Documentation content (37 modules) + types
    └── app.css                  # Tailwind v4 theme tokens + scrollbar

static/
├── favicon.png              # 64px — browser tab
├── apple-touch-icon.png     # 180px — iOS home screen
├── crux-logo.png            # 256px — navbar, footer, docs, network hub
├── og-image.png             # 1200×630 — link previews
└── logos/                   # Vendor logo files (Arista, Aruba, Ruijie…)

api/
└── chat.js                  # Serverless function backing the chat widget

assets-source/               # Logo masters — NOT deployed. See its README.
```

> Internal architecture, section order, and **how to add a documentation page** are
> covered in [`src/lib/README.md`](src/lib/README.md).

## Routes

| Path           | Description                                          |
| -------------- | ---------------------------------------------------- |
| `/`            | Landing page — all sections composed in order.       |
| `/demo`        | "Get a Demo" request form (1 submission per device). |
| `/docs`        | Documentation index.                                 |
| `/docs/[slug]` | A single prerendered doc module page (37 total).     |

## Landing-Page Sections

Rendered in this order in `src/routes/+page.svelte`:

| #   | Section       | Description                                                 |
| --- | ------------- | ----------------------------------------------------------- |
| —   | Hero          | Rotating headline, animated background paths, CTA           |
| —   | VendorStrip   | Scrolling vendor logo marquee                               |
| —   | Demo          | Crux Cloud teaser → links to `/demo`                        |
| —   | Introduction  | Self-Hosted vs Cloud deployment cards                       |
| 01  | FeatureOrbit  | Interactive feature orbit — Monitor, Automate, AI, Security |
| 02  | NetworkHub    | Network hub diagram — Crux connected to vendor nodes        |
| 03  | UseCases      | Role-based use case cards                                   |
| 04  | AgentFeatures | Draggable sticky notes with AI agent command examples       |
| 05  | Faq           | Accordion FAQ                                               |
| —   | Footer        | Pre-footer CTA + 4-column footer                            |

`Navbar` (non-docs pages) and `AIChatWidget` render globally from the layout.

## Deploying to a Static Host

1. Push to GitHub.
2. Import the repository in your host (Vercel, Netlify, Cloudflare Pages…).
3. SvelteKit + `adapter-static` is auto-detected — no framework override needed.
4. Add the environment variables above under the host's project settings. Give the LLM key
   the name `GROQ_API_KEY` — **not** `PUBLIC_LLM_API_KEY`, which would publish it (see the
   caution above).
5. Deploy. If the host offers a build cache, skip it after changing an env var: `env.js` is
   written at build time, so a cached build can resurrect an old value.

- Build command: `bun run build`
- Output directory: `build`

### `cleanUrls` is load-bearing

`vercel.json` sets `"cleanUrls": true`, and it is not cosmetic. `adapter-static` emits
`demo.html` and `docs/introduction.html`, but the navbar, footer and CTA buttons all link to
the extensionless `/demo` and `/docs/introduction`. Without `cleanUrls` the host does not
match those paths, and **every page except the homepage 404s** — which is exactly what
happened in production. On a host other than Vercel, find its equivalent setting.

JSON allows no comments and `vercel.json` rejects unknown keys, so this note lives here.

### The chat endpoint

`api/chat.js` is a serverless function, not part of the static build. Vercel picks up the
`api/` directory automatically alongside `adapter-static`. After deploying, confirm it:

```bash
curl -s -X POST https://crux.watch/api/chat -H 'Content-Type: application/json' \
  -d '{"messages":[{"role":"user","content":"What is Crux?"}]}'
```

`{"error":"Assistant is not configured."}` means `GROQ_API_KEY` is missing. A `404` means the
host is not serving `api/` at all, and the project needs `adapter-vercel` instead.

## License

MIT
