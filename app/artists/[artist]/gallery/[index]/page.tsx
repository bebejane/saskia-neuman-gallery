import { apiQuery } from 'next-dato-utils/api';
import { ArtistDocument, PrivacyPolicyDocument } from '@/graphql';
import { notFound } from 'next/navigation';
import Gallery from '@/components/Gallery';
import GalleryEmbla from '@/components/GalleryEmbla';

export default async function ArtistGalleryPage({ params }: PageProps<'/artists/[artist]/gallery/[index]'>) {
	const { artist: slug, index } = await params;
	const { artist } = await apiQuery(ArtistDocument, { variables: { slug } });
	if (!artist) return notFound();
	return (
		<GalleryEmbla images={artist.artwork as FileField[]} index={parseInt(index) ?? 0} backHref={`/artists/${slug}`} />
	);
}
