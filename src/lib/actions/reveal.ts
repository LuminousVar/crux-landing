// Reveal-on-scroll action: fades a node up/down as it enters or leaves the viewport.
// Adds/removes `is-visible`; CSS in app.css handles the transition and reduced-motion.
export function reveal(node: HTMLElement) {
	const io = new IntersectionObserver(
		([entry]) => {
			if (entry.isIntersecting) {
				node.classList.add('is-visible');
			} else {
				node.classList.remove('is-visible');
			}
		},
		{ threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
	);
	io.observe(node);
	return {
		destroy() {
			io.disconnect();
		}
	};
}
