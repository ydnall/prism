<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import { MoveRight } from '@lucide/svelte';

	interface Props {
		onStart?: () => void;
	}

	let { onStart }: Props = $props();
</script>

<section class="flex h-full flex-col items-center justify-center">
	<!-- Get Your PRISM -->
	<div class="relative z-10 pb-12 md:pb-16">
		<h1
			class="text-center text-7xl leading-none font-bold tracking-tighter md:text-[12vw] lg:text-[10vw]"
		>
			Get your <span class="text-accent italic">P</span>RISM
		</h1>
	</div>

	<!-- What do you actually value -->
	<div class="relative z-10 pt-12 md:pb-16">
		<div class="mx-auto max-w-2xl text-center">
			<h2 class="mb-4 text-4xl leading-[0.95] font-bold tracking-tight md:text-6xl lg:text-7xl">
				What do you<br />
				<span class="text-accent">actually</span> value?
			</h2>
			<p class="text-text-muted mb-6 text-lg leading-relaxed md:text-xl">
				Your choice matters. Not what you say.
			</p>
			<Button onclick={onStart}>
				Start the audit
				<MoveRight class="ml-2 inline-block transition-transform group-hover:translate-x-1.5" />
			</Button>
		</div>
	</div>
</section>
