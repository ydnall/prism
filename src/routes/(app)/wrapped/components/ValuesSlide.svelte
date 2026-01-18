<script lang="ts">
	interface Props {
		topValues: { value: string; score: number }[];
	}

	let { topValues }: Props = $props();
</script>

<div class="w-full max-w-xl">
	<h2 class="text-text-muted mb-8 text-center text-2xl font-bold">Your Core Values</h2>
	<div class="space-y-6">
		{#each topValues as { value, score }, i (value)}
			<div class="flex items-center gap-4">
				<span class="text-accent w-16 text-5xl font-bold md:text-6xl">0{i + 1}</span>
				<div class="flex-1">
					<span class="text-3xl font-bold md:text-4xl">{value}</span>
					<div class="bg-text/10 mt-2 h-2 overflow-hidden rounded-full">
						<div
							class="bg-accent h-full rounded-full transition-all delay-500 duration-1000"
							style="width: {Math.min((score / 30) * 100, 100)}%;"
						></div>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>
