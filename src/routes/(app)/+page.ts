import { siteConfig, formatPageTitle } from '$lib/config/site';
import type { PageLoad } from './$types';

export const load = (() => {
	return {
		metadata: {
			title: formatPageTitle('Life Audit'),
			description: siteConfig.description,
			url: siteConfig.url
		}
	};
}) satisfies PageLoad;
