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

<div class="flex h-full min-h-0 flex-col">
	<div class="min-h-0 flex-1">
		<Onboarding onBegin={handleBegin} />
	</div>
</div>
