import { apiQuery } from 'next-dato-utils/api';
import { ExhibitionDocument } from '@/graphql';
import { notFound } from 'next/navigation';
import Gallery from '@/components/Gallery';

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
