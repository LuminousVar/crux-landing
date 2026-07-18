import type { LayoutServerLoad } from './$types';

export const prerender = true;

// The docs sidebar is built entirely from the static docGroups import, so the shell
// needs no server data. Kept so `prerender = true` cascades to /docs and /docs/[slug].
export const load: LayoutServerLoad = () => {
	return {};
};
