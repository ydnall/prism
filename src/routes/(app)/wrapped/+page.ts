import { siteConfig, formatPageTitle } from '$lib/config/site';
import type { PageLoad } from './$types';

export const load = (() => {
	return {
		metadata: {
			title: formatPageTitle('Wrapped'),
			description: 'The results of your choices, your values summarised',
			url: `${siteConfig.url}/wrapped`
		}
	};
}) satisfies PageLoad;
