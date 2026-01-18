<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		allocation: Record<string, number>;
		topAllocation: () => { category: string; points: number };
	}

	let { allocation, topAllocation }: Props = $props();

	let displayedPoints = $state(0);

	onMount(() => {
		displayedPoints = 0;
		const target = topAllocation().points;
		const duration = 1200;
		const steps = 20;
		const increment = target / steps;
		let current = 0;

		const timer = setInterval(() => {
			current += increment;
			if (current >= target) {
				displayedPoints = target;
				clearInterval(timer);
			} else {
				displayedPoints = Math.floor(current);
			}
		}, duration / steps);

		return () => clearInterval(timer);
	});
</script>

<div class="w-full max-w-xl text-center">
	<h2 class="text-text-muted mb-2 text-2xl font-bold">Your Focus</h2>
	<p class="mb-8 text-5xl font-bold md:text-6xl">
		<span class="text-accent tabular-nums">{displayedPoints}</span>
		points on<br />{topAllocation().category}
	</p>
	<div class="space-y-3">
		{#each Object.entries(allocation).sort((a, b) => b[1] - a[1]) as [category, points], i (category)}
			{#if points > 0}
				<div class="flex items-center gap-3">
					<span class="w-24 text-left text-sm font-medium">{category}</span>
					<div class="bg-text/10 h-4 flex-1 overflow-hidden rounded-full">
						<div
							class="bg-accent h-full rounded-full transition-all duration-700"
							style="width: {(points / 12) * 100}%; transition-delay: {0.7 + i * 0.1}s;"
						></div>
					</div>
					<span class="w-8 text-sm font-bold">{points}p</span>
				</div>
			{/if}
		{/each}
	</div>
</div>
