// Prerender the landing page to a static index.html.
// Without this, adapter-static (fallback: '404.html') skips the root route and
// the host serves 404.html with an HTTP 404 for '/'. Matches the per-page
// prerender pattern used by demo/ and docs/.
export const prerender = true;
