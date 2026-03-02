import { apiQuery } from 'next-dato-utils/api';
import { AllFairsDocument, FairDocument } from '@/graphql';
import { notFound } from 'next/navigation';
import Gallery from '@/components/Gallery';
import { Metadata } from 'next';
import { DraftMode } from 'next-dato-utils/components';

export default async function FairGalleryPage({
	params,
}: PageProps<'/fairs/[fair]/gallery/[index]'>) {
	const { fair: slug, index } = await params;
	const { fair, draftUrl } = await apiQuery(FairDocument, { variables: { slug } });
	if (!fair) return notFound();
	return (
		<>
			<Gallery
				images={fair.artwork as FileField[]}
				index={parseInt(index)}
				backHref={`/fairs/${slug}`}
			/>
			<DraftMode url={draftUrl} path={`/fairs/${slug}/gallery/${index}`} />
		</>
	);
}

export async function generateMetadata({
	params,
}: PageProps<'/fairs/[fair]/gallery/[index]'>): Promise<Metadata> {
	const { fair: slug, index } = await params;
	const { fair } = await apiQuery(FairDocument, { variables: { slug } });
	if (!fair) return notFound();
	return {
		title: `${fair.title} — Gallery`,
	};
}

/*
export async function generateStaticParams() {
	const { allFairs } = await apiQuery(AllFairsDocument, { all: true });
	return allFairs
		.map(({ slug: fair, artwork }) => artwork.map((_, index) => ({ fair, index: String(index) })))
		.flat();
}
*/
