import styles from './Exhibitions.module.scss'
import { apiQuery } from '/lib/dato/api';
import { withGlobalProps } from "/lib/hoc";
import { imageColor } from '/utils';
import { GetAllExhibitions, GetExhibition } from '/graphql';
import Markdown from '/lib/dato/components/Markdown';
import { format } from "date-fns"
import { useState } from 'react';
import Gallery from '/components/Gallery'
import { Layout, Meta, Content } from '/components/Layout'
import { HeaderBar } from 'components/HeaderBar';
import GalleryThumbs from 'components/GalleryThumbs';
import PressLinks from 'components/PressLinks';

export default function Exhibition({ exhibition: { title, description, startDate, endDate, slug, artwork, artists, press, pressRelease } }) {

	const [showGallery, setShowGallery] = useState(false)

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
							<i>{title}</i><br />
							{format(new Date(startDate), 'dd.MM')}—{format(new Date(endDate), 'dd.MM.yyyy')}
						</b>	
					</p>
					{pressRelease && 
						<p>
							<a href={pressRelease.url} download>Download pressrelease ↓</a>
						</p>
					}
				</Meta>

				<Content>
					<HeaderBar mobileHide='true'>
						<h1><i>{title}</i></h1>
					</HeaderBar>
					<Markdown>{description}</Markdown>
					{artwork.length > 0 && 
						<section className={styles.artworks}>
							<h2>ARTWORK</h2>
							<GalleryThumbs artwork={artwork} />
						</section>
					}

					{press.length > 0 &&
						<section className={styles.press}>
							<h2>PRESS</h2>
							<PressLinks press={press} />
						</section>
					}

				</Content>
			</Layout>
			{showGallery && <Gallery images={artwork} onClose={() => setShowGallery(false)} />}
		</>
	)
}

export async function getStaticPaths(context) {
	const { exhibitions } = await apiQuery(GetAllExhibitions)
	
	const paths = exhibitions.map(({ slug }) => ({ params: { slug: [slug] } }))
	return {
		paths,
		fallback: 'blocking'
	}
}

export const getStaticProps = withGlobalProps({ model: 'exhibition' }, async ({ props, context, revalidate }) => {
	const { exhibition } = await apiQuery(GetExhibition, { slug: context.params.slug[0] })

	if (!exhibition) return { notFound: true }

	return {
		props: {
			...props,
			image: exhibition.image || null,
			color: imageColor(exhibition.image),
			exhibition
		},
		revalidate
	};
});