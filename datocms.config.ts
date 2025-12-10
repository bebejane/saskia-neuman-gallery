import { apiQuery } from 'next-dato-utils/api';
import {
	DatoCmsConfig,
	getUploadReferenceRoutes,
	getItemReferenceRoutes,
} from 'next-dato-utils/config';
import { MetadataRoute } from 'next';
import {
	ArtistDocument,
	ExhibitionDocument,
	GlobalDocument,
	HappeningDocument,
	FairDocument,
	SitemapDocument,
} from '@/graphql';

export default {
	routes: {
		start: async () => [`/`],
		artist: async ({ slug }) => {
			const { artist } = await apiQuery(ArtistDocument, { variables: { slug } });
			return [
				`/artists/${slug}`,
				`/artists/${slug}/gallery`,
				...(artist?.artwork?.map((_, idx) => `/artists/${slug}/gallery/${idx}`) ?? []),
			];
		},
		exhibition: async ({ slug }) => {
			const { exhibition } = await apiQuery(ExhibitionDocument, { variables: { slug } });
			return [
				`/exhibitions/${slug}`,
				`/exhibitions/${slug}/gallery`,
				'/',
				...(exhibition?.artwork?.map((_, idx) => `/exhibitions/${slug}/gallery/${idx}`) ?? []),
			];
		},
		happening: async ({ slug }) => {
			const { happening } = await apiQuery(HappeningDocument, { variables: { slug } });
			return [
				`/happenings/${slug}`,
				`/happenings/${slug}/gallery`,
				...(happening?.gallery?.map((_, idx) => `/happenings/${slug}/gallery/${idx}`) ?? []),
			];
		},
		fair: async ({ slug }) => {
			const { fair } = await apiQuery(FairDocument, { variables: { slug } });
			return [
				`/fairs/${slug}`,
				`/fairs/${slug}/gallery`,
				...(fair?.artwork?.map((_, idx) => `/fair/${slug}/gallery/${idx}`) ?? []),
			];
		},
		about: async () => [`/about`, '/about/privacy-policy'],
		press: async ({ id }) => [`/about`, ...(await getItemReferenceRoutes(id))],
		external_link: async () => ['/about', '/'],
		upload: async ({ id }) => getUploadReferenceRoutes(id),
	},
	sitemap: async () => {
		const { allArtists, allHappenings, allExhibitions, allFairs } = await apiQuery(SitemapDocument);
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
			...allArtists
				.map(({ id, slug, _updatedAt }) => [
					{
						url: `${process.env.NEXT_PUBLIC_SITE_URL}/artists/${slug}`,
						lastModified: new Date(_updatedAt).toISOString(),
						changeFrequency: 'monthly',
						priority: 0.8,
					},
					{
						url: `${process.env.NEXT_PUBLIC_SITE_URL}/artists/${slug}/gallery`,
						lastModified: new Date(_updatedAt).toISOString(),
						changeFrequency: 'monthly',
						priority: 0.8,
						id,
					},
				])
				.flat(),
			...allHappenings
				.map(({ id, slug, _updatedAt }) => [
					{
						url: `${process.env.NEXT_PUBLIC_SITE_URL}/happenings/${slug}`,
						lastModified: new Date(_updatedAt).toISOString(),
						changeFrequency: 'monthly',
						priority: 0.8,
						id,
					},
					{
						url: `${process.env.NEXT_PUBLIC_SITE_URL}/happenings/${slug}/gallery`,
						lastModified: new Date(_updatedAt).toISOString(),
						changeFrequency: 'monthly',
						priority: 0.8,
					},
				])
				.flat(),
			...allExhibitions.map(({ id, slug, _updatedAt }) => [
				{
					url: `${process.env.NEXT_PUBLIC_SITE_URL}/exhibitions/${slug}`,
					lastModified: new Date(_updatedAt).toISOString(),
					changeFrequency: 'monthly',
					priority: 0.8,
					id,
				},
				{
					url: `${process.env.NEXT_PUBLIC_SITE_URL}/exhibitions/${slug}/gallery`,
					lastModified: new Date(_updatedAt).toISOString(),
					changeFrequency: 'monthly',
					priority: 0.8,
				},
			]),
			...allFairs
				.map(({ id, slug, _updatedAt }) => [
					{
						url: `${process.env.NEXT_PUBLIC_SITE_URL}/fairs/${slug}`,
						lastModified: new Date(_updatedAt).toISOString(),
						changeFrequency: 'monthly',
						priority: 0.8,
						id,
					},
					{
						url: `${process.env.NEXT_PUBLIC_SITE_URL}/fairs/${slug}/gallery`,
						lastModified: new Date(_updatedAt).toISOString(),
						changeFrequency: 'monthly',
						priority: 0.8,
					},
				])
				.flat(),
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
