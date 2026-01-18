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

<div class="flex h-full min-h-0 flex-col">
	<div class="min-h-0 flex-1 px-3 py-3 sm:py-6">
		<Audit onComplete={handleComplete} />
	</div>
</div>
