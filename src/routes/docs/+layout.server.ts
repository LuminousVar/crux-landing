import { apiNav } from '$lib/api-reference';
import type { LayoutServerLoad } from './$types';

export const prerender = true;

// The API Reference nav (slug + label + count only) is resolved at build time and
// handed to the sidebar. Importing api-reference here keeps the 360 KB openapi.json
// snapshot on the server/build side — it never enters the client bundle.
export const load: LayoutServerLoad = () => {
	return { apiNav: apiNav() };
};
