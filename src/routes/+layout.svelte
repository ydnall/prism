<script lang="ts">
	import '../app.css';
	import { Analytics } from '@vercel/analytics/sveltekit';
	import { SpeedInsights } from '@vercel/speed-insights/sveltekit';

	let { children } = $props();
</script>

<!-- blank root layout -->
{@render children()}
<Analytics />
<SpeedInsights />
