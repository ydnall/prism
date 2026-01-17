import { siteConfig } from '$lib/config/site';
import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		metadata: {
			title: siteConfig.title,
			description: siteConfig.description,
			keywords: siteConfig.metadata.keywords.join(', '),
			author: siteConfig.author,
			'theme-color': siteConfig.metadata.themeColor,
			language: siteConfig.metadata.language,
			url: siteConfig.url
		}
	};
}) satisfies LayoutLoad;
