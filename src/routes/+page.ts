import { siteConfig } from '$lib/config/site';
import type { PageLoad } from './$types';

export const load = (() => {
	console.log('Loading metadata:', siteConfig); // Debug log
	return {
		metadata: {
			title: siteConfig.title,
			description: siteConfig.description,
			keywords: siteConfig.metadata.keywords.join(', '),
			author: siteConfig.author,
			'theme-color': siteConfig.metadata.themeColor,
			language: siteConfig.metadata.language
		}
	};
}) satisfies PageLoad;