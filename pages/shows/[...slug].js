import styles from './Shows.module.scss'
import { apiQuery } from '/lib/dato/api';
import { withGlobalProps } from "/lib/hoc";
import { imageColor, imageBrightness } from '/utils';
import { GetAllShows, GetShow } from '/graphql';
import Markdown from '/lib/dato/components/Markdown';
import { format } from "date-fns"
import { useState } from 'react';
import Gallery from '/components/Gallery'
import { Layout, Meta, Content } from '/components/Layout'
import { HeaderBar } from 'components/HeaderBar';
import GalleryThumbs from 'components/GalleryThumbs';
import PressLinks from 'components/PressLinks';
import Link from '/components/Link'

export default function Show({ show: { title, description, startDate, endDate, slug, artwork, artists, press } }) {

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
							{artists.map((a, idx) => a.name).join(', ')}
							<br />
							<i>{title}</i><br />
							{format(new Date(startDate), 'dd.MM')}—{format(new Date(endDate), 'dd.MM.yyyy')}
						</b>
					</p>
				</Meta>

				<Content>
					<HeaderBar mobileHide='true'>
						<h1><i>{title}</i></h1>
					</HeaderBar>
					<Markdown>{description}</Markdown>

					<section className={styles.artworks}>
						<h2>ARTWORK</h2>
						<GalleryThumbs artwork={artwork} />
					</section>

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
	const { shows } = await apiQuery(GetAllShows)
	const paths = shows.map(({ slug }) => ({ params: { slug: [slug] } }))
	return {
		paths,
		fallback: 'blocking'
	}
}

export const getStaticProps = withGlobalProps({ model: 'show' }, async ({ props, context, revalidate }) => {
	const { show } = await apiQuery(GetShow, { slug: context.params.slug[0] })

	if (!show) return { notFound: true }

	return {
		props: {
			...props,
			image: show.image || null,
			color: imageColor(show.image),
			brightness: await imageBrightness(show.image),
			show
		},
		revalidate
	};
});