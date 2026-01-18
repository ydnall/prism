<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import type { Archetype } from '$lib/data/archetypes';

	interface Props {
		stats: {
			totalTime: number;
			avgResponseTime: number;
			fastestResponse: number;
			slowestResponse: number;
			instinctAnswers: number;
			timedOutAnswers: number;
		};
		answerCount: number;
		archetype: Archetype;
		topValues: { value: string; score: number }[];
		onRestart?: () => void;
		handleShare: () => void;
	}

	let { stats, answerCount, archetype, topValues, onRestart, handleShare }: Props = $props();

	let activeCard = $state(0);

	const formatTotalTime = (ms: number) => {
		const seconds = Math.floor(ms / 1000);
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return minutes > 0 ? `${minutes}m ${remainingSeconds}s` : `${seconds}s`;
	};

	const cards = $derived([
		{ value: formatTotalTime(stats.totalTime), label: 'total time' },
		{ value: String(answerCount), label: 'choices' },
		{ value: archetype.name.split(' ')[1], label: 'archetype', accent: true },
		{ value: topValues[0]?.value || '-', label: '#1 value' }
	]);

	function nextCard() {
		activeCard = (activeCard + 1) % cards.length;
	}

	function prevCard() {
		activeCard = (activeCard - 1 + cards.length) % cards.length;
	}

	let touchStartX = 0;
	let touchEndX = 0;

	function handleTouchStart(e: TouchEvent) {
		touchStartX = e.changedTouches[0].screenX;
	}

	function handleTouchEnd(e: TouchEvent) {
		touchEndX = e.changedTouches[0].screenX;
		handleSwipe();
	}

	function handleSwipe() {
		const diff = touchStartX - touchEndX;
		if (Math.abs(diff) > 50) {
			if (diff > 0) nextCard();
			else prevCard();
		}
	}
</script>

<div class="w-full max-w-md text-center">
	<h2 class="text-text-muted mb-6 text-xl font-bold sm:mb-8 sm:text-2xl">Session Complete</h2>

	<!-- Mobile: Swipeable cards -->
	<div class="relative mb-8 sm:hidden">
		<!-- Card container -->
		<div
			class="bg-surface rounded-2xl p-8"
			ontouchstart={handleTouchStart}
			ontouchend={handleTouchEnd}
		>
			<!-- Navigation zones -->
			<button
				onclick={prevCard}
				class="absolute top-0 bottom-0 left-0 z-10 w-1/3"
				aria-label="Previous stat"
			></button>
			<button
				onclick={nextCard}
				class="absolute top-0 right-0 bottom-0 z-10 w-2/3"
				aria-label="Next stat"
			></button>

			<!-- Card content -->
			{#key activeCard}
				<div class="animate-in fade-in duration-200">
					<div class="text-4xl font-bold {cards[activeCard].accent ? 'text-accent' : ''}">
						{cards[activeCard].value}
					</div>
					<p class="text-text-muted mt-1 text-sm">{cards[activeCard].label}</p>
				</div>
			{/key}
		</div>

		<!-- Dots indicator -->
		<div class="mt-4 flex justify-center gap-2">
			{#each cards as _, i}
				<button
					onclick={() => (activeCard = i)}
					class="h-2 w-2 rounded-full transition-all {i === activeCard
						? 'bg-accent w-4'
						: 'bg-text/20'}"
					aria-label="Go to stat {i + 1}"
				></button>
			{/each}
		</div>

		<!-- Swipe hint -->
		<p class="text-text-muted/50 mt-3 text-xs">Swipe to see more</p>
	</div>

	<!-- Desktop: Grid layout -->
	<div class="mb-10 hidden grid-cols-2 gap-4 sm:grid">
		{#each cards as card}
			<div class="bg-surface rounded-2xl p-5">
				<div class="text-3xl font-bold {card.accent ? 'text-accent' : ''}">
					{card.value}
				</div>
				<p class="text-text-muted text-sm">{card.label}</p>
			</div>
		{/each}
	</div>

	<div class="flex flex-col gap-3">
		<Button variant="secondary" onclick={handleShare}>Share</Button>
		<Button variant="outline" onclick={onRestart}>Back to home</Button>
	</div>
</div>
