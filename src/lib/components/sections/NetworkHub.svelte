<script lang="ts">
	import {
		siCisco,
		siJunipernetworks,
		siMikrotik,
		siHuawei,
		siFortinet,
		siPaloaltonetworks,
		siLinux,
		siUbiquiti
	} from 'simple-icons';

	const VB_W = 640;
	const VB_H = 440;
	const CX = VB_W / 2;
	const CY = VB_H / 2;
	const RADIUS = 155;
	const NODE_R = 30;
	const CENTER_R = 46;

	const vendors = [
		{ label: 'Cisco', path: siCisco.path, angle: 270 },
		{ label: 'Juniper', path: siJunipernetworks.path, angle: 315 },
		{ label: 'MikroTik', path: siMikrotik.path, angle: 0 },
		{ label: 'Huawei', path: siHuawei.path, angle: 45 },
		{ label: 'Linux', path: siLinux.path, angle: 90 },
		{ label: 'Fortinet', path: siFortinet.path, angle: 135 },
		{ label: 'Palo Alto', path: siPaloaltonetworks.path, angle: 180 },
		{ label: 'Ubiquiti', path: siUbiquiti.path, angle: 225 }
	];

	function pos(angle: number) {
		const rad = (angle * Math.PI) / 180;
		return { x: CX + RADIUS * Math.cos(rad), y: CY + RADIUS * Math.sin(rad) };
	}

	// Label snapped to horizontal axis of each node — diagonals extend left/right at same y
	function labelPos(angle: number) {
		const a = ((angle % 360) + 360) % 360;
		const rad = (angle * Math.PI) / 180;
		const nx = CX + RADIUS * Math.cos(rad);
		const ny = CY + RADIUS * Math.sin(rad);
		const gap = NODE_R + 14;

		if (a === 90) return { lx: nx, ly: ny + gap }; // pure bottom
		if (a === 270) return { lx: nx, ly: ny - gap }; // pure top
		if (a > 270 || a < 90) return { lx: nx + gap, ly: ny }; // right half (0°, 315°, 45°)
		return { lx: nx - gap, ly: ny }; // left half (180°, 135°, 225°)
	}

	function textAnchor(angle: number) {
		const a = ((angle % 360) + 360) % 360;
		if (a === 90 || a === 270) return 'middle';
		if (a > 270 || a < 90) return 'start';
		return 'end';
	}

	const nodes = vendors.map((v) => ({ ...v, ...pos(v.angle), ...labelPos(v.angle) }));
</script>

<section id="integrations" aria-labelledby="hub-heading" class="bg-canvas py-24">
	<div class="mx-auto max-w-6xl px-6">
		<p class="mb-4 font-mono text-xs uppercase tracking-widest text-muted">02 // Integrations</p>
		<h2 id="hub-heading" class="mb-4 text-4xl font-bold tracking-tight text-content md:text-5xl">
			One platform.<br />Every device.
		</h2>
		<p class="mb-16 max-w-xl text-base text-muted">
			Configure devices over <span class="text-content">SSH, Telnet, RESTCONF, or NETCONF</span> —
			and poll health metrics via <span class="text-content">SNMP</span>. 100+ vendor platforms
			supported via Netmiko and NAPALM, with no per-vendor configuration required.
		</p>

		<!-- Hub diagram -->
		<div class="mx-auto max-w-2xl">
			<svg
				viewBox="0 0 {VB_W} {VB_H}"
				xmlns="http://www.w3.org/2000/svg"
				aria-hidden="true"
				class="w-full"
			>
				<!-- Connection lines (vendor → center) -->
				{#each nodes as node, i}
					<line
						x1={node.x}
						y1={node.y}
						x2={CX}
						y2={CY}
						stroke="var(--color-edge)"
						stroke-width="1"
					/>
					<!-- Motion path (inward: vendor → center) -->
					<path
						id="mp-{i}"
						d="M {node.x} {node.y} L {CX} {CY}"
						fill="none"
						stroke="none"
					/>
					<!-- Animated dot traveling toward center -->
					<circle r="2.5" fill="var(--color-accent)" opacity="0.75">
						<animateMotion
							dur="{2.2 + (i % 4) * 0.35}s"
							repeatCount="indefinite"
							begin="{-(i * 0.55)}s"
						>
							<mpath href="#mp-{i}" />
						</animateMotion>
					</circle>
				{/each}

				<!-- Outer glow rings on center -->
				<circle
					cx={CX}
					cy={CY}
					r={CENTER_R + 22}
					fill="none"
					stroke="var(--color-accent)"
					stroke-width="0.75"
					stroke-opacity="0.12"
				/>
				<circle
					cx={CX}
					cy={CY}
					r={CENTER_R + 12}
					fill="none"
					stroke="var(--color-accent)"
					stroke-width="0.75"
					stroke-opacity="0.22"
				/>

				<!-- Center Crux node -->
				<circle
					cx={CX}
					cy={CY}
					r={CENTER_R}
					fill="var(--color-surface)"
					stroke="var(--color-accent)"
					stroke-width="1.5"
				/>
				<image
					href="/crux-logo-nobg.svg"
					x={CX - 22}
					y={CY - 22}
					width="44"
					height="44"
				/>

				<!-- Vendor nodes -->
				{#each nodes as node}
					<g>
						<circle
							cx={node.x}
							cy={node.y}
							r={NODE_R}
							fill="var(--color-elevated)"
							stroke="var(--color-edge)"
							stroke-width="1"
						/>
						<svg
							viewBox="0 0 24 24"
							width="18"
							height="18"
							x={node.x - 9}
							y={node.y - 9}
						>
							<path d={node.path} fill="var(--color-muted)" />
						</svg>
					</g>
				{/each}

				<!-- Vendor labels — placed radially outside each node -->
				{#each nodes as node}
					<text
						x={node.lx}
						y={node.ly}
						text-anchor={textAnchor(node.angle)}
						dominant-baseline="central"
						font-family="ui-monospace, 'Cascadia Code', monospace"
						font-size="10"
						fill="var(--color-muted)"
						opacity="0.6"
					>{node.label}</text>
				{/each}
			</svg>
		</div>
	</div>
</section>
