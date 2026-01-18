<script lang="ts">
	interface Props {
		decisionStyle: () => { style: string; desc: string };
		stats: {
			avgResponseTime: number;
			fastestResponse: number;
		};
	}

	let { decisionStyle, stats }: Props = $props();

	const formatTime = (ms: number) => (ms / 1000).toFixed(1);
</script>

<div class="w-full max-w-xl text-center">
	<p class="text-text-muted mb-4 text-lg">Your decision style</p>
	<h1 class="text-accent mb-4 text-5xl font-bold md:text-7xl">
		{decisionStyle().style}
	</h1>
	<p class="text-text-muted mb-8 text-xl">{decisionStyle().desc}</p>
	<div class="flex justify-center gap-8 text-center">
		<div>
			<div class="text-4xl font-bold">{formatTime(stats.avgResponseTime)}s</div>
			<p class="text-text-muted text-sm">avg response</p>
		</div>
		<div>
			<div class="text-4xl font-bold">{formatTime(stats.fastestResponse)}s</div>
			<p class="text-text-muted text-sm">fastest</p>
		</div>
	</div>
</div>
