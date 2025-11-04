import s from './page.module.scss';
import { apiQuery } from 'next-dato-utils/api';
import { imageColor } from '@/lib/utils';
import { Markdown } from 'next-dato-utils/components';
import { format } from 'date-fns';
//import { useState } from 'react';
import Gallery from '@/components/Gallery';
import { Layout, Meta, Content } from '@/components/Layout';
import { HeaderBar } from '@/components/HeaderBar';
import GalleryThumbs from '@/components/GalleryThumbs';
import PressLinks from '@/components/PressLinks';
import { AllExhibitionsDocument, ExhibitionDocument } from '@/graphql';

export default async function Exhibition({ params }: PageProps<'/exhibitions/[exhibition]'>) {
	const { exhibition: slug } = await params;
	const { exhibition } = await apiQuery(ExhibitionDocument, { variables: { slug } });
	const { title, description, startDate, endDate, artwork, artworkThumbnails, artists, press, pressRelease } =
		exhibition || {};

	//const [showGallery, setShowGallery] = useState(false);
	const showGallery = false;
	return (
		<>
			<Layout>
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
					<HeaderBar mobileHide='true'>
						<h1>
							<i>{title}</i>
						</h1>
					</HeaderBar>
					<Markdown>{description}</Markdown>
					{artwork.length > 0 && (
						<section className={s.artworks}>
							<h2>ARTWORK</h2>
							<GalleryThumbs artwork={artwork} artworkThumbnails={artworkThumbnails} />
						</section>
					)}

					{press.length > 0 && (
						<section className={s.press}>
							<h2>PRESS</h2>
							<PressLinks press={press} />
						</section>
					)}
				</Content>
			</Layout>
			<Gallery
				show={showGallery}
				images={artwork}
				//onClose={() => setShowGallery(false)}
				//
			/>
		</>
	);
}

export async function generateStaticParams() {
	const { allExhibitions } = await apiQuery(AllExhibitionsDocument);
	return allExhibitions.map(({ slug: exhibition }) => ({ exhibition }));
}
