<script lang="ts">
	import { onMount } from 'svelte';
	import { auditStore } from '$lib/stores/audit';
	import InstinctPhase from './InstinctPhase.svelte';
	import AllocationPhase from './AllocationPhase.svelte';
	import QuestionPhase from './QuestionPhase.svelte';
	import {
		allocationCategories,
		questionTracks,
		type AllocationCategory
	} from '$lib/data/questions';

	interface Props {
		onComplete?: () => void;
	}

	let { onComplete }: Props = $props();

	let phase = $state<'allocation' | 'instinct' | 'tradeoff' | 'deep' | 'complete'>('allocation');
	let currentIndex = $state(0);
	let currentQuestionId = $state('');
	let selectedTrack = $state<AllocationCategory | null>(null);
	let timeLeft = $state(5);
	let questionStartTime = $state(0);
	let allocation = $state<Record<AllocationCategory, number>>({
		Career: 0,
		Relationships: 0,
		Health: 0,
		Adventure: 0
	});
	let timerInterval: ReturnType<typeof setInterval> | null = null;
	let isTransitioning = $state(false);
	let completionTriggered = $state(false);

	const TOTAL_TOKENS = 12; // 12 focus points to distribute

	const currentGraph = $derived(
		selectedTrack && phase === 'instinct'
			? questionTracks[selectedTrack].instinct
			: selectedTrack && phase === 'tradeoff'
				? questionTracks[selectedTrack].tradeoff
				: selectedTrack && phase === 'deep'
					? questionTracks[selectedTrack].deep
					: null
	);

	const currentQuestion = $derived(currentGraph ? currentGraph.questions[currentQuestionId] : null);

	function triggerCompletion() {
		if (completionTriggered) return;
		completionTriggered = true;
		auditStore.complete();
		onComplete?.();
	}

	$effect(() => {
		if (phase === 'complete') {
			triggerCompletion();
		}
	});

	onMount(() => {
		auditStore.start();
		return () => {
			if (timerInterval) clearInterval(timerInterval);
		};
	});

	function startTimer() {
		if (phase !== 'instinct' || !currentQuestion) return;
		timeLeft = currentQuestion.timeLimit ?? 5;
		timerInterval = setInterval(() => {
			timeLeft--;
			if (timeLeft <= 0) {
				if (timerInterval) clearInterval(timerInterval);
				const option = currentQuestion.options[0];
				handleAnswer(0, option.text, option.values);
			}
		}, 1000);
	}

	function handleAnswer(optionIndex: number, optionText: string, values: Record<string, number>) {
		if (isTransitioning || !currentGraph || !currentQuestion) return;
		const option = currentQuestion.options[optionIndex];
		if (!option) return;

		isTransitioning = true;

		if (timerInterval) clearInterval(timerInterval);

		const responseTime = Date.now() - questionStartTime;
		const nextId = option.nextId;

		auditStore.addAnswer(currentQuestion.id, optionIndex, optionText, values, responseTime);

		setTimeout(() => {
			if (phase === 'instinct') {
				if (currentIndex < currentGraph.length - 1 && nextId && currentGraph.questions[nextId]) {
					currentIndex++;
					currentQuestionId = nextId;
					questionStartTime = Date.now();
					isTransitioning = false;
					startTimer();
				} else if (selectedTrack) {
					phase = 'tradeoff';
					currentIndex = 0;
					currentQuestionId = questionTracks[selectedTrack].tradeoff.rootId;
					questionStartTime = Date.now();
					isTransitioning = false;
				}
			} else if (phase === 'tradeoff') {
				if (currentIndex < currentGraph.length - 1 && nextId && currentGraph.questions[nextId]) {
					currentIndex++;
					currentQuestionId = nextId;
					questionStartTime = Date.now();
					isTransitioning = false;
				} else if (selectedTrack) {
					phase = 'deep';
					currentIndex = 0;
					currentQuestionId = questionTracks[selectedTrack].deep.rootId;
					questionStartTime = Date.now();
					isTransitioning = false;
				}
			} else if (phase === 'deep') {
				if (currentIndex < currentGraph.length - 1 && nextId && currentGraph.questions[nextId]) {
					currentIndex++;
					currentQuestionId = nextId;
					questionStartTime = Date.now();
					isTransitioning = false;
				} else {
					phase = 'complete';
					isTransitioning = false;
					triggerCompletion();
				}
			}
		}, 150);
	}

	function getTopAllocationCategory() {
		const entries = Object.entries(allocation) as [AllocationCategory, number][];
		entries.sort((a, b) => {
			const diff = b[1] - a[1];
			if (diff !== 0) return diff;
			return allocationCategories.indexOf(a[0]) - allocationCategories.indexOf(b[0]);
		});
		return entries[0]?.[0] ?? allocationCategories[0];
	}

	function handleAllocationSubmit() {
		if (isTransitioning || getTokensUsed() !== TOTAL_TOKENS) return;
		isTransitioning = true;

		const focusAllocation: Record<AllocationCategory, number> = {
			Career: allocation['Career'],
			Relationships: allocation['Relationships'],
			Health: allocation['Health'],
			Adventure: allocation['Adventure']
		};
		auditStore.setAllocation(focusAllocation);

		const topCategory = getTopAllocationCategory();

		setTimeout(() => {
			selectedTrack = topCategory;
			phase = 'instinct';
			currentIndex = 0;
			currentQuestionId = questionTracks[topCategory].instinct.rootId;
			questionStartTime = Date.now();
			isTransitioning = false;
			startTimer();
		}, 150);
	}

	function getTokensUsed() {
		return Object.values(allocation).reduce((sum, val) => sum + val, 0);
	}

	const phaseNumber = $derived(
		phase === 'allocation' ? '01' : phase === 'instinct' ? '02' : phase === 'tradeoff' ? '03' : '04'
	);

	const phaseLabel = $derived(
		phase === 'allocation'
			? 'Priorities'
			: phase === 'instinct'
				? 'Instinct'
				: phase === 'tradeoff'
					? 'Trade-offs'
					: 'The Hard Ones'
	);

	const totalQuestions = $derived(currentGraph ? currentGraph.length : 0);
</script>

<section class="h-full">
	<div class="mx-auto h-full w-full max-w-2xl">
		{#if phase === 'allocation'}
			<AllocationPhase
				{phaseNumber}
				{phaseLabel}
				{TOTAL_TOKENS}
				{isTransitioning}
				{getTokensUsed}
				onSubmit={handleAllocationSubmit}
				bind:allocation
			/>
		{:else if phase === 'instinct' && currentQuestion}
			<InstinctPhase
				{currentQuestion}
				{currentIndex}
				{totalQuestions}
				{phaseNumber}
				{phaseLabel}
				{timeLeft}
				{isTransitioning}
				onAnswer={handleAnswer}
			/>
		{:else if (phase === 'tradeoff' || phase === 'deep') && currentQuestion}
			<QuestionPhase
				{currentQuestion}
				{currentIndex}
				{totalQuestions}
				{phaseNumber}
				{phaseLabel}
				{isTransitioning}
				onAnswer={handleAnswer}
			/>
		{/if}
	</div>
</section>
