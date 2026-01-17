import { siteConfig, formatPageTitle } from '$lib/config/site';
import type { PageLoad } from './$types';

export const load = (() => {
	return {
		metadata: {
			title: formatPageTitle('Audit'),
			description: 'The journey of self-discovery has begun',
			url: `${siteConfig.url}/audit`
		}
	};
}) satisfies PageLoad;
