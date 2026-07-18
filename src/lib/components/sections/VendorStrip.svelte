<script lang="ts">
	import {
		siCisco,
		siJunipernetworks,
		siHuawei,
		siMikrotik,
		siUbiquiti,
		siFortinet,
		siPaloaltonetworks,
		siPfsense,
		siOpnsense,
		siF5,
		siCitrix,
		siLinux
	} from 'simple-icons';

	type Item = {
		label: string;
		path: string | null;
		imgSrc?: string;
		wordmark?: boolean;
	};

	const vendors: Item[] = [
		{ label: 'Cisco', path: siCisco.path },
		{ label: 'Juniper', path: siJunipernetworks.path },
		{ label: 'Arista', path: null, imgSrc: '/logos/arista.png', wordmark: true },
		{ label: 'Huawei', path: siHuawei.path },
		{ label: 'Aruba', path: null, imgSrc: '/logos/aruba.svg', wordmark: true },
		{ label: 'Ruijie', path: null, imgSrc: '/logos/ruijie.svg', wordmark: true },
		{ label: 'MikroTik', path: siMikrotik.path },
		{ label: 'Ubiquiti', path: siUbiquiti.path },
		{ label: 'VyOS', path: null, imgSrc: '/logos/vyos.svg', wordmark: false },
		{ label: 'Fortinet', path: siFortinet.path },
		{ label: 'Palo Alto', path: siPaloaltonetworks.path },
		{ label: 'Check Point', path: null, imgSrc: '/logos/checkpoint.svg', wordmark: true },
		{ label: 'Sophos', path: null, imgSrc: '/logos/sophos.svg', wordmark: true },
		{ label: 'pfSense', path: siPfsense.path },
		{ label: 'OPNsense', path: siOpnsense.path },
		{ label: 'F5', path: siF5.path },
		{ label: 'Citrix', path: siCitrix.path },
		{ label: 'Linux', path: siLinux.path }
	];

	// Duplicate for seamless -50% loop
	const track: Item[] = [...vendors, ...vendors];
</script>

<div class="relative overflow-hidden border-y border-edge bg-canvas py-4" aria-hidden="true">
	<!-- Fade edges -->
	<div
		class="pointer-events-none absolute inset-y-0 left-0 z-10 w-28 bg-gradient-to-r from-canvas to-transparent"
	></div>
	<div
		class="pointer-events-none absolute inset-y-0 right-0 z-10 w-28 bg-gradient-to-l from-canvas to-transparent"
	></div>

	<!-- Scrolling track -->
	<div class="marquee flex w-max items-center">
		{#each track as item, i (`${item.label}-${i}`)}
			{#if i > 0}
				<span class="shrink-0 select-none px-4 text-[10px] text-edge/50" aria-hidden="true">·</span>
			{/if}

			<div class="flex shrink-0 items-center">
				{#if item.imgSrc}
					{#if item.wordmark}
						<!-- Wordmark: image already contains the name -->
						<img src={item.imgSrc} alt={item.label} class="vendor-img h-4 w-auto shrink-0" />
					{:else}
						<!-- Icon mark: show image + text label -->
						<div class="flex items-center gap-2">
							<img src={item.imgSrc} alt={item.label} class="vendor-img h-4 w-auto shrink-0" />
							<span class="text-sm text-muted/60">{item.label}</span>
						</div>
					{/if}
				{:else if item.path}
					<!-- simple-icons: symbol + text label -->
					<div class="flex items-center gap-2">
						<svg
							viewBox="0 0 24 24"
							width="16"
							height="16"
							fill="currentColor"
							class="vendor-symbol shrink-0 text-muted"
							aria-hidden="true"
						>
							<path d={item.path} />
						</svg>
						<span class="text-sm text-muted/60">{item.label}</span>
					</div>
				{/if}
			</div>
		{/each}
	</div>
</div>

<style>
	.marquee {
		animation: vendor-scroll 55s linear infinite;
	}

	@keyframes vendor-scroll {
		from {
			transform: translateX(0);
		}
		to {
			transform: translateX(-50%);
		}
	}

	/* Image logos are normalised to white by the filter, so they read brighter than the
	   muted-grey simple-icon symbols. Keep their opacity a touch lower so every logo —
	   wordmark image or icon symbol — sits at the same visual weight. */
	.vendor-img {
		filter: var(--logo-filter);
		opacity: 0.5;
	}

	.vendor-symbol {
		opacity: 0.6;
	}
</style>
