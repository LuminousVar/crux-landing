# `src/lib` — Architecture Guide

Internals of the Crux company-profile site: how the landing page is composed, how the
documentation content system works, and how to extend each. For setup, env vars, and
deployment see the [root README](../../README.md).

## Layout

```
lib/
├── components/
│   ├── AIChatWidget.svelte   # Floating "Crux Assistant" chat (global)
│   ├── sections/             # Landing-page sections
│   └── ui/                   # Reusable primitives
├── actions/reveal.ts         # Bidirectional scroll-reveal Svelte action
├── docs.ts                   # Documentation content + TypeScript types
├── utils.ts                  # Helpers
├── index.ts                  # Barrel exports
└── assets/                   # Static imports used by components
```

All components use **Svelte 5 runes** (`$state`, `$derived`, `$effect`, `$props`).
The legacy Options API (`export let`, `$:`, legacy `onMount`) is not used.

## Landing page

`src/routes/+page.svelte` composes the sections in `components/sections/` in a fixed
order. Each section is wrapped in `<Reveal>` (except `Hero`) for scroll-reveal. The
section order is documented in the [root README](../../README.md#landing-page-sections).

`Navbar` (non-docs pages only) and `AIChatWidget` render globally from
`src/routes/+layout.svelte`.

### Scroll reveal — `actions/reveal.ts`

A Svelte action backed by `IntersectionObserver`. It toggles the `is-visible` class
**bidirectionally** — sections fade in when they enter the viewport and fade back out
when they leave (the observer is never disconnected). The visual transition lives in
`app.css` under `.js .reveal` and respects `prefers-reduced-motion`.

### AI Chat Widget — `components/AIChatWidget.svelte`

A floating assistant that answers visitor questions about Crux.

- Calls an **OpenAI-compatible** chat-completions endpoint configured via the
  `PUBLIC_LLM_*` env vars.
- State is **in-memory only** — history clears when the tab closes.
- A hardened system prompt grounds answers in a `FACTS ABOUT CRUX` block and includes
  anti-jailbreak rules (refuses off-topic requests, never discloses configuration).
- **Daily cap:** 15 questions/day per device, stored in `localStorage`
  (`crux_chat_usage` = `{ date, count }`), reset when the date changes. Incremented only
  after a successful response.

> The cap is casual-abuse mitigation, not security — the API key ships in the bundle.
> Real cost protection is a spending/rate limit set in the provider dashboard.

### Demo form — `src/routes/demo/+page.svelte`

Posts to Formspree (`PUBLIC_FORMSPREE_URL`). Limited to **one submission per device**
via `localStorage` (`crux_demo_requested`); the form is replaced with a thank-you state
once submitted.

## Documentation system

The docs site (`/docs`, `/docs/[slug]`) is driven entirely by **`docs.ts`** — a single
typed content file. There is no CMS and no markdown loader; each page is prerendered at
build time.

### Data shape

`docs.ts` exports `docGroups: DocGroup[]`. Each group has a `key`, a `label`, and an
array of `DocModule`s. There are **9 groups** and **37 modules**:

`getting-started` · `concepts` · `resources` · `monitoring` · `ai` · `automation` ·
`user-management` · `system` · `developer`

A `DocModule` has these fields (optional ones marked `?`):

| Field              | Type                        | Notes                                                         |
| ------------------ | --------------------------- | ------------------------------------------------------------- |
| `slug`             | `string`                    | URL segment — must be unique across all groups.               |
| `label`            | `string`                    | Page title + sidebar/nav label.                               |
| `icon`             | `string`                    | A `lucide-svelte` icon name.                                  |
| `description`      | `string`                    | One-line subtitle + `<meta description>`.                     |
| `overview`         | `string`                    | Intro paragraph.                                              |
| `capabilities`     | `string[]`                  | Bulleted capability list.                                     |
| `howItWorks`       | `string[]`                  | "How It Works" bullets.                                       |
| `steps`            | `string[]`                  | Numbered "Step-by-Step" list.                                 |
| `technicalNotes`   | `string[]`                  | Footnote-style notes.                                         |
| `appRoute?`        | `string`                    | Route in the Crux app; renders "Access in the Platform".      |
| `apiBase?`         | `string`                    | API base path shown in the meta row.                          |
| `access?`          | `string`                    | Required role / access note.                                  |
| `prerequisites?`   | `string[]`                  | Checklist before "Capabilities".                              |
| `commands?`        | `{ label; code }[]`         | Shell snippets, syntax-highlighted by Shiki at build.         |
| `commandsLabel?`   | `string`                    | Heading for the commands block (default "MikroTik Commands"). |
| `callouts?`        | `DocCallout[]`              | `note` / `warning` / `tip` boxes.                             |
| `tables?`          | `DocTable[]`                | Reference tables.                                             |
| `diagram?`         | `DocDiagram`                | ASCII diagram block.                                          |
| `troubleshooting?` | `{ problem; cause; fix }[]` | Troubleshooting cards.                                        |
| `faq?`             | `{ q; a }[]`                | Per-page FAQ.                                                 |
| `related?`         | `string[]`                  | Slugs of related modules → cross-link cards.                  |

### Rendering pipeline

- `routes/docs/[slug]/+page.server.ts` — `prerender = true`. Its `entries` generator
  emits one route per module slug. The `load` function finds the module, highlights any
  `commands` with **Shiki** (`one-dark-pro`, `bash`), computes **prev/next** navigation
  from the flattened module list, and resolves `related` slugs into cards (orphans are
  skipped).
- `routes/docs/[slug]/+page.svelte` — renders every section conditionally; optional
  fields simply don't render when absent.

### Adding a documentation page

1. Open `src/lib/docs.ts` and add a `DocModule` object to the appropriate `DocGroup`'s
   `modules` array (or add a new group). Give it a **unique `slug`**.
2. Fill the required fields (`slug`, `label`, `icon`, `description`, `overview`,
   `capabilities`, `howItWorks`, `steps`, `technicalNotes`); add optional fields as needed.
3. Use a valid `lucide-svelte` name for `icon`.
4. Point `related` only at slugs that exist — orphan references are dropped silently.
5. Run `bun run check` (types) and `bun run build`. The new `/docs/<slug>` page is
   prerendered automatically; prev/next and sidebar update from the data — no template
   edits required.

## Design tokens

Defined as CSS custom properties in `app.css` (`@theme`); Tailwind v4 auto-generates
the utility classes (`bg-canvas`, `text-content`, `border-edge`, `text-accent`, …).
Use token classes — avoid hardcoded hex in `.svelte` files. The dark theme is permanent.
