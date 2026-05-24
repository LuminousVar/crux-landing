import { docGroups } from '$lib/docs';
import { error } from '@sveltejs/kit';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () =>
	docGroups.flatMap((g) => g.modules.map((m) => ({ slug: m.slug })));

export const load: PageLoad = ({ params }) => {
	const module = docGroups
		.flatMap((g) => g.modules.map((m) => ({ ...m, groupLabel: g.label, groupKey: g.key })))
		.find((m) => m.slug === params.slug);

	if (!module) error(404, 'Module not found');
	return { module, groups: docGroups };
};
