<script lang="ts">
	import Carousel from './Carousel.svelte';
	import CTA from './CTA.svelte';

	interface Props {
		onBegin?: () => void;
	}

	let { onBegin }: Props = $props();

	const slides = [
		{
			title: 'Everyone claims the same values',
			highlight: 'same values',
			subtitle: 'Honesty. Loyalty. Compassion.'
		},
		{
			title: 'Four parts. Three minutes.',
			highlight: 'Three minutes.',
			subtitle: 'Instinct. Allocation. Trade-offs. The hard ones.'
		},
		{
			title: 'See your contradictions',
			highlight: 'contradictions',
			subtitle: 'Do your words align with you actions?'
		}
	];

	let showCTA = $state(false);

	function handleCarouselComplete() {
		showCTA = true;
	}
</script>

<section class="flex h-full flex-col items-center justify-center">
	<!-- Carousel -->
	<div class="relative z-10 pb-12 md:pb-16">
		<Carousel {slides} onComplete={handleCarouselComplete} />
	</div>

	<!-- CTA -->
	<div class="relative z-10 pt-12 md:pb-16">
		<CTA {showCTA} {onBegin} />
	</div>
</section>
