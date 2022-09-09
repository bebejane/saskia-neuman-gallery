import styles from './Happenings.module.scss'
import { apiQuery } from '/lib/dato/api';
import { withGlobalProps } from "/lib/hoc";
import { imageColor} from '/lib/utils';
import { GetAllHappenings, GetHappening } from '/graphql';
import Markdown from '/lib/dato/components/Markdown';
import { Layout, Meta, Content } from '/components/Layout'
import { HeaderBar } from 'components/HeaderBar';
import GalleryThumbs from 'components/GalleryThumbs';
import { format } from "date-fns"

export default function Happening({ happening }) {
	return (
		<Layout>
			<Meta>
				<HeaderBar mobile='true'>
					<h3>HAPPENING</h3>
				</HeaderBar>
				<p>
					<b>
						<i>{happening.title}</i><br />
						{format(new Date(happening.startDate), 'dd.MM')}—{format(new Date(happening.endDate), 'dd.MM.yyyy')}
					</b>
				</p>
			</Meta>
			<Content>
				<HeaderBar mobileHide='true'>
					<h1>{happening.title}</h1>
				</HeaderBar>
				<Markdown>{happening.description}</Markdown>
				<section className={styles.artworks}>
					<h2>IMAGES</h2>
					<GalleryThumbs artwork={happening.gallery} />
				</section>
			</Content>
		</Layout>
	)
}

export async function getStaticPaths(context) {
	const { happenings } = await apiQuery(GetAllHappenings)
	const paths = happenings.map(({ slug }) => ({ params: { slug: [slug] } }))
	return {
		paths,
		fallback: 'blocking'
	}
}

export const getStaticProps = withGlobalProps({ model: 'happening' }, async ({ props, context, revalidate }) => {
	const { happening } = await apiQuery(GetHappening, { slug: context.params.slug[0] })

	if (!happening) return { notFound: true }

	return {
		props: {
			...props,
			happening,
			image: happening.image || null,
			color: imageColor(happening.image)
		},
		revalidate
	};
});