import styles from './Events.module.scss'
import { apiQuery } from '/lib/dato/api';
import { withGlobalProps } from "/lib/hoc";
import { imageColor, imageBrightness } from '/utils';
import { GetAllEvents, GetEvent } from '/graphql';
import { Image } from 'react-datocms';
import Markdown from '/lib/dato/components/Markdown';
import { Layout, Meta, Content } from '/components/Layout'
import { HeaderBar } from 'components/HeaderBar';
import GalleryThumbs from 'components/GalleryThumbs';
import { format } from "date-fns"

export default function Event({ event }) {
	return (
		<Layout>
			<Meta>
				<HeaderBar mobile='true'>
					<h3>EVENTS</h3>
					<h1>{event.title}</h1>
				</HeaderBar>
				<p>
					<b>
						<i>{event.title}</i><br />
						{format(new Date(event.startDate), 'dd.MM')}—{format(new Date(event.endDate), 'dd.MM.yyyy')}
					</b>
				</p>
			</Meta>
			<Content>
				<HeaderBar>
					<h1>{event.title}</h1>
				</HeaderBar>
				<Markdown>{event.description}</Markdown>
				<section className={styles.artworks}>
					<h2>IMAGES</h2>
					<GalleryThumbs artwork={event.gallery} />
				</section>
			</Content>
		</Layout>
	)
}

export async function getStaticPaths(context) {
	const { events } = await apiQuery(GetAllEvents)
	const paths = events.map(({ slug }) => ({ params: { slug: [slug] } }))
	return {
		paths,
		fallback: 'blocking'
	}
}

export const getStaticProps = withGlobalProps({ model: 'event' }, async ({ props, context, revalidate }) => {
	const { event } = await apiQuery(GetEvent, { slug: context.params.slug[0] })

	if(!event) return { notFound:true}

	return {
		props: {
			...props,
			event,
			image: event.image || null,
			color: imageColor(event.image),
			brightness: await imageBrightness(event.image)
		},
		revalidate
	};
});