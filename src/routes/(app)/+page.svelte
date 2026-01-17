<script lang="ts">
	import Hero from './components/Hero.svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Background from './components/Background.svelte';

	async function handleStart() {
		try {
			const resolved = resolve('/onboarding');
			await goto(resolved);
		} catch (error) {
			console.error('Navigation failed:', error);
		}
	}
</script>

<Background />

<div class="z-10 flex h-full flex-col">
	<Hero onStart={handleStart} />
</div>
