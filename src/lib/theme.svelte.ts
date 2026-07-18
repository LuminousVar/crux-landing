// Small reactive theme holder. The initial value is read from the <html>
// data-theme attribute that the inline script in app.html sets before paint,
// so there is no flash and no hydration mismatch.

type Theme = 'light' | 'dark';

function initialTheme(): Theme {
	if (typeof document === 'undefined') return 'dark';
	const attr = document.documentElement.getAttribute('data-theme');
	if (attr === 'light' || attr === 'dark') return attr;
	return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

export const theme = $state<{ value: Theme }>({ value: initialTheme() });

export function toggleTheme() {
	theme.value = theme.value === 'dark' ? 'light' : 'dark';
	document.documentElement.setAttribute('data-theme', theme.value);
	try {
		localStorage.setItem('theme', theme.value);
	} catch {
		/* localStorage unavailable (private mode) — the in-memory value still applies */
	}
}
