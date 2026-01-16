<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>{page.data.metadata.title}</title>
	<meta name="description" content={page.data.metadata.description} />
	<meta name="keywords" content={page.data.metadata.keywords} />
	<meta name="author" content={page.data.metadata.author} />
	<meta name="theme-color" content={page.data.metadata['theme-color']} />
	<meta name="language" content={page.data.metadata.language} />
</svelte:head>

{@render children()}
