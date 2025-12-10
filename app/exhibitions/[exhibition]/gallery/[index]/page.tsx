import { apiQuery } from 'next-dato-utils/api';
import { AllExhibitionsDocument, ExhibitionDocument } from '@/graphql';
import { notFound } from 'next/navigation';
import Gallery from '@/components/Gallery';
import { Metadata } from 'next';

export default async function ExhibitionGalleryPage({
	params,
}: PageProps<'/exhibitions/[exhibition]/gallery/[index]'>) {
	const { exhibition: slug, index } = await params;
	const { exhibition } = await apiQuery(ExhibitionDocument, { variables: { slug } });
	if (!exhibition) return notFound();
	return (
		<Gallery images={exhibition.artwork as FileField[]} index={parseInt(index)} backHref={`/exhibitions/${slug}`} />
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
