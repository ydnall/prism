<script>
    import Button from '$lib/components/Button.svelte';
	import { MoveRight } from "@lucide/svelte";

</script>
<section class="relative h-svh flex flex-col px-6 py-12 md:py-16">
	<!-- Get Your PRISM centered -->
	<div class="flex-1 flex items-center justify-center relative z-10">
		<h1
            class="text-7xl md:text-[12vw] lg:text-[10vw] font-bold tracking-tighter leading-none text-center"
		>
			Get your <span class="text-accent italic">P</span>RISM
		</h1>
	</div>

	<!-- What do you actually value -->
	<div class="relative z-10">
		<div class="max-w-2xl mx-auto text-center">
			<h2 class="text-3xl md:text-5xl lg:text-6xl font-bold leading-[0.95] tracking-tight mb-4">
				What do you<br />
				<span class="text-accent">actually</span> value?
			</h2>
			<p class="text-lg md:text-xl text-text-muted leading-relaxed mb-6">
				Your choice matters. Not what you say.
			</p>
			<Button
			>
				Start the audit 
                <MoveRight class="ml-2 inline-block group-hover:translate-x-1.5 transition-transform" />
			</Button>
		</div>
	</div>
</section>
