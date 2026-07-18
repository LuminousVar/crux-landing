import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const prerender = true;

// API Reference moved out of /docs into its own top-level /api section. Keep the old
// URL working for bookmarks and external links — prerenders as a static redirect.
export const load: PageServerLoad = () => {
	redirect(308, '/api');
};
