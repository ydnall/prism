<script lang="ts">
	import { onMount } from 'svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { MoveRight } from '@lucide/svelte';
	import { fly, scale } from 'svelte/transition';
	import { cubicOut, quintOut, backOut } from 'svelte/easing';

	interface Props {
		onStart?: () => void;
	}

	let { onStart }: Props = $props();

	let mounted = $state(false);

	const prismLetters = [
		{ char: 'P', accent: true },
		{ char: 'R', accent: false },
		{ char: 'I', accent: false },
		{ char: 'S', accent: false },
		{ char: 'M', accent: false }
	];

	onMount(() => {
		setTimeout(() => {
			mounted = true;
		}, 100);
	});
</script>

<section class="flex flex-1 flex-col items-center justify-center">
	<!-- Get Your PRISM -->
	<div class="relative z-10 pb-3 sm:pb-12 md:pb-16">
		<h1
			class="text-center text-7xl leading-none font-bold tracking-tighter md:text-[12vw] lg:text-[10vw]"
		>
			<!-- "Get your " -->
			{#if mounted}
				<span class="inline-block" in:fly={{ y: -40, duration: 800, easing: quintOut }}
					>Get your
				</span>
			{/if}

			<!-- PRISM letters with staggered animation -->
			<span class="inline-block whitespace-nowrap">
				{#each prismLetters as letter, i (letter.char)}
					{#if mounted}
						<span
							class="inline-block origin-bottom {letter.accent ? 'text-accent italic' : ''}"
							in:fly={{ y: 60, duration: 900, delay: 300 + i * 120, easing: backOut }}
						>
							{letter.char}
						</span>
					{/if}
				{/each}
			</span>
		</h1>
	</div>

	<!-- What do you actually value -->
	<div class="relative z-10 py-6 sm:py-12 md:py-16">
		<div class="flex max-w-2xl flex-col items-center text-center">
			{#if mounted}
				<!-- Main question -->
				<h2 class="mb-4 text-4xl leading-[0.95] font-bold tracking-tight md:text-6xl lg:text-7xl">
					<span
						class="inline-block"
						in:fly={{ y: 30, duration: 800, delay: 1000, easing: cubicOut }}
					>
						What do you
					</span>
					<br />
					<span
						class="text-accent inline-block"
						in:fly={{ y: 20, duration: 700, delay: 1200, easing: cubicOut }}
					>
						actually
					</span>
					<span
						class="inline-block"
						in:fly={{ y: 20, duration: 700, delay: 1350, easing: cubicOut }}>value?</span
					>
				</h2>

				<!-- Description -->
				<p
					class="text-text-muted mb-6 text-lg leading-relaxed md:text-xl"
					in:fly={{ y: 20, duration: 700, delay: 1500, easing: cubicOut }}
				>
					Your choice matters. Not what you say.
				</p>

				<!-- CTA Button -->
				<div in:scale={{ start: 0.9, duration: 500, delay: 1800, easing: backOut }}>
					<Button onclick={onStart}>
						Start the audit
						<MoveRight
							class="ml-2 inline-block align-middle transition-transform group-hover:translate-x-1.5"
						/>
					</Button>
				</div>
			{/if}
		</div>
	</div>
</section>
