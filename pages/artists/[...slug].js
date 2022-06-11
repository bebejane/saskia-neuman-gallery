import styles from './Artists.module.scss'
import cn from 'classnames'
import { apiQuery } from '/lib/dato/api';
import { withGlobalProps } from "/lib/hoc";
import { imageColor } from '/utils';
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

export default function Artist({ artist: { name, biography, artwork, exhibitions, soloShows, groupShows, publications, education, represented } }) {
	
	const [galleryIndex, setGalleryIndex] = useState()
	const [showBiography, setShowBiography] = useState(false)
	const haveExtendedBiography = (soloShows.length || groupShows.length || publications.length || represented.length || education.length) > 0

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
					{haveExtendedBiography &&
						<section className={cn(styles.cv, showBiography && styles.show)}>
							<h3 onClick={()=> setShowBiography(!showBiography)}>
								EXTENDED BIO <span>›</span>
							</h3>
							{soloShows.length > 0 && 
								<div>
									<h3>Solo Shows</h3>
									<ul>
										{soloShows.map(({ year, text, additionalText, location }, idx) => (
											<li key={`ss-${idx}`}>{text}, {additionalText && <span>{additionalText},</span>} {location && <span>{location},</span>} {year && <span>{year}</span>}</li>
										))}
									</ul>
								</div>
							}
							{groupShows.length > 0 && 
								<div>
									<h3>Group shows</h3>
									<ul>
										{groupShows.map(({ year, text, additionalText, location }, idx) => (
											<li key={`gs-${idx}`}>{text}, {additionalText && <span>{additionalText},</span>} {location && <span>{location},</span>} {year && <span>{year}</span>}</li>
										))}
									</ul>
								</div>
							}
							{represented.length > 0 && 
								<div>
									<h3>Represented</h3>
									<ul>
										{represented.map(({ year, text, additionalText, location }, idx) => (
											<li key={`re-${idx}`}>{text}, {additionalText && <span>{additionalText},</span>} {location && <span>{location},</span>} {year && <span>{year}</span>}</li>
										))}
									</ul>
								</div>
							}
							{education.length > 0 && 
								<div>
									<h3>Education</h3>
									<ul>
										{education.map(({ year, text, additionalText, location }, idx) => (
											<li key={`ed-${idx}`}>{text}, {additionalText && <span>{additionalText},</span>} {location && <span>{location},</span>} {year && <span>{year}</span>}</li>
										))}
									</ul>
								</div>
							}
							{publications.length > 0 && 
								<div>
									<h3>Publications</h3>
									<ul>
										{publications.map(({ year, text, additionalText, location }, idx) => (
											<li key={`pub-${idx}`}>{text}, {additionalText && <span>{additionalText},</span>} {location && <span>{location},</span>} {year && <span>{year}</span>}</li>
										))}
									</ul>
								</div>
							}
						</section>
					}
					{exhibitions.length > 0 && 
						<>
							<h2>EXHIBITIONS</h2>
							<p>
								{exhibitions.map(({ title, description, image, startDate, endDate, slug }, idx) =>
									<Link key={`exhibition-${idx}`} href={`/exhibitions/${slug}`} color={imageColor(image)} image={image} className={styles.exhibition}>
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
						</>
					}
					{artwork.length > 0 &&
						<>
							<h2>ARTWORK</h2>
							<GalleryThumbs artwork={artwork} />
						</>
					}
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

	if (!artist) 
		return { notFound: true }

	return {
		props: {
			...props,
			artist: {
				...artist,
				exhibitions: props.exhibitions?.filter(({ artists }) => artists.filter(a => a.id === artist.id).length > 0)
			},
			image: artist.image || null,
			color: imageColor(artist.image)
		},
		revalidate
	};
});