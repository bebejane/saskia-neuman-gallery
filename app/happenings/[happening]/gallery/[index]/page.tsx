import { apiQuery } from 'next-dato-utils/api';
import { HappeningDocument } from '@/graphql';
import { notFound } from 'next/navigation';
import Gallery from '@/components/Gallery';

export default async function ExhibitionGalleryPage({ params }: PageProps<'/happenings/[happening]/gallery/[index]'>) {
	const { happening: slug, index } = await params;
	const { happening } = await apiQuery(HappeningDocument, { variables: { slug } });
	if (!happening) return notFound();
	return (
		<Gallery images={happening.gallery as FileField[]} index={parseInt(index) ?? 0} backHref={`/happenings/${slug}`} />
	);
}
