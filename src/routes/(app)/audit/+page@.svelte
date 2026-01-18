<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Audit from './components/Audit.svelte';

	async function handleComplete() {
		try {
			const resolved = resolve('/wrapped');
			await goto(resolved);
		} catch (error) {
			console.error('Navigation failed:', error);
		}
	}
</script>

<div class="flex h-svh flex-col">
	<main class="flex-1 px-6 py-6 sm:py-12 md:py-16">
		<Audit onComplete={handleComplete} />
	</main>
</div>
