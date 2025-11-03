import styles from './Artists.module.scss';
import cn from 'classnames';
import { apiQuery } from '/lib/dato/api';
import { withGlobalProps } from '/lib/hoc';
import { imageColor } from '/lib/utils';
import { GetAllArtists, GetArtist } from '/graphql';
import { Image } from 'react-datocms';
import Markdown from '/lib/dato/components/Markdown';
import Link from '/components/Link';
import Gallery from '/components/Gallery';
import { useState } from 'react';
import { Layout, Meta, Content } from '/components/Layout';
import { HeaderBar } from '/components/HeaderBar';
import GalleryThumbs from '/components/GalleryThumbs';
import { format } from 'date-fns';

export default function Artist({
	artist: {
		firstName,
		lastName,
		biography,
		artwork,
		artworkThumbnails,
		exhibitions,
		soloExhibitions,
		groupExhibitions,
		publications,
		education,
		represented,
		performances,
	},
}) {
	const [galleryIndex, setGalleryIndex] = useState();
	const [showBiography, setShowBiography] = useState(false);
	const haveExtendedBiography =
		(soloExhibitions.length ||
			groupExhibitions.length ||
			publications.length ||
			represented.length ||
			education.length) > 0;

	return (
		<>
			<Layout>
				<Meta>
					<HeaderBar>
						<h3>ARTIST</h3>
					</HeaderBar>
					<h1>
						{firstName} {lastName}
					</h1>
				</Meta>
				<Content>
					<HeaderBar mobileHide='true'>
						<h1>
							{firstName} {lastName}
						</h1>
					</HeaderBar>
					<Markdown>{biography}</Markdown>
					{haveExtendedBiography && (
						<section className={cn(styles.cv, showBiography && styles.show)}>
							<h3 onClick={() => setShowBiography(!showBiography)}>
								Extended Bio <span>›</span>
							</h3>
							{soloExhibitions.length > 0 && (
								<div>
									<h3>Solo Exhibitions</h3>
									<ul>
										{soloExhibitions.map(({ year, text, additionalText, location }, idx) => (
											<li key={`ss-${idx}`}>
												{text}
												<br /> {additionalText && <span>{additionalText},</span>}{' '}
												{location && <span>{location},</span>} {year && <span>{year}</span>}{' '}
											</li>
										))}
									</ul>
								</div>
							)}
							{groupExhibitions.length > 0 && (
								<div>
									<h3>Group Exhibitions</h3>
									<ul>
										{groupExhibitions.map(({ year, text, additionalText, location }, idx) => (
											<li key={`gs-${idx}`}>
												{text}
												<br /> {additionalText && <span>{additionalText},</span>}{' '}
												{location && <span>{location},</span>} {year && <span>{year}</span>}
											</li>
										))}
									</ul>
								</div>
							)}
							{represented.length > 0 && (
								<div>
									<h3>Represented</h3>
									<ul>
										{represented.map(({ year, text, additionalText, location }, idx) => (
											<li key={`re-${idx}`}>
												{text}
												<br /> {additionalText && <span>{additionalText},</span>}{' '}
												{location && <span>{location},</span>} {year && <span>{year}</span>}
											</li>
										))}
									</ul>
								</div>
							)}
							{education.length > 0 && (
								<div>
									<h3>Education</h3>
									<ul>
										{education.map(({ year, text, additionalText, location }, idx) => (
											<li key={`ed-${idx}`}>
												{text}
												<br /> {additionalText && <span>{additionalText},</span>}{' '}
												{location && <span>{location},</span>} {year && <span>{year}</span>}
											</li>
										))}
									</ul>
								</div>
							)}
							{performances.length > 0 && (
								<div>
									<h3>Performances</h3>
									<ul>
										{performances.map(({ year, text, additionalText, location }, idx) => (
											<li key={`pub-${idx}`}>
												{text}
												<br /> {additionalText && <span>{additionalText},</span>}{' '}
												{location && <span>{location},</span>} {year && <span>{year}</span>}
											</li>
										))}
									</ul>
								</div>
							)}
							{publications.length > 0 && (
								<div>
									<h3>Publications</h3>
									<ul>
										{publications.map(({ year, text, additionalText, location }, idx) => (
											<li key={`pub-${idx}`}>
												{text}
												<br /> {additionalText && <span>{additionalText},</span>}{' '}
												{location && <span>{location},</span>} {year && <span>{year}</span>}
											</li>
										))}
									</ul>
								</div>
							)}
						</section>
					)}
					{exhibitions.length > 0 && (
						<>
							<h2>EXHIBITIONS</h2>

							{exhibitions.map(({ title, description, image, startDate, endDate, slug }, idx) => (
								<Link
									key={`exhibition-${idx}`}
									href={`/exhibitions/${slug}`}
									color={imageColor(image)}
									image={image}
									className={styles.exhibition}
								>
									<figure>
										<Image className={styles.image} data={image.responsiveImage} />
									</figure>
									<p>
										<b>
											<i>{title}</i>
											<br />
											{format(new Date(startDate), 'dd.MM')}—
											{format(new Date(endDate), 'dd.MM.yyyy')}
										</b>
									</p>
								</Link>
							))}
						</>
					)}
					{artwork.length > 0 && (
						<>
							<h2>ARTWORK</h2>
							<GalleryThumbs artworkThumbnails={artworkThumbnails} artwork={artwork} />
						</>
					)}
				</Content>
			</Layout>
			<Gallery
				show={galleryIndex !== undefined}
				images={artwork}
				index={galleryIndex}
				onClose={() => setGalleryIndex(undefined)}
			/>
		</>
	);
}

export async function getStaticPaths(context) {
	const { artists } = await apiQuery(GetAllArtists);
	const paths = artists.map(({ slug }) => ({ params: { slug: [slug] } }));
	return {
		paths,
		fallback: 'blocking',
	};
}

export const getStaticProps = withGlobalProps(
	{ model: 'artist' },
	async ({ props, context, revalidate }) => {
		const { artist } = await apiQuery(GetArtist, { slug: context.params.slug[0] }, context.preview);

		if (!artist) return { notFound: true, revalidate };

		return {
			props: {
				...props,
				artist: {
					...artist,
					exhibitions: props.exhibitions?.filter(({ artists }) =>
						artists.some((a) => a.id === artist.id)
					),
				},
				image: artist.image || null,
				color: imageColor(artist.image),
			},
			revalidate,
		};
	}
);
