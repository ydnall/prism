<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		answerCount: number;
	}

	let { answerCount }: Props = $props();

	let displayedAnswerCount = $state(0);

	onMount(() => {
		displayedAnswerCount = 0;
		const target = answerCount;
		const duration = 1500;
		const steps = 30;
		const increment = target / steps;
		let current = 0;

		const timer = setInterval(() => {
			current += increment;
			if (current >= target) {
				displayedAnswerCount = target;
				clearInterval(timer);
			} else {
				displayedAnswerCount = Math.floor(current);
			}
		}, duration / steps);

		return () => clearInterval(timer);
	});
</script>

<div class="w-full max-w-xl text-center">
	<p class="text-accent mb-6 text-sm font-bold tracking-[0.3em] uppercase">Your PRISM Results</p>
	<h1 class="mb-6 text-5xl font-bold md:text-7xl">
		You made<br /><span class="text-accent tabular-nums">{displayedAnswerCount}</span> choices
	</h1>
	<p class="text-text-muted text-xl">Let's see what they reveal</p>
</div>
