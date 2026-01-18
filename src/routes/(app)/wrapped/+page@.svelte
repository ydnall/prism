<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { auditStore } from '$lib/stores/audit';
	import Wrapped from './components/Wrapped.svelte';

	async function handleRestart() {
		try {
			auditStore.reset();
			const resolved = resolve('/');
			await goto(resolved);
		} catch (error) {
			console.error('Navigation failed:', error);
		}
	}
</script>

<Wrapped onRestart={handleRestart} />
