import { siteConfig, formatPageTitle } from '$lib/config/site';
import type { PageLoad } from './$types';

export const load = (() => {
	return {
		metadata: {
			title: formatPageTitle('Onboarding'),
			description: 'Begin your journey of self-discovery',
			url: `${siteConfig.url}/onboarding`
		}
	};
}) satisfies PageLoad;
