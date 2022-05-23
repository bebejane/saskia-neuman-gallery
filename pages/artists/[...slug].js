import styles from './Artists.module.scss'
import { apiQuery } from '/lib/dato/api';
import { withGlobalProps } from "/lib/hoc";
import { imageColor, imageBrightness } from '/utils';
import { GetAllArtists, GetArtist } from '/graphql';
import { Image } from 'react-datocms';
import Markdown from '/lib/dato/components/Markdown';
import Link from '/components/Link';
import Gallery from '/components/Gallery'
import { useState } from 'react';
import { Layout, Meta, Content } from '/components/Layout'
import { HeaderBar } from 'components/HeaderBar';
import GalleryThumbs from 'components/GalleryThumbs';
import { format } from 'date-fns'

export default function Artist({ artist: { name, biography, artwork, exhibitions } }) {
	const [galleryIndex, setGalleryIndex] = useState()

	return (
		<>
			<Layout>
				<Meta>
					<HeaderBar>
						<h3>ARTIST</h3>
					</HeaderBar>
					<h1>{name}</h1>
				</Meta>
				<Content>
					<HeaderBar mobileHide='true'><h1>{name}</h1></HeaderBar>
					<Markdown>{biography}</Markdown>
					<section className={styles.cv}>
						{soloShows.map((year) => (
							{ year }
						))}
					</section>

					<h2>EXHIBITIONS</h2>
					<p>
						{exhibitions.map(({ title, description, image, startDate, endDate, slug }, idx) =>
							<Link key={idx} href={`/exhibitions/${slug}`} color={imageColor(image)} image={image} className={styles.exhibition}>
								<figure>
									<Image
										className={styles.image}
										data={image.responsiveImage}
									/>
								</figure>
								<p>
									<b>
										<i>{title}</i><br />
										{format(new Date(startDate), 'dd.MM')}—{format(new Date(endDate), 'dd.MM.yyyy')}
									</b>
								</p>
							</Link>
						)}
					</p>
					<h2>ARTWORK</h2>
					<GalleryThumbs artwork={artwork} />
				</Content>
			</Layout>
			{
				galleryIndex !== undefined &&
				<Gallery images={artwork} index={galleryIndex} onClose={() => setGalleryIndex(undefined)} />
			}
		</>
	)
}

export async function getStaticPaths(context) {

	const { artists } = await apiQuery(GetAllArtists)

	const paths = artists.map(({ slug }) => ({ params: { slug: [slug] } }))

	return {
		paths,
		fallback: 'blocking'
	}
}

export const getStaticProps = withGlobalProps({ model: 'artist' }, async ({ props, context, revalidate }) => {
	const { artist } = await apiQuery(GetArtist, { slug: context.params.slug[0] })

	if (!artist) return { notFound: true }

	return {
		props: {
			...props,
			artist: {
				...artist,
				exhibitions: props.exhibitions?.filter(({ artists }) => artists.filter(a => a.id === artist.id).length > 0)
			},
			image: artist.image || null,
			color: imageColor(artist.image),
			brightness: await imageBrightness(artist.image),
		},
		revalidate
	};
});