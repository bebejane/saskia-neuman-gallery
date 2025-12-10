import s from './page.module.scss';
import { apiQuery } from 'next-dato-utils/api';
import { DraftMode } from 'next-dato-utils/components';
import { Markdown } from 'next-dato-utils/components';
import { format } from 'date-fns';
import { Article, Meta, Content } from '@/components/Article';
import { HeaderBar } from '@/components/HeaderBar';
import GalleryThumbs from '@/components/GalleryThumbs';
import PressLinks from '@/components/PressLinks';
import { AllExhibitionsDocument, ExhibitionDocument } from '@/graphql';
import { notFound } from 'next/navigation';
import { buildMetadata } from '@/app/layout';
import { Metadata } from 'next';

export default async function Exhibition({ params }: PageProps<'/exhibitions/[exhibition]'>) {
	const { exhibition: slug } = await params;
	const { exhibition, draftUrl } = await apiQuery(ExhibitionDocument, { variables: { slug } });
	const { allExhibitions } = await apiQuery(AllExhibitionsDocument, { all: true });

	if (!exhibition) return notFound();

	const { title, description, startDate, endDate, artwork, artworkThumbnails, artists, press, pressRelease } =
		exhibition;

	return (
		<>
			<Article image={exhibition.image as FileField} footer={{ current: exhibition, items: allExhibitions }}>
				<Meta>
					<HeaderBar>
						<h3>Exhibition</h3>
					</HeaderBar>
					<p>
						<b>
							{artists.map((a, idx) => `${a.firstName} ${a.lastName}`).join(', ')}
							<br />
							<i>{title}</i>
							<br />
							{format(new Date(startDate), 'dd.MM')}—{format(new Date(endDate), 'dd.MM.yyyy')}
						</b>
					</p>
					{pressRelease && (
						<p>
							<a href={pressRelease.url} download>
								Download pressrelease ↓
							</a>
						</p>
					)}
				</Meta>
				<Content>
					<HeaderBar mobileHide={true}>
						<h1>
							<i>{title}</i>
						</h1>
					</HeaderBar>
					{description && <Markdown content={description} />}
					{artwork.length > 0 && (
						<section className={s.artworks}>
							<h2>ARTWORK</h2>
							<GalleryThumbs thumbnails={artworkThumbnails as FileField[]} base={`/exhibitions/${slug}`} />
						</section>
					)}

					{press.length > 0 && (
						<section className={s.press}>
							<h2>PRESS</h2>
							<PressLinks press={press as PressRecord[]} />
						</section>
					)}
				</Content>
			</Article>
			<DraftMode url={draftUrl} path={`/exhibitions/${slug}`} />
		</>
	);
}

export async function generateStaticParams() {
	const { allExhibitions } = await apiQuery(AllExhibitionsDocument);
	return allExhibitions.map(({ slug: exhibition }) => ({ exhibition }));
}

export async function generateMetadata({ params }: PageProps<'/exhibitions/[exhibition]'>): Promise<Metadata> {
	const { exhibition: slug } = await params;
	const { exhibition } = await apiQuery(ExhibitionDocument, { variables: { slug } });

	if (!exhibition) return notFound();

	return buildMetadata({
		title: exhibition.title,
		//description: exhibition.description,
		pathname: `/exhibitions/${exhibition.slug}`,
	});
}
