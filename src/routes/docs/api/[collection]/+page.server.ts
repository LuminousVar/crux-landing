import { redirect } from '@sveltejs/kit';
import { apiCollections } from '$lib/api-reference';
import type { EntryGenerator, PageServerLoad } from './$types';

export const prerender = true;

// Enumerate the old per-collection URLs so each prerenders as a static redirect.
export const entries: EntryGenerator = () => apiCollections.map((c) => ({ collection: c.slug }));

export const load: PageServerLoad = ({ params }) => {
	redirect(308, `/api/${params.collection}`);
};
