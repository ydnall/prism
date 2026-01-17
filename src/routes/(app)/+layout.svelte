<script lang="ts">
	import '../../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';
	import Footer from '$lib/components/Footer.svelte';

	let { children } = $props();

	// Merge layout defaults with page-specific metadata
	const metadata = $derived({
		...page.data.metadata
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>{metadata.title}</title>
	<meta name="description" content={metadata.description} />
	<meta name="keywords" content={metadata.keywords} />
	<meta name="author" content={metadata.author} />
	<meta name="theme-color" content={metadata['theme-color']} />
	<meta name="language" content={metadata.language} />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content={metadata.url} />
	<meta property="og:title" content={metadata.title} />
	<meta property="og:description" content={metadata.description} />
	<meta property="og:site-name" content={metadata.title} />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content={metadata.url} />
	<meta name="twitter:title" content={metadata.title} />
	<meta name="twitter:description" content={metadata.description} />

	<!-- Canonical URL -->
	<link rel="canonical" href={metadata.url} />
</svelte:head>

<div class="flex h-svh flex-col">
	<main class="flex-1 px-6 pt-6 sm:pt-12 md:pt-16">
		{@render children()}
	</main>
	<Footer />
</div>
