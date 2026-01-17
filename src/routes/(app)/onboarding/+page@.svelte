<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Onboarding from './components/Onboarding.svelte';

	async function handleBegin() {
		try {
			const resolved = resolve('/audit');
			await goto(resolved);
		} catch (error) {
			console.error('Navigation failed:', error);
		}
	}
</script>

<div class="flex h-svh flex-col">
	<main class="flex-1 px-6 py-12 md:py-16">
		<Onboarding onBegin={handleBegin} />
	</main>
</div>
