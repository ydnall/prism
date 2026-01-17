<script lang="ts">
	import { onMount } from 'svelte';
	import { scale } from 'svelte/transition';
	import { backOut } from 'svelte/easing';

	let stage = $state(0);

	onMount(() => {
		setTimeout(() => (stage = 1), 50);
		setTimeout(() => (stage = 2), 800);
	});
</script>

<div class="pointer-events-none fixed inset-0 z-0 h-svh w-full overflow-hidden">
	<!-- ==================== STAGE 1: CENTER PRISM (INVERTED) ==================== -->
	{#if stage >= 1}
		<!-- Outer prism outline -->
		<svg
			class="absolute top-1/2 left-1/2 h-[35vh] w-[35vh] -translate-x-1/2 -translate-y-1/2 md:h-[40vh] md:w-[40vh]"
			viewBox="0 0 100 100"
			in:scale={{ start: 0.6, duration: 1200, easing: backOut }}
		>
			<polygon
				points="50,95 98,10 2,10"
				fill="none"
				stroke="var(--color-accent)"
				stroke-width="1.2"
				opacity="0.35"
			/>
		</svg>

		<!-- Inner prism fill -->
		<svg
			class="absolute top-1/2 left-1/2 h-[35vh] w-[35vh] -translate-x-1/2 -translate-y-1/2 md:h-[40vh] md:w-[40vh]"
			viewBox="0 0 100 100"
			in:scale={{ start: 0.4, duration: 1400, delay: 150, easing: backOut }}
		>
			<polygon points="50,78 82,22 18,22" fill="var(--color-accent)" opacity="0.06" />
		</svg>
	{/if}

	<!-- ==================== STAGE 2: SPACED CLUSTERS ==================== -->
	{#if stage >= 2}
		<!-- LEFT CLUSTER -->

		<!-- Orange outline -->
		<svg
			class="absolute bottom-[8vh] left-[4vw] h-16 w-16 rotate-[5deg] md:bottom-[6vh] md:left-[6vw] md:h-24 md:w-24"
			viewBox="0 0 100 100"
			in:scale={{ start: 0.4, duration: 1000, easing: backOut }}
		>
			<polygon
				points="50,10 90,85 10,85"
				fill="none"
				stroke="var(--color-accent)"
				stroke-width="2"
				opacity="0.3"
			/>
		</svg>

		<!-- Black filled -->
		<svg
			class="absolute bottom-[18vh] left-[22vw] h-6 w-6 -rotate-[15deg] md:bottom-[14vh] md:left-[20vw] md:h-10 md:w-10"
			viewBox="0 0 100 100"
			in:scale={{ start: 0.3, duration: 900, delay: 150, easing: backOut }}
		>
			<polygon points="50,10 90,85 10,85" fill="var(--color-text)" opacity="0.12" />
		</svg>

		<!-- RIGHT CLUSTER -->

		<!-- Orange outline -->
		<svg
			class="absolute right-[5vw] bottom-[10vh] h-18 w-18 -rotate-[8deg] md:right-[7vw] md:bottom-[8vh] md:h-26 md:w-26"
			viewBox="0 0 100 100"
			in:scale={{ start: 0.4, duration: 1000, delay: 100, easing: backOut }}
		>
			<polygon
				points="50,10 90,85 10,85"
				fill="none"
				stroke="var(--color-accent)"
				stroke-width="2"
				opacity="0.28"
			/>
		</svg>

		<!-- Black filled -->
		<svg
			class="absolute right-[24vw] bottom-[22vh] h-7 w-7 rotate-[20deg] md:right-[22vw] md:bottom-[18vh] md:h-11 md:w-11"
			viewBox="0 0 100 100"
			in:scale={{ start: 0.3, duration: 900, delay: 250, easing: backOut }}
		>
			<polygon points="50,10 90,85 10,85" fill="var(--color-text)" opacity="0.1" />
		</svg>

		<!-- Orange spark -->
		<svg
			class="absolute bottom-[5vh] left-1/2 h-4 w-4 -translate-x-1/2 md:bottom-[4vh] md:h-5 md:w-5"
			viewBox="0 0 100 100"
			in:scale={{ start: 0.2, duration: 800, delay: 350, easing: backOut }}
		>
			<polygon points="50,10 90,85 10,85" fill="var(--color-accent)" opacity="0.45" />
		</svg>
	{/if}
</div>
