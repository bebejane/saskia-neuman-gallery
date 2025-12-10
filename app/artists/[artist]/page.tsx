import s from './page.module.scss';
import { imageColor } from '@/lib/utils';
import { AllArtistsDocument, AllExhibitionsDocument, ArtistDocument } from '@/graphql';
import { Image } from 'react-datocms';
import { Markdown } from 'next-dato-utils/components';
import Link from '@/components/Link';
import { Article, Meta, Content } from '@/components/Article';
import { HeaderBar } from '@/components/HeaderBar';
import GalleryThumbs from '@/components/GalleryThumbs';
import { format } from 'date-fns';
import { apiQuery } from 'next-dato-utils/api';
import { DraftMode } from 'next-dato-utils/components';
import { notFound } from 'next/navigation';
import { buildMetadata } from '@/app/layout';
import { Metadata } from 'next';
import ExtendedBiography from './ExtendedBiography';

export default async function Artist({ params }: PageProps<'/artists/[artist]'>) {
	const { artist: slug } = await params;
	const { artist, draftUrl } = await apiQuery(ArtistDocument, { variables: { slug } });
	const { allArtists } = await apiQuery(AllArtistsDocument, { all: true });
	const { allExhibitions } = await apiQuery(AllExhibitionsDocument, { all: true });

	if (!artist) return notFound();

	const {
		firstName,
		lastName,
		biography,
		artwork,
		artworkThumbnails,
		soloExhibitions,
		groupExhibitions,
		publications,
		education,
		represented,
		performances,
	} = artist;

	const exhibitions = allExhibitions?.filter(({ artists }) => artists.some((a) => a.id === artist.id));

	const showBiography = false;
	const haveExtendedBiography =
		(soloExhibitions.length ||
			groupExhibitions.length ||
			publications.length ||
			represented.length ||
			education.length) > 0;

	return (
		<>
			<Article image={artist.image as FileField} footer={{ current: artist, items: allArtists }}>
				<Meta>
					<HeaderBar>
						<h3>ARTIST</h3>
					</HeaderBar>
					<h1>
						{firstName} {lastName}
					</h1>
				</Meta>
				<Content>
					<HeaderBar mobileHide={true}>
						<h1>
							{firstName} {lastName}
						</h1>
					</HeaderBar>
					{biography && <Markdown content={biography} />}
					{haveExtendedBiography && <ExtendedBiography artist={artist} />}
					{exhibitions.length > 0 && (
						<>
							<h2>EXHIBITIONS</h2>
							{exhibitions.map(({ title, image, startDate, endDate, slug }, idx) => (
								<Link
									key={`exhibition-${idx}`}
									href={`/exhibitions/${slug}`}
									color={imageColor(image as FileField)}
									image={image as FileField}
									className={s.exhibition}
								>
									<figure>
										{image?.responsiveImage && (
											<Image className={s.image} data={image.responsiveImage} intersectionMargin='0px 0px 200% 0px' />
										)}
									</figure>
									<p>
										<b>
											<i>{title}</i>
											<br />
											{format(new Date(startDate), 'dd.MM')}—{format(new Date(endDate), 'dd.MM.yyyy')}
										</b>
									</p>
								</Link>
							))}
						</>
					)}
					{artwork.length > 0 && (
						<>
							<h2>ARTWORK</h2>
							<GalleryThumbs thumbnails={artworkThumbnails as FileField[]} base={`/artists/${artist.slug}`} />
						</>
					)}
				</Content>
			</Article>
			<DraftMode url={draftUrl} path={`/artists/${artist.slug}`} />
		</>
	);
}

export async function generateStaticParams() {
	const { allArtists } = await apiQuery(AllArtistsDocument);
	return allArtists.map(({ slug: artist }) => ({ artist }));
}

export async function generateMetadata({ params }: PageProps<'/artists/[artist]'>): Promise<Metadata> {
	const { artist: slug } = await params;
	const { artist } = await apiQuery(ArtistDocument, { variables: { slug } });

	if (!artist) return notFound();

	return buildMetadata({
		title: `${artist.firstName} ${artist.lastName}`,
		//description: artist.biography,
		pathname: `/artists/${artist.slug}`,
	});
}
