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

	onMount(() => {
		startCarousel();
	});

	onDestroy(() => {
		if (interval) clearInterval(interval);
	});

	function startCarousel() {
		interval = setInterval(() => {
			if (current < slides.length - 1) {
				current++;
			} else {
				if (interval) clearInterval(interval);
				// Notify parent that carousel completed
				setTimeout(() => {
					onComplete?.();
				}, 500);
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
	<div class="mb-4 flex justify-center gap-2">
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
	<div class="flex min-h-[200px] items-center justify-center">
		{#each slides as slide, i (slide.title)}
			{@const formatted = formatTitle(slide.title, slide.highlight)}
			<div
				class="w-full text-center transition-opacity duration-500 {i === current
					? 'opacity-100'
					: 'hidden opacity-0'}"
			>
				<h2 class="mb-4 text-4xl leading-[0.95] font-bold tracking-tight md:text-5xl lg:text-6xl">
					{formatted.before}<span class="text-accent">{formatted.highlight}</span>{formatted.after}
				</h2>
				<p class="text-text-muted text-lg leading-relaxed md:text-xl">
					{slide.subtitle}
				</p>
			</div>
		{/each}
	</div>
</div>
