import styles from './Shows.module.scss'
import { apiQuery } from '/lib/dato/api';
import { withGlobalProps } from "/lib/hoc";
import { imageColor, imageBrightness } from '/lib/utils';
import { GetAllShows, GetShow } from '/graphql';
import Markdown from '/lib/dato/components/Markdown';
import { format } from "date-fns"
import { Image } from 'react-datocms';
import { useState } from 'react';
import Gallery from '/components/Gallery'
import { Layout, Meta, Content } from '/components/Layout'


export default function Show({ show: { title, description, startDate, endDate, slug, artwork, artists, press } }) {

	const [showGallery, setShowGallery] = useState(false)

	return (
		<>
			<Layout>
				<Meta>
					<h3>EXHIBITIONS</h3>
					<p>
						{artists.map(a => a.name).join(', ')}<br />
						{title}<br />
						{format(new Date(startDate), 'dd.MM')} - {format(new Date(endDate), 'dd.MM.yyyy')}
					</p>
				</Meta>

				<Content>
					<h1>{title}</h1>
					<Markdown>{description}</Markdown>
					<section className={styles.artworks}>
						<h2>ARTWORKS</h2>
						<div className={styles.gallery}>
							{artwork.map((image, idx) =>
								<Image key={idx} data={image.responsiveImage} />
							)}
						</div>
						<a onClick={() => setShowGallery(true)}>[Gallery]</a>
					</section>
					<div className={styles.press}>
						<h2>PRESS</h2>
						<div className={styles.press}>
							{press.map(({ date, source, author, url }, idx) =>
								<div key={idx} className={styles.block}>
									{format(new Date(date), 'dd.MM.yyyy')}<br />
									{source} <a href={url}>-></a><br />
									{author}
								</div>
							)}
						</div>
					</div>
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