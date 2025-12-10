import '@/styles/index.scss';
import { apiQuery } from 'next-dato-utils/api';
import { Metadata } from 'next';
import { Icon } from 'next/dist/lib/metadata/types/metadata-types';
import { GlobalDocument } from '@/graphql';
import { buildMenu } from '@/lib/menu';
import Menu from '@/components/Menu';
import Footer from '@/components/Footer';
import MenuMobile from '@/components/MenuMobile';

export const dynamic = 'force-static';

export default async function RootArticle({ children, modals }: LayoutProps<'/'>) {
	const menu = await buildMenu();

	return (
		<>
			<html lang='en-US'>
				<body id='root'>
					<Menu menu={menu} />
					<MenuMobile menu={menu} image={null} />
					{modals}
					{children}
					<Footer />
				</body>
			</html>
		</>
	);
}

export async function generateMetadata(): Promise<Metadata> {
	return buildMetadata({});
}

export type BuildMetadataProps = {
	title?: string | null;
	description?: string | null;
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

	const siteName = globalSeo?.siteName as string;
	const url = pathname ? `${process.env.NEXT_PUBLIC_SITE_URL}${pathname}` : process.env.NEXT_PUBLIC_SITE_URL;
	const title = t ? `${siteName} — ${t}` : siteName;
	//const title = siteName;
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
			locale: 'en_US',
			type: 'website',
		},
	};
}
