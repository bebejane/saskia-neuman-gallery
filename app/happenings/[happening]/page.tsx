import s from './page.module.scss';
import { AllHappeningsDocument, HappeningDocument } from '@/graphql';
import { Markdown } from 'next-dato-utils/components';
import { Article, Meta, Content } from '@/components/Article';
import { HeaderBar } from '@/components/HeaderBar';
import GalleryThumbs from '@/components/GalleryThumbs';
import { format } from 'date-fns';
import { apiQuery } from 'next-dato-utils/api';
import { notFound } from 'next/navigation';

export default async function Happening({ params }: PageProps<'/happenings/[happening]'>) {
	const { happening: slug } = await params;
	const { happening } = await apiQuery(HappeningDocument, { variables: { slug } });

	if (!happening) return notFound();

	const { image, title, description, startDate, endDate, gallery, galleryThumbnails } = happening;

	return (
		<Article image={image as FileField}>
			<Meta>
				<HeaderBar mobileHide={true}>
					<h3>HAPPENING</h3>
				</HeaderBar>
				<p>
					<b>
						<i>{title}</i>
						<br />
						{format(new Date(startDate), 'dd.MM')}—{format(new Date(endDate), 'dd.MM.yyyy')}
					</b>
				</p>
			</Meta>
			<Content>
				<HeaderBar mobileHide={true}>
					<h1>{title}</h1>
				</HeaderBar>
				{description && <Markdown content={description} />}
				{gallery && gallery?.length > 0 && (
					<section className={s.artworks}>
						<h2>IMAGES</h2>
						<GalleryThumbs thumbnails={galleryThumbnails as FileField[]} base={`/happenings/${slug}`} />
					</section>
				)}
			</Content>
		</Article>
	);
}

export async function generateStaticParams() {
	const { allHappenings } = await apiQuery(AllHappeningsDocument);
	return allHappenings.map(({ slug: happening }) => ({ happening }));
}
