import { apiCollections, apiMeta } from '$lib/api-reference';
import type { PageServerLoad } from './$types';

export const prerender = true;

export const load: PageServerLoad = () => {
	const collections = apiCollections.map((c) => ({
		slug: c.slug,
		label: c.label,
		description: c.description,
		count: c.endpoints.length,
		methods: [...new Set(c.endpoints.map((e) => e.method))]
	}));
	return { collections, meta: apiMeta };
};
