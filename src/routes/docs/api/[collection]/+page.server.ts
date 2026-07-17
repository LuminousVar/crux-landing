import { apiCollections, apiMeta, getCollection } from '$lib/api-reference';
import { error } from '@sveltejs/kit';
import { codeToHtml } from 'shiki';
import type { EntryGenerator, PageServerLoad } from './$types';

export const prerender = true;

export const entries: EntryGenerator = () => apiCollections.map((c) => ({ collection: c.slug }));

export const load: PageServerLoad = async ({ params }) => {
	const collection = getCollection(params.collection);
	if (!collection) error(404, 'API collection not found');

	// Pre-highlight the cURL and JavaScript samples at build time (same Shiki setup
	// as the module docs), so each endpoint ships ready-rendered HTML.
	const endpoints = await Promise.all(
		collection.endpoints.map(async (ep) => ({
			...ep,
			curlHtml: await codeToHtml(ep.curl, { lang: 'bash', theme: 'one-dark-pro' }),
			fetchHtml: await codeToHtml(ep.fetchJs, { lang: 'javascript', theme: 'one-dark-pro' })
		}))
	);

	return {
		collection: {
			slug: collection.slug,
			label: collection.label,
			description: collection.description
		},
		endpoints,
		meta: apiMeta
	};
};
