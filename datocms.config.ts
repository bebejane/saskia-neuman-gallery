import { apiQuery } from 'next-dato-utils/api';
import { DatoCmsConfig, getUploadReferenceRoutes, getItemReferenceRoutes } from 'next-dato-utils/config';
import { MetadataRoute } from 'next';
import { GlobalDocument, SitemapDocument } from '@/graphql';

export default {
	routes: {
		start: async () => [`/`],
		about: async () => [`/about`],
		artist: async ({ slug }) => [`/artists/${slug}`],
		exhibition: async ({ slug }) => [`/exhibitions/${slug}`, '/'],
		happening: async ({ slug }) => [`/happenings/${slug}`],
		press: async ({ id, slug }) => [`/about`, ...(await getItemReferenceRoutes(id))],
		external_link: async ({ id, slug }) => ['/about', '/'],
		upload: async ({ id }) => getUploadReferenceRoutes(id),
	},
	sitemap: async () => {
		const { allArtists, allHappenings, allExhibitions } = await apiQuery(SitemapDocument);
		return [
			{
				url: `${process.env.NEXT_PUBLIC_SITE_URL}/`,
				lastModified: new Date(),
				changeFrequency: 'monthly',
				priority: 1,
			},
			{
				url: `${process.env.NEXT_PUBLIC_SITE_URL}/about`,
				lastModified: new Date(),
				changeFrequency: 'monthly',
				priority: 0.8,
			},
			...allArtists.map(({ id, slug, _updatedAt }) => ({
				url: `${process.env.NEXT_PUBLIC_SITE_URL}/artists/${slug}`,
				lastModified: new Date(_updatedAt).toISOString(),
				changeFrequency: 'monthly',
				priority: 0.8,
				id,
			})),
			...allHappenings.map(({ id, slug, _updatedAt }) => ({
				url: `${process.env.NEXT_PUBLIC_SITE_URL}/happenings/${slug}`,
				lastModified: new Date(_updatedAt).toISOString(),
				changeFrequency: 'monthly',
				priority: 0.8,
				id,
			})),
			...allExhibitions.map(({ id, slug, _updatedAt }) => ({
				url: `${process.env.NEXT_PUBLIC_SITE_URL}/exhibitions/${slug}`,
				lastModified: new Date(_updatedAt).toISOString(),
				changeFrequency: 'monthly',
				priority: 0.8,
				id,
			})),
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
