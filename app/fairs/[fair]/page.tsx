import s from './page.module.scss';
import { apiQuery } from 'next-dato-utils/api';
import { DraftMode } from 'next-dato-utils/components';
import { Markdown } from 'next-dato-utils/components';
import { format } from 'date-fns';
import { Article, Meta, Content } from '@/components/Article';
import { HeaderBar } from '@/components/HeaderBar';
import GalleryThumbs from '@/components/GalleryThumbs';
import PressLinks from '@/components/PressLinks';
import { AllFairsDocument, FairDocument } from '@/graphql';
import { notFound } from 'next/navigation';
import { buildMetadata } from '@/app/layout';
import { Metadata } from 'next';

export default async function Fair({ params }: PageProps<'/fairs/[fair]'>) {
	const { fair: slug } = await params;
	const { fair, draftUrl } = await apiQuery(FairDocument, { variables: { slug } });
	const { allFairs } = await apiQuery(AllFairsDocument, { all: true });

	if (!fair) return notFound();

	const {
		title,
		description,
		startDate,
		endDate,
		artwork,
		artworkThumbnails,
		artists,
		press,
		pressRelease,
	} = fair;

	return (
		<>
			<Article image={fair.image as FileField} footer={{ current: fair, items: allFairs }}>
				<Meta>
					<HeaderBar>
						<h3>Fair</h3>
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
							<GalleryThumbs
								thumbnails={artworkThumbnails as FileField[]}
								base={`/fairs/${slug}`}
							/>
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
			<DraftMode url={draftUrl} path={`/fairs/${slug}`} />
		</>
	);
}

export async function generateStaticParams() {
	const { allFairs } = await apiQuery(AllFairsDocument);
	return allFairs.map(({ slug: fair }) => ({ fair }));
}

export async function generateMetadata({ params }: PageProps<'/fairs/[fair]'>): Promise<Metadata> {
	const { fair: slug } = await params;
	const { fair } = await apiQuery(FairDocument, { variables: { slug } });

	if (!fair) return notFound();

	return buildMetadata({
		title: fair.title,
		pathname: `/fairs/${fair.slug}`,
	});
}
