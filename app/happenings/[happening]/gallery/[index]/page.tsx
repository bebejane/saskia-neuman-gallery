import { apiQuery } from 'next-dato-utils/api';
import { AllHappeningsDocument, HappeningDocument } from '@/graphql';
import { notFound } from 'next/navigation';
import Gallery from '@/components/Gallery';
import { Metadata } from 'next';

export default async function ExhibitionGalleryPage({ params }: PageProps<'/happenings/[happening]/gallery/[index]'>) {
	const { happening: slug, index } = await params;
	const { happening } = await apiQuery(HappeningDocument, { variables: { slug } });
	if (!happening) return notFound();
	return (
		<Gallery images={happening.gallery as FileField[]} index={parseInt(index) ?? 0} backHref={`/happenings/${slug}`} />
	);
}

export async function generateStaticParams() {
	const { allHappenings } = await apiQuery(AllHappeningsDocument, { all: true });
	return allHappenings
		.map(({ slug: happening, gallery }) => gallery.map((_, index) => ({ happening, index: String(index) })))
		.flat();
}

export async function generateMetadata({
	params,
}: PageProps<'/happenings/[happening]/gallery/[index]'>): Promise<Metadata> {
	const { happening: slug, index } = await params;
	const { happening } = await apiQuery(HappeningDocument, { variables: { slug } });
	if (!happening) return notFound();
	return {
		title: `${happening.title} — Gallery`,
	};
}
