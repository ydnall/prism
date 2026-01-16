type SiteConfig = {
	title: string;
	description: string;
    author: string;
	metadata: {
		keywords: string[];
		themeColor: string;
		language: string;
	};
};

export const siteConfig: SiteConfig = {
	title: 'Life Audit - Prism',
	description: 'Discover your values through choices, not just words',
	author: 'ydnall',
	metadata: {
		keywords: [
			'Prism',
            'Life Audit',
		],
		themeColor: '#f5f0e8',
		language: 'en'
	}
} as const;