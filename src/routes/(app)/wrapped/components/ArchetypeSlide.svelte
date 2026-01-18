<script lang="ts">
	import type { Archetype } from '$lib/data/archetypes';

	interface Props {
		archetype: Archetype;
	}

	let { archetype }: Props = $props();
</script>

<div class="max-w-xl text-center">
	<p class="text-text-muted mb-4 text-lg">You are</p>
	<h1 class="text-accent mb-6 text-6xl leading-[0.9] font-bold md:text-8xl lg:text-9xl">
		{archetype.name}
	</h1>
	<p class="text-accent mb-8 text-2xl italic md:text-3xl">
		"{archetype.tagline}"
	</p>
	<p class="text-text-muted text-lg leading-relaxed md:text-xl">
		{archetype.description}
	</p>
</div>
