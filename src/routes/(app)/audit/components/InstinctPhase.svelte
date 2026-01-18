<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import type { Question } from '$lib/data/questions';

	interface Props {
		currentQuestion: Question;
		currentIndex: number;
		totalQuestions: number;
		phaseNumber: string;
		phaseLabel: string;
		timeLeft: number;
		isTransitioning: boolean;
		onAnswer: (optionIndex: number, optionText: string, values: Record<string, number>) => void;
	}

	let {
		currentQuestion,
		currentIndex,
		totalQuestions,
		phaseNumber,
		phaseLabel,
		timeLeft,
		isTransitioning,
		onAnswer
	}: Props = $props();
</script>

{#key currentIndex}
	<div class="flex h-full flex-col justify-between text-center">
		<!-- Content area (top half) -->
		<div class="relative flex flex-1 flex-col justify-center">
			<!-- Phase header -->
			<div class="mb-4 flex items-center justify-center gap-3 md:mb-12">
				<span class="text-accent text-lg font-bold">{phaseNumber}</span>
				<span class="text-text-muted font-medium">{phaseLabel}</span>
				<span class="text-text-muted/50">·</span>
				<span class="text-text-muted">{currentIndex + 1}/{totalQuestions}</span>
			</div>

			<!-- Timer -->
			<div class="mb-6 flex flex-col items-center md:mb-12">
				<div class="text-text-muted mb-2 text-sm font-medium tracking-wider uppercase">Time</div>
				<div
					class="relative text-5xl font-bold tabular-nums transition-colors duration-300 sm:text-8xl {timeLeft <=
					2
						? 'text-accent'
						: 'text-text/20'}"
				>
					{timeLeft}
					<div
						class="absolute -bottom-2 left-1/2 h-1 w-16 -translate-x-1/2 transform rounded-full bg-current opacity-30"
					></div>
				</div>
			</div>

			<!-- Question -->
			<div class="mx-auto max-w-4xl">
				<h2 class="text-2xl leading-tight font-bold md:text-4xl lg:text-5xl">
					{currentQuestion.text}
				</h2>
			</div>
		</div>

		<!-- Answer options -->
		<div class="mx-auto flex w-full max-w-2xl flex-col gap-4">
			{#each currentQuestion.options as option, i}
				<Button
					variant="outline"
					onclick={() => onAnswer(i, option.text, option.values)}
					disabled={isTransitioning}
				>
					{option.text}
				</Button>
			{/each}
		</div>
	</div>
{/key}
