import { apiQuery } from 'next-dato-utils/api';
import { ArtistDocument } from '@/graphql';
import { notFound } from 'next/navigation';
import Gallery from '@/components/Gallery';

export default async function ArtistGalleryPage({ params }: PageProps<'/artists/[artist]/gallery/[index]'>) {
	const { artist: slug, index } = await params;
	const { artist } = await apiQuery(ArtistDocument, { variables: { slug } });
	if (!artist) return notFound();
	return <Gallery images={artist.artwork as FileField[]} index={parseInt(index)} backHref={`/artists/${slug}`} />;
}
