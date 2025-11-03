import '@/styles/index.scss';
import s from './layout.module.scss';
import { apiQuery } from 'next-dato-utils/api';
import { Metadata } from 'next';
import { Icon } from 'next/dist/lib/metadata/types/metadata-types';
import { GlobalDocument } from '@/graphql';

export type LayoutProps = {
	children: React.ReactNode;
};

export default async function RootLayout({ children }: LayoutProps) {
	return (
		<>
			<html lang='en'>
				<body id='root'>
					<main className={s.main}>{children}</main>
				</body>
			</html>
		</>
	);
}

export async function generateMetadata(): Promise<Metadata> {
	return buildMetadata({});
}

export type BuildMetadataProps = {
	title?: string | any;
	description?: string | null | undefined;
	pathname?: string;
	image?: FileField;
};

export async function buildMetadata({
	title: t,
	description: desc,
	image: img,
	pathname,
}: BuildMetadataProps): Promise<Metadata> {
	const {
		site: { globalSeo, faviconMetaTags },
	} = await apiQuery(GlobalDocument);

	const siteName = 'KakaKonstpedagogik';
	const url = pathname ? `${process.env.NEXT_PUBLIC_SITE_URL}${pathname}` : process.env.NEXT_PUBLIC_SITE_URL;
	const title = t ? `${siteName} — ${t}` : siteName;
	const description = !desc ? (globalSeo?.fallbackSeo?.description ?? '') : desc;
	const image = img ?? (globalSeo?.fallbackSeo?.image as FileField);

	return {
		metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL as string),
		icons: faviconMetaTags.map(({ attributes: { rel, sizes, type, href: url } }) => ({
			rel,
			url,
			sizes,
			type,
		})) as Icon[],
		title,
		alternates: {
			canonical: url,
		},
		description,
		openGraph: {
			title: {
				template: `${siteName} — %s`,
				default: siteName ?? '',
			},
			description,
			url,
			images: image
				? [
						{
							url: `${image?.url}?w=1200&h=630&fit=fill&q=80`,
							width: 800,
							height: 600,
							alt: title,
						},
						{
							url: `${image?.url}?w=1600&h=800&fit=fill&q=80`,
							width: 1600,
							height: 800,
							alt: title,
						},
						{
							url: `${image?.url}?w=790&h=627&fit=crop&q=80`,
							width: 790,
							height: 627,
							alt: title,
						},
					]
				: undefined,
			locale: 'sv_SE',
			type: 'website',
		},
	};
}
