type SiteConfig = {
	title: string;
	description: string;
	author: string;
	url: string;
	metadata: {
		keywords: string[];
		themeColor: string;
		language: string;
	};
};

export const siteConfig: SiteConfig = {
	title: 'Prism',
	description: 'Discover your values through choices, not just words',
	author: 'ydnall',
	url: 'https://localhost:5173',
	metadata: {
		keywords: ['Prism', 'Life Audit'],
		themeColor: '#f5f0e8',
		language: 'en'
	}
} as const;

export function formatPageTitle(pageTitle?: string): string {
	return pageTitle ? `${pageTitle} - ${siteConfig.title}` : siteConfig.title;
}
