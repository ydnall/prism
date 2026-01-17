<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import { MoveRight } from '@lucide/svelte';

	interface Props {
		onBegin?: () => void;
		showCTA?: boolean;
	}

	let { onBegin, showCTA }: Props = $props();
</script>

<div
	class="mx-auto max-w-2xl text-center transition-all duration-500 {showCTA
		? 'translate-y-0 opacity-100'
		: 'translate-y-8 opacity-0'}"
>
	<h2 class="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">Ready to begin?</h2>
	<p class="text-text-muted mb-6 text-base leading-relaxed md:text-lg">No account required.</p>
	<Button variant="secondary" onclick={onBegin}>
		Begin the audit
		<MoveRight class="ml-2 inline-block transition-transform group-hover:translate-x-1.5" />
	</Button>
</div>
