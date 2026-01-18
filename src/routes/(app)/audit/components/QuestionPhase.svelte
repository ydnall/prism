<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import type { Question } from '$lib/data/questions';

	interface Props {
		currentQuestion: Question;
		currentIndex: number;
		totalQuestions: number;
		phaseNumber: string;
		phaseLabel: string;
		isTransitioning: boolean;
		onAnswer: (optionIndex: number, optionText: string, values: Record<string, number>) => void;
	}

	let {
		currentQuestion,
		currentIndex,
		totalQuestions,
		phaseNumber,
		phaseLabel,
		isTransitioning,
		onAnswer
	}: Props = $props();
</script>

{#key `${phaseLabel}-${currentIndex}`}
	<div class="flex h-full flex-col justify-between text-center">
		<!-- Content area (top half) -->
		<div class="flex flex-1 flex-col justify-center">
			<!-- Phase header -->
			<div class="mb-4 flex items-center justify-center gap-3 md:mb-12">
				<span class="text-accent text-lg font-bold">{phaseNumber}</span>
				<span class="text-text-muted font-medium">{phaseLabel}</span>
				<span class="text-text-muted/50">·</span>
				<span class="text-text-muted">{currentIndex + 1}/{totalQuestions}</span>
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
