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

	const allModules = docGroups.flatMap((g) =>
		g.modules.map((m) => ({ slug: m.slug, label: m.label, groupLabel: g.label }))
	);
	const idx = allModules.findIndex((m) => m.slug === params.slug);
	const prevModule = idx > 0 ? allModules[idx - 1] : null;
	const nextModule = idx < allModules.length - 1 ? allModules[idx + 1] : null;

	// Resolve related slugs → { slug, label, groupLabel } cards (skip orphan slugs).
	const relatedModules = (module.related ?? [])
		.map((slug) => allModules.find((m) => m.slug === slug))
		.filter((m): m is (typeof allModules)[number] => m !== undefined);

	return {
		module,
		groups: docGroups,
		highlightedCommands,
		prevModule,
		nextModule,
		relatedModules
	};
};
