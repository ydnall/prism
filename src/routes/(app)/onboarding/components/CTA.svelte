<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import { MoveRight } from '@lucide/svelte';
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	interface Props {
		onBegin?: () => void;
		showCTA?: boolean;
	}

	let { onBegin, showCTA = false }: Props = $props();
</script>

<!-- Wrapper always exists and reserves space -->
<div class="grid h-[180px] w-full place-items-center">
	{#if showCTA}
		<div
			class="col-start-1 row-start-1 mx-auto flex max-w-2xl flex-col items-center text-center"
			in:fly={{ y: 200, duration: 2000, easing: cubicOut }}
		>
			<h2 class="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">Ready to begin?</h2>
			<p class="text-text-muted mb-6 text-base leading-relaxed md:text-lg">No account required.</p>
			<Button variant="secondary" onclick={onBegin}>
				Begin the audit
				<MoveRight class="ml-2 inline-block transition-transform group-hover:translate-x-1.5" />
			</Button>
		</div>
	{/if}
</div>
