// Reveal-on-scroll action: fades a node up once when it enters the viewport.
// Adds `is-visible`; CSS in app.css handles the transition and reduced-motion.
export function reveal(node: HTMLElement) {
	const io = new IntersectionObserver(
		([entry]) => {
			if (entry.isIntersecting) {
				node.classList.add('is-visible');
				io.unobserve(node); // trigger once — no re-fade on scroll-up
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
