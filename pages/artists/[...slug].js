import styles from './Artists.module.scss'
import { apiQuery } from '/lib/dato/api';
import { withGlobalProps } from "/lib/hoc";
import { imageColor, imageBrightness } from '/lib/utils';
import { GetAllArtists, GetArtist } from '/graphql';
import { Image } from 'react-datocms';
import Markdown from '/lib/dato/components/Markdown';
import Link from 'next/link';
import Gallery from '/components/Gallery'
import { useState } from 'react';
import { Layout, Meta, Content } from '/components/Layout'
import { HeaderBar } from 'components/HeaderBar';
import GalleryThumbs from 'components/GalleryThumbs';
import { format } from 'date-fns'

export default function Artist({ artist: { name, biography, artwork, shows } }) {
	const [galleryIndex, setGalleryIndex] = useState()	
	return (
		<>
			<Layout>
				<Meta>
					<HeaderBar>
						<h3>ARTISTS</h3>
					</HeaderBar>
				</Meta>

				<Content>
					<HeaderBar><h1>{name}</h1></HeaderBar>
					<Markdown>{biography}</Markdown>

					<h2>EXHIBITIONS</h2>
					<p>
						{shows.map(({title, description, image, startDate, endDate, slug}) => 
							<>
								<Link href={`/shows/${slug}`}>
									<a>{title}</a> 
								</Link>
								<br/>
								{format(new Date(startDate), 'dd.MM')} - {format(new Date(endDate), 'dd.MM.yyyy')}
							</>
						)}
					</p>
					<h2>ARTWORKS</h2>
					<GalleryThumbs artwork={artwork} />
				</Content>
			</Layout>
			{galleryIndex !== undefined &&
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
	artist.shows = props.shows.filter((show) => show.artists.filter(a => a.id === artist.id).length > 0)

	return {
		props: {
			...props,
			artist,
			image: artist.image || null,
			color: imageColor(artist.image),
			brightness: await imageBrightness(artist.image),
		},
		revalidate
	};
});