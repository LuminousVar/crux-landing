# Crux — Company Profile

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
# Demo request form (src/routes/demo)
PUBLIC_FORMSPREE_URL=https://formspree.io/f/YOUR_FORM_ID

# AI Chat Widget — get a free key at console.groq.com
PUBLIC_LLM_BASE_URL=https://api.groq.com/openai/v1
PUBLIC_LLM_API_KEY=YOUR_KEY
PUBLIC_LLM_MODEL=llama-3.3-70b-versatile
```

| Variable               | Used by        | Description                                             |
| ---------------------- | -------------- | ------------------------------------------------------- |
| `PUBLIC_FORMSPREE_URL` | `/demo` page   | Formspree endpoint for the "Get a Demo" request form.   |
| `PUBLIC_LLM_BASE_URL`  | AI Chat Widget | OpenAI-compatible base URL (Groq, DeepSeek, Ollama, …). |
| `PUBLIC_LLM_API_KEY`   | AI Chat Widget | API key for the LLM provider.                           |
| `PUBLIC_LLM_MODEL`     | AI Chat Widget | Model id, e.g. `llama-3.3-70b-versatile`.               |

> [!WARNING]
> All `PUBLIC_*` variables are **embedded in the browser bundle**. `PUBLIC_LLM_API_KEY`
> is visible to anyone who inspects the site. The in-app daily question cap is only a
> casual-abuse mitigation — set a **spending / rate limit on the key in your provider
> dashboard** (e.g. Groq) for real cost protection.

For static-host deployment, add these variables in your host's project settings.

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
├── crux-logo-nobg.svg
├── favicon.svg
└── logos/                    # Vendor logo files (Arista, Aruba, Ruijie…)
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
4. Add the environment variables above under the host's project settings.
5. Deploy.

- Build command: `bun run build`
- Output directory: `build`

## License

MIT
