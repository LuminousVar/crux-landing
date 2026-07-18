import { docGroups } from '$lib/docs';
import { apiCollections } from '$lib/api-reference';
import type { RequestHandler } from './$types';

// Prerendered into a static sitemap.xml at build time, so it costs nothing to serve and
// there is no route to keep alive. Generated from docGroups rather than hand-written:
// the site has 40 indexable pages and a hand-maintained list goes stale the first time a
// docs module is added.
export const prerender = true;

const SITE_URL = 'https://crux.watch';

const STATIC_PAGES = [
	'/',
	'/docs',
	'/demo',
	'/api',
	'/pricing',
	'/pricing/self-host',
	'/self-host',
	'/cloud'
];

export const GET: RequestHandler = () => {
	const docPages = docGroups.flatMap((g) => g.modules.map((m) => `/docs/${m.slug}`));
	const apiPages = apiCollections.map((c) => `/api/${c.slug}`);
	const paths = [...STATIC_PAGES, ...docPages, ...apiPages];

	const urls = paths
		.map((path) => {
			// The landing page is the entry point; docs and API pages are reference material.
			const priority =
				path === '/' ? '1.0' : path.startsWith('/docs/') || path.startsWith('/api/') ? '0.6' : '0.8';
			return `	<url>
		<loc>${SITE_URL}${path}</loc>
		<changefreq>weekly</changefreq>
		<priority>${priority}</priority>
	</url>`;
		})
		.join('\n');

	return new Response(
		`<?xml version="1.0" encoding="UTF-8" ?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`,
		{ headers: { 'Content-Type': 'application/xml' } }
	);
};
