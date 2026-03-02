import { apiQuery } from 'next-dato-utils/api';
import { ExhibitionDocument } from '@/graphql';
import { notFound } from 'next/navigation';
import Gallery from '@/components/Gallery';
import { Metadata } from 'next';
import { DraftMode } from 'next-dato-utils/components';

export default async function ExhibitionGalleryPage({
	params,
}: PageProps<'/exhibitions/[exhibition]/gallery/[index]'>) {
	const { exhibition: slug, index } = await params;
	const { exhibition, draftUrl } = await apiQuery(ExhibitionDocument, { variables: { slug } });
	if (!exhibition) return notFound();
	return (
		<>
			<Gallery
				images={exhibition.artwork as FileField[]}
				index={parseInt(index)}
				backHref={`/exhibitions/${slug}`}
			/>
			<DraftMode url={draftUrl} path={`/exhibitions/${slug}/gallery/${index}`} />
		</>
	);
}

export async function generateMetadata({
	params,
}: PageProps<'/exhibitions/[exhibition]/gallery/[index]'>): Promise<Metadata> {
	const { exhibition: slug, index } = await params;
	const { exhibition } = await apiQuery(ExhibitionDocument, { variables: { slug } });
	if (!exhibition) return notFound();
	return {
		title: `${exhibition.title} — Gallery`,
	};
}

/*
export async function generateStaticParams() {
	const { allExhibitions } = await apiQuery(AllExhibitionsDocument, { all: true });
	return allExhibitions
		.map(({ slug: exhibition, artwork }) => artwork.map((_, index) => ({ exhibition, index: String(index) })))
		.flat();
}
*/
