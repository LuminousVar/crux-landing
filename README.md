# Crux — Company Profile

Landing page for the [Crux](https://github.com/LuminousVar/crux-landing) open-source network operations platform. Built as a fully static site with SvelteKit and Tailwind CSS v4.

## Stack

| Layer | Tool |
|---|---|
| Framework | SvelteKit + `@sveltejs/adapter-static` |
| Language | TypeScript (strict, Svelte 5 runes) |
| Styling | Tailwind CSS v4 |
| Icons | lucide-svelte, simple-icons |
| Package Manager | bun |
| Deployment | Vercel (static) |

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

## Building

```bash
bun run build
bun run preview
```

Output is in `build/` — fully static, no server required.

## Environment Variables

Create a `.env` file at the project root:

```env
PUBLIC_FORMSPREE_URL=https://formspree.io/f/your-form-id
```

| Variable | Description |
|---|---|
| `PUBLIC_FORMSPREE_URL` | Formspree endpoint for the AI Agent feature suggestion form |

For Vercel deployment, add this variable under **Project Settings → Environment Variables**.

## Project Structure

```
src/
├── routes/
│   ├── +layout.svelte       # Global layout — Navbar + global styles
│   ├── +page.svelte         # Main page — composes all sections
│   └── docs/                # Documentation pages
└── lib/
    ├── components/
    │   ├── sections/        # Page sections (Hero, Introduction, NetworkHub…)
    │   └── ui/              # Reusable primitives (Badge, FaqItem…)
    └── app.css              # Tailwind v4 theme tokens

static/
├── crux-logo-nobg.svg
├── favicon.svg
└── logos/                   # Vendor logo files (Arista, Aruba, Ruijie…)
```

## Sections

| # | Section | Description |
|---|---|---|
| — | Hero | Rotating headline, animated background paths, CTA |
| — | VendorStrip | Scrolling vendor logo marquee |
| — | Introduction | Self-Hosted vs Cloud deployment cards (Vercel-style) |
| 01 | Features | Interactive feature orbit — Monitor, Automate, AI, Security |
| 02 | Integrations | Network hub diagram — Crux connected to 8 vendor nodes |
| 03 | Use Cases | Role-based use case cards |
| 04 | AI Agent | Draggable sticky note cards with AI agent command examples |
| 05 | FAQ | Accordion FAQ |
| — | Footer | Pre-footer CTA with gradient + 4-column footer |

## Deploying to Vercel

1. Push to GitHub
2. Import the repository in Vercel
3. Vercel auto-detects SvelteKit — no framework override needed
4. Add `PUBLIC_FORMSPREE_URL` under Environment Variables
5. Deploy

Build command: `bun run build`  
Output directory: `build`

## License

MIT
