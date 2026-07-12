// Prerender everything by default.
//
// This used to be declared route by route — +page.ts, demo/+page.ts,
// docs/[slug]/+page.server.ts — and docs/+page.ts was simply missed, so the /docs index
// was never rendered to a file at all and 404'd in production. Opting in at the root
// makes the safe thing automatic: a new page is prerendered unless it explicitly says
// otherwise, rather than silently shipping broken.
export const prerender = true;
