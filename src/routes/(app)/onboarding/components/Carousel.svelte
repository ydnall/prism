<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	interface Props {
		slides: Array<{
			title: string;
			highlight: string;
			subtitle: string;
		}>;
		onComplete?: () => void;
	}

	let { slides, onComplete }: Props = $props();

	let current = $state(0);
	let interval: ReturnType<typeof setInterval> | null = null;
	let hasReachedThird = $state(false);

	onMount(() => {
		startCarousel();
	});

	onDestroy(() => {
		if (interval) clearInterval(interval);
	});

	function startCarousel() {
		interval = setInterval(() => {
			current = (current + 1) % slides.length;

			if (current === 2 && !hasReachedThird) {
				hasReachedThird = true;
				setTimeout(() => {
					onComplete?.();
				}, 300);
			}
		}, 4000);
	}

	function goTo(index: number) {
		current = index;
		if (interval) clearInterval(interval);
		startCarousel();
	}

	function formatTitle(title: string, highlight: string) {
		const parts = title.split(highlight);
		return { before: parts[0], highlight, after: parts[1] || '' };
	}
</script>

<div class="mx-auto max-w-2xl text-center">
	<!-- Triangle indicators -->
	<div class="mb-2 flex justify-center gap-2">
		{#each slides as slide, i (slide.title)}
			<button
				onclick={() => goTo(i)}
				class="transition-all duration-300"
				aria-label="Go to slide {i + 1}"
			>
				<svg
					class="h-3 w-3 {i === current
						? 'text-accent scale-125'
						: 'text-text/20 hover:text-text/30'}"
					viewBox="0 0 100 100"
				>
					{#if i % 2 === 0}
						<polygon points="50,90 90,10 10,10" fill="currentColor" />
					{:else}
						<polygon points="50,10 90,90 10,90" fill="currentColor" />
					{/if}
				</svg>
			</button>
		{/each}
	</div>

	<!-- Carousel content -->
	<div class="grid place-items-center">
		{#each slides as slide, i (slide.title)}
			<div
				class="col-start-1 row-start-1 w-full text-center transition-all duration-500
					{i === current ? 'visible opacity-100' : 'invisible opacity-0'}"
				style={i === current ? 'transform: translateY(0)' : 'transform: translateY(10px)'}
			>
				<h2 class="mb-4 text-4xl leading-[0.95] font-bold tracking-tight md:text-5xl lg:text-6xl">
					{formatTitle(slide.title, slide.highlight).before}<span class="text-accent"
						>{slide.highlight}</span
					>{formatTitle(slide.title, slide.highlight).after}
				</h2>
				<p class="text-text-muted text-lg leading-relaxed md:text-xl">
					{slide.subtitle}
				</p>
			</div>
		{/each}
	</div>
</div>
