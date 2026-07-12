import {
	Activity,
	Archive,
	Bell,
	BookA,
	BookMarked,
	BookOpen,
	Bot,
	Boxes,
	BrainCircuit,
	CalendarClock,
	ClipboardList,
	FileText,
	GitBranch,
	HardDrive,
	KeyRound,
	KeySquare,
	Layers,
	LayoutDashboard,
	MapPin,
	Network,
	Plug,
	Rss,
	ScrollText,
	Server,
	Settings,
	ShieldAlert,
	ShieldCheck,
	Sliders,
	Terminal,
	Users,
	Workflow,
	Wrench,
	Zap
} from 'lucide-svelte';

/**
 * Explicit name → component map for the icons named in `docs.ts`.
 *
 * The docs pages used to do `import * as Icons from 'lucide-svelte'` and then reach for
 * `Icons[module.icon]`. A namespace import indexed by a runtime string cannot be
 * tree-shaken — the bundler has no way to know which icons are live — so all ~1,500 of
 * them shipped, in an 838 KB chunk. Only the 33 below are ever used.
 *
 * The cost of this approach is that adding an `icon:` to docs.ts without adding it here
 * silently renders nothing. `docIcon()` returns undefined in that case, and the callers
 * guard on it.
 */
// Every lucide icon shares one signature, so any of them serves as the archetype.
// Svelte's own `Component` type does not match theirs.
type LucideIcon = typeof Activity;

const DOC_ICONS: Record<string, LucideIcon> = {
	Activity,
	Archive,
	Bell,
	BookA,
	BookMarked,
	BookOpen,
	Bot,
	Boxes,
	BrainCircuit,
	CalendarClock,
	ClipboardList,
	FileText,
	GitBranch,
	HardDrive,
	KeyRound,
	KeySquare,
	Layers,
	LayoutDashboard,
	MapPin,
	Network,
	Plug,
	Rss,
	ScrollText,
	Server,
	Settings,
	ShieldAlert,
	ShieldCheck,
	Sliders,
	Terminal,
	Users,
	Workflow,
	Wrench,
	Zap
};

export function docIcon(name: string): LucideIcon | undefined {
	return DOC_ICONS[name];
}
