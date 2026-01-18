<script lang="ts">
	import type { Contradiction } from '$lib/data/archetypes';

	interface Props {
		contradictions: Contradiction[];
	}

	let { contradictions }: Props = $props();
</script>

<div class="w-full max-w-md text-center">
	<h2 class="text-text-muted mb-8 text-xl font-bold sm:text-2xl">Your Contradictions</h2>
	{#if contradictions.length === 0}
		<div class="bg-surface text-text-muted rounded-2xl px-6 py-8">
			<div class="text-accent mb-2 text-3xl font-bold">No major clashes</div>
			<p class="text-sm">Your choices stayed aligned across tough trade-offs.</p>
		</div>
	{:else}
		<div class="space-y-5 text-left">
			{#each contradictions as contradiction}
				<div class="bg-surface rounded-2xl p-5">
					<h3 class="text-accent text-xl font-bold">{contradiction.title}</h3>
					<p class="text-text-muted mt-2 text-sm">{contradiction.description}</p>
				</div>
			{/each}
		</div>
	{/if}
</div>
