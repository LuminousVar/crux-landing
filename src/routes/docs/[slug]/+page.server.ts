import { docGroups } from '$lib/docs';
import { error } from '@sveltejs/kit';
import { codeToHtml } from 'shiki';
import type { EntryGenerator, PageServerLoad } from './$types';

export const prerender = true;

export const entries: EntryGenerator = () =>
	docGroups.flatMap((g) => g.modules.map((m) => ({ slug: m.slug })));

export const load: PageServerLoad = async ({ params }) => {
	const module = docGroups
		.flatMap((g) => g.modules.map((m) => ({ ...m, groupLabel: g.label, groupKey: g.key })))
		.find((m) => m.slug === params.slug);

	if (!module) error(404, 'Module not found');

	const highlightedCommands = module.commands
		? await Promise.all(
				module.commands.map(async ({ label, code }) => ({
					label,
					code,
					html: await codeToHtml(code, {
						lang: 'bash',
						theme: 'one-dark-pro'
					})
				}))
			)
		: [];

	return { module, groups: docGroups, highlightedCommands };
};
