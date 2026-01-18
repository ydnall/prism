<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import type { AllocationCategory } from '$lib/data/questions';
	import { MoveRight } from '@lucide/svelte';

	interface Props {
		phaseNumber: string;
		phaseLabel: string;
		TOTAL_TOKENS: number;
		isTransitioning: boolean;
		getTokensUsed: () => number;
		onSubmit: () => void;
		allocation: Record<AllocationCategory, number>;
	}

	let {
		phaseNumber,
		phaseLabel,
		TOTAL_TOKENS,
		isTransitioning,
		getTokensUsed,
		onSubmit,
		allocation = $bindable()
	}: Props = $props();

	const allocationCategories: AllocationCategory[] = [
		'Career',
		'Relationships',
		'Health',
		'Adventure'
	];

	const categoryDescriptions: Record<AllocationCategory, string> = {
		Career: 'Work, ambition, achievement',
		Relationships: 'Family, friends, love',
		Health: 'Fitness, wellness, longevity',
		Adventure: 'Travel, experiences, risk'
	};

	function getTokensRemaining() {
		return TOTAL_TOKENS - getTokensUsed();
	}
</script>

<div class="grid h-full grid-rows-[auto_1fr_auto] text-center">
	<!-- Phase header -->
	<div class="flex items-center justify-center gap-3 pt-2 pb-4 md:pt-4">
		<span class="text-accent text-lg font-bold">{phaseNumber}</span>
		<span class="text-text-muted font-medium">{phaseLabel}</span>
	</div>

	<!-- Content area -->
	<div class="flex min-h-0 flex-col items-center justify-center">
		<!-- Title and description -->
		<div class="mb-0 max-w-2xl pb-3 md:mb-6">
			<h2 class="mb-2 text-center text-2xl leading-tight font-bold sm:text-4xl">
				{#if getTokensUsed() === 0}
					You have {TOTAL_TOKENS} focus points
				{:else}
					You have {getTokensRemaining()} focus points left
				{/if}
			</h2>
			<p class="text-text-muted text-center text-sm sm:text-lg">
				Distribute your energy across life areas
			</p>
		</div>

		<!-- Allocation controls -->
		<div class="mx-auto w-full max-w-md space-y-2 px-4 sm:space-y-3 md:space-y-6">
			{#each allocationCategories as category (category)}
				<div class="mx-auto w-full space-y-2 sm:space-y-3">
					<!-- Category header -->
					<div class="flex items-center justify-between">
						<div class="text-left">
							<div class="text-lg font-semibold sm:text-lg">{category}</div>
							<div class="text-text-muted hidden text-xs sm:block sm:text-sm">
								{categoryDescriptions[category]}
							</div>
						</div>
						<div class="text-accent text-2xl font-bold tabular-nums">
							{allocation[category]}
						</div>
					</div>

					<!-- Token dots -->
					<div class="flex w-full justify-between gap-1 md:gap-2">
						{#each Array.from({ length: TOTAL_TOKENS }, (_, i) => i) as i (i)}
							<button
								onclick={() => {
									if (i < allocation[category]) {
										// Remove token - set allocation to this position
										allocation[category] = i;
									} else {
										// Add token - but only if we have tokens remaining
										const tokensUsed = getTokensUsed();
										const tokensAvailable = TOTAL_TOKENS - tokensUsed;
										const tokensToAdd = i + 1 - allocation[category];

										if (tokensToAdd <= tokensAvailable) {
											allocation[category] = i + 1;
										}
									}
								}}
								class="md:size6 size-4 rounded-full border-2 transition-all duration-200 hover:scale-110 sm:size-5 {i <
								allocation[category]
									? 'bg-accent border-accent hover:bg-accent-hover'
									: (() => {
											const tokensUsed = getTokensUsed();
											const tokensAvailable = TOTAL_TOKENS - tokensUsed;
											const tokensNeeded = i + 1 - allocation[category];
											return tokensNeeded <= tokensAvailable
												? 'border-accent/40 hover:border-accent hover:bg-accent/10 bg-transparent'
												: 'border-text/20 cursor-not-allowed bg-transparent opacity-50';
										})()}"
								disabled={(() => {
									const tokensUsed = getTokensUsed();
									const tokensAvailable = TOTAL_TOKENS - tokensUsed;
									const tokensNeeded = i + 1 - allocation[category];
									return i >= allocation[category] && tokensNeeded > tokensAvailable;
								})()}
								aria-label="{i < allocation[category] ? 'Remove' : 'Add'} point {i +
									1} for {category}"
							>
							</button>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Submit button -->
	<div class="mx-auto w-full max-w-md">
		<Button
			onclick={onSubmit}
			disabled={getTokensRemaining() !== 0 || isTransitioning}
			class="w-full"
		>
			{getTokensRemaining() === 0 ? 'Continue' : `Assign ${getTokensRemaining()} more points`}
			{#if getTokensRemaining() === 0}
				<MoveRight
					class="ml-2 inline-block align-middle transition-transform group-hover:translate-x-1.5"
				/>
			{/if}
		</Button>
	</div>
</div>
