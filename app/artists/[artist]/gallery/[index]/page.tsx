import { apiQuery } from 'next-dato-utils/api';
import { AllArtistsDocument, ArtistDocument } from '@/graphql';
import { notFound } from 'next/navigation';
import Gallery from '@/components/Gallery';
import { Metadata } from 'next';
import { buildMetadata } from '@/app/layout';

export default async function ArtistGalleryPage({ params }: PageProps<'/artists/[artist]/gallery/[index]'>) {
	const { artist: slug, index } = await params;
	const { artist } = await apiQuery(ArtistDocument, { variables: { slug } });
	if (!artist) return notFound();
	return <Gallery images={artist.artwork as FileField[]} index={parseInt(index)} backHref={`/artists/${slug}`} />;
}

export async function generateMetadata({ params }: PageProps<'/artists/[artist]/gallery/[index]'>): Promise<Metadata> {
	const { artist: slug } = await params;
	const { artist } = await apiQuery(ArtistDocument, { variables: { slug } });
	if (!artist) return notFound();

	return buildMetadata({
		title: `${artist.firstName} ${artist.lastName} — Gallery`,
	});
}

/*
export async function generateStaticParams() {
	const { allArtists } = await apiQuery(AllArtistsDocument, { all: true });
	return allArtists
		.map(({ slug: artist, artwork }) => artwork.map((_, index) => ({ artist, index: String(index) })))
		.flat();
}
*/
