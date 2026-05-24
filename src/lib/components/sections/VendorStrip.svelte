<script lang="ts">
	/* eslint-disable @typescript-eslint/no-explicit-any */
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
	import * as Icons from 'lucide-svelte';

	type VendorItem = {
		kind: 'vendor';
		label: string;
		path: string | null; // null = no logo in simple-icons, show text fallback
	};

	type ProtocolItem = {
		kind: 'protocol';
		label: string;
		icon: string;
	};

	type Item = VendorItem | ProtocolItem;

	// All 18 Crux vendors — logo where available, null where not
	const vendors: VendorItem[] = [
		{ kind: 'vendor', label: 'Cisco',       path: siCisco.path            },
		{ kind: 'vendor', label: 'Juniper',      path: siJunipernetworks.path  },
		{ kind: 'vendor', label: 'Arista',       path: null                    },
		{ kind: 'vendor', label: 'Huawei',       path: siHuawei.path           },
		{ kind: 'vendor', label: 'Aruba',        path: null                    },
		{ kind: 'vendor', label: 'Ruijie',       path: null                    },
		{ kind: 'vendor', label: 'MikroTik',     path: siMikrotik.path         },
		{ kind: 'vendor', label: 'Ubiquiti',     path: siUbiquiti.path         },
		{ kind: 'vendor', label: 'VyOS',         path: null                    },
		{ kind: 'vendor', label: 'Fortinet',     path: siFortinet.path         },
		{ kind: 'vendor', label: 'Palo Alto',    path: siPaloaltonetworks.path },
		{ kind: 'vendor', label: 'Check Point',  path: null                    },
		{ kind: 'vendor', label: 'Sophos',       path: null                    },
		{ kind: 'vendor', label: 'pfSense',      path: siPfsense.path          },
		{ kind: 'vendor', label: 'OPNsense',     path: siOpnsense.path         },
		{ kind: 'vendor', label: 'F5',           path: siF5.path               },
		{ kind: 'vendor', label: 'Citrix',       path: siCitrix.path           },
		{ kind: 'vendor', label: 'Linux',        path: siLinux.path            },
	];

	// SNMP only
	const protocols: ProtocolItem[] = [
		{ kind: 'protocol', label: 'SNMP', icon: 'Activity' },
	];

	// 18 vendors with SNMP in the middle
	const items: Item[] = [
		vendors[0],  vendors[1],  vendors[2],  vendors[3],  vendors[4],
		vendors[5],  vendors[6],  vendors[7],  vendors[8],
		protocols[0],
		vendors[9],  vendors[10], vendors[11], vendors[12], vendors[13],
		vendors[14], vendors[15], vendors[16], vendors[17],
	];

	// Duplicate for seamless -50% loop
	const track: Item[] = [...items, ...items];
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
			<div class="flex shrink-0 items-center px-5">
				{#if item.kind === 'vendor'}
					<div class="flex items-center gap-2">
						{#if item.path}
							<!-- Official simple-icons logo -->
							<svg
								viewBox="0 0 24 24"
								width="15"
								height="15"
								fill="currentColor"
								class="shrink-0 text-muted/50"
								aria-hidden="true"
							>
								<path d={item.path} />
							</svg>
							<span class="text-sm text-muted/60">{item.label}</span>
						{:else}
							<!-- Text-only fallback for brands not in simple-icons -->
							<span
								class="inline-flex h-[18px] items-center rounded border border-edge/60 px-1.5 font-mono text-[10px] leading-none text-muted/35"
							>
								{item.label}
							</span>
						{/if}
					</div>
				{:else}
					<!-- Protocol item -->
					{@const Icon = (Icons as any)[item.icon]}
					<div class="flex items-center gap-1.5">
						<Icon size={11} class="shrink-0 text-muted/30" />
						<span class="font-mono text-[10px] uppercase tracking-widest text-muted/30"
							>{item.label}</span
						>
					</div>
				{/if}
			</div>
			<!-- Dot separator -->
			<span class="shrink-0 select-none text-[10px] text-edge/60" aria-hidden="true">·</span>
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
</style>
