<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { auditStore } from '$lib/stores/audit';
	import IntroSlide from './IntroSlide.svelte';
	import ArchetypeSlide from './ArchetypeSlide.svelte';
	import ValuesSlide from './ValuesSlide.svelte';
	import DecisionStyleSlide from './DecisionStyleSlide.svelte';
	import AllocationSlide from './AllocationSlide.svelte';
	import ContradictionsSlide from './ContradictionsSlide.svelte';
	import StatsSlide from './StatsSlide.svelte';
	import {
		calculateArchetype,
		findContradictions,
		getTopValues,
		getValueLabel,
		type Archetype,
		type Contradiction,
		type ValueScores
	} from '$lib/data/archetypes';

	interface Props {
		onRestart?: () => void;
	}

	let { onRestart }: Props = $props();

	let mounted = $state(false);
	let currentSlide = $state(0);
	let archetype = $state<Archetype | null>(null);
	let valueScores = $state<ValueScores | null>(null);
	let contradictions = $state<Contradiction[]>([]);
	let topValues = $state<{ value: string; score: number }[]>([]);
	let stats = $state({
		totalTime: 0,
		avgResponseTime: 0,
		fastestResponse: 0,
		slowestResponse: 0,
		instinctAnswers: 0,
		timedOutAnswers: 0
	});
	let allocation = $state<Record<string, number>>({});
	let answerCount = $state(0);
	let answers = $state<{ questionId: string; optionIndex: number }[]>([]);

	// Swipe tracking
	let touchStartX = $state(0);
	let touchStartY = $state(0);
	let isSwiping = $state(false);

	const totalSlides = 7;
	const SWIPE_THRESHOLD = 50;
	const SWIPE_ANGLE_THRESHOLD = 30; // degrees

	onMount(() => {
		const unsubscribe = auditStore.subscribe((state) => {
			answerCount = state.answers.length;
			allocation = state.allocation;
			answers = state.answers.map((answer) => ({
				questionId: answer.questionId,
				optionIndex: answer.optionIndex
			}));
		});

		const init = async () => {
			if (answerCount === 0) {
				const resolved = resolve('/');
				await goto(resolved);
				return;
			}

			valueScores = auditStore.getValueScores();
			archetype = calculateArchetype(valueScores, answers);
			topValues = getTopValues(valueScores, 4).map((v) => ({
				value: getValueLabel(v.value),
				score: v.score
			}));
			contradictions = findContradictions(valueScores, answers);

			stats = auditStore.getStats();
			mounted = true;

			window.addEventListener('keydown', handleKeydown);
		};

		void init();

		return () => {
			unsubscribe();
			window.removeEventListener('keydown', handleKeydown);
		};
	});

	function nextSlide() {
		if (currentSlide < totalSlides - 1) {
			currentSlide++;
		}
	}

	function prevSlide() {
		if (currentSlide > 0) {
			currentSlide--;
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowRight' || e.key === ' ') {
			e.preventDefault();
			nextSlide();
		} else if (e.key === 'ArrowLeft') {
			e.preventDefault();
			prevSlide();
		}
	}

	function handleTouchStart(e: TouchEvent) {
		touchStartX = e.changedTouches[0].screenX;
		touchStartY = e.changedTouches[0].screenY;
		isSwiping = true;
	}

	function handleTouchEnd(e: TouchEvent) {
		if (!isSwiping) return;

		const touchEndX = e.changedTouches[0].screenX;
		const touchEndY = e.changedTouches[0].screenY;

		const diffX = touchStartX - touchEndX;
		const diffY = touchStartY - touchEndY;

		// Calculate angle to determine if it's a horizontal swipe
		const angle = Math.abs(Math.atan2(diffY, diffX) * (180 / Math.PI));
		const isHorizontalSwipe = angle < SWIPE_ANGLE_THRESHOLD || angle > 180 - SWIPE_ANGLE_THRESHOLD;

		if (isHorizontalSwipe && Math.abs(diffX) > SWIPE_THRESHOLD) {
			if (diffX > 0) {
				// Swiped left -> next slide
				nextSlide();
			} else {
				// Swiped right -> prev slide
				prevSlide();
			}
		}

		isSwiping = false;
	}

	function handleTouchCancel() {
		isSwiping = false;
	}

	function handleShare() {
		if (archetype) {
			const text = `I'm ${archetype.name} - ${archetype.tagline}. Take the PRISM audit to discover your values.`;
			if (navigator.share) {
				navigator.share({ text, url: window.location.origin });
			} else {
				navigator.clipboard.writeText(text + ' ' + window.location.origin);
			}
		}
	}

	const topAllocation = $derived(() => {
		const entries = Object.entries(allocation);
		if (entries.length === 0) return { category: '', points: 0 };
		const sorted = entries.sort((a, b) => b[1] - a[1]);
		return { category: sorted[0][0], points: sorted[0][1] };
	});

	const decisionStyle = $derived(() => {
		const avg = stats.avgResponseTime / 1000;
		if (avg < 2) return { style: 'Lightning Fast', desc: 'You trust your gut completely' };
		if (avg < 4) return { style: 'Quick & Confident', desc: 'Decisive but thoughtful' };
		if (avg < 6) return { style: 'Measured', desc: 'You weigh your options carefully' };
		return { style: 'Deep Thinker', desc: 'Every choice matters to you' };
	});
</script>

{#if mounted && archetype}
	<main
		class="bg-bg relative h-full min-h-0 overflow-hidden"
		ontouchstart={handleTouchStart}
		ontouchend={handleTouchEnd}
		ontouchcancel={handleTouchCancel}
	>
		<!-- Progress bar -->
		<div class="absolute top-0 right-0 left-0 z-50 flex gap-1 p-3">
			{#each Array.from({ length: totalSlides }, (_, i) => i) as i (i)}
				<div class="bg-text/10 h-1 flex-1 overflow-hidden rounded-full">
					<div
						class="bg-accent h-full transition-all duration-300"
						style="width: {i < currentSlide ? '100%' : i === currentSlide ? '100%' : '0%'};"
					></div>
				</div>
			{/each}
		</div>

		<!-- Click zones (not on last slide) -->
		{#if currentSlide < totalSlides - 1}
			<button
				onclick={prevSlide}
				class="absolute top-0 bottom-0 left-0 z-40 w-1/3 cursor-w-resize"
				aria-label="Previous"
			></button>
			<button
				onclick={nextSlide}
				class="absolute top-0 right-0 bottom-0 z-40 w-2/3 cursor-e-resize"
				aria-label="Next"
			></button>
		{/if}

		<!-- Slides -->
		<div class="relative h-full w-full">
			{#key currentSlide}
				<div
					class="animate-in fade-in slide-in-from-right-4 absolute inset-0 flex items-stretch justify-center px-6 pt-12 pb-16 duration-500"
				>
					<div class="flex h-full w-full max-w-2xl items-center justify-center">
						{#if currentSlide === 0}
							<IntroSlide {answerCount} />
						{:else if currentSlide === 1}
							<ArchetypeSlide {archetype} />
						{:else if currentSlide === 2}
							<ValuesSlide {topValues} />
						{:else if currentSlide === 3}
							<ContradictionsSlide {contradictions} />
						{:else if currentSlide === 4}
							<DecisionStyleSlide {decisionStyle} {stats} />
						{:else if currentSlide === 5}
							<AllocationSlide {allocation} {topAllocation} />
						{:else if currentSlide === 6}
							<StatsSlide {stats} {answerCount} {archetype} {topValues} {onRestart} {handleShare} />
						{/if}
					</div>
				</div>
			{/key}
		</div>

		<!-- Navigation hint -->
		{#if currentSlide < totalSlides - 1}
			<div
				class="animate-in fade-in text-text-muted absolute bottom-2 left-1/2 z-30 -translate-x-1/2 text-xs delay-1000 sm:bottom-3 sm:text-sm md:bottom-6"
			>
				<!-- Mobile: Swipe hint -->
				<span class="md:hidden">Swipe or tap to continue</span>

				<!-- Desktop: Keyboard hint -->
				<span class="hidden items-center gap-2 md:inline-flex">
					<span class="inline-flex items-center gap-1">
						<kbd class="border-text/20 bg-text/5 rounded border px-1.5 py-0.5 font-mono text-xs"
							>←</kbd
						>
						<kbd class="border-text/20 bg-text/5 rounded border px-1.5 py-0.5 font-mono text-xs"
							>→</kbd
						>
					</span>
					<span class="text-text-muted/60">or click to navigate</span>
				</span>
			</div>
		{/if}
	</main>
{/if}
