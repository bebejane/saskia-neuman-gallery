import { apiQuery } from 'next-dato-utils/api';
import { DatoCmsConfig, getUploadReferenceRoutes, getItemReferenceRoutes } from 'next-dato-utils/config';
import { MetadataRoute } from 'next';
import { GlobalDocument } from '@/graphql';

export default {
	routes: {
		start: async (record) => [`/`],
		about: async ({ slug }) => [`/${slug}`],
		artist: async ({ slug }) => [`/artists/${slug}`],
		exhibition: async ({ slug }) => [`/exhibitions/${slug}`],
		happening: async ({ slug }) => [`/happenings/${slug}`],
		upload: async ({ id }) => getUploadReferenceRoutes(id),
	},
	sitemap: async () => {
		return [
			{
				url: `${process.env.NEXT_PUBLIC_SITE_URL}/`,
				lastModified: new Date(),
				changeFrequency: 'daily',
				priority: 1,
			},
		] as MetadataRoute.Sitemap;
	},
	manifest: async () => {
		const { site } = await apiQuery(GlobalDocument);

		return {
			name: site?.globalSeo?.siteName as string,
			short_name: site?.globalSeo?.siteName as string,
			description: site?.globalSeo?.fallbackSeo?.description as string,
			start_url: '/',
			display: 'standalone',
			background_color: '#ffffff',
			theme_color: '#000000',
			icons: [
				{
					src: '/favicon.ico',
					sizes: 'any',
					type: 'image/x-icon',
				},
			],
		} satisfies MetadataRoute.Manifest;
	},
	robots: async () => {
		return {
			rules: {
				userAgent: '*',
				allow: '/',
			},
		};
	},
} satisfies DatoCmsConfig;
