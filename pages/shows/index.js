import styles from './Shows.module.scss'
import { withGlobalProps } from "/lib/hoc";
import { imageColor, imageBrightness } from '/lib/utils';
import { GetAllShows } from '/graphql';
import { format } from 'date-fns';
import { Image } from 'react-datocms';
import Link from 'next/link';
import Layout from 'components/Layout';

export default function Shows({ shows }) {
	return (
		<Layout>
			<h3>Shows!</h3>
			{shows.map(({ title, startDate, endDate, slug }, idx) =>
				<p key={idx}>
					<Link href={`/shows/${slug}`}>
						<a>{title}</a>
					</Link>
					<br />
					{format(new Date(startDate), 'yy-MM-dd HH:mm')} - {format(new Date(endDate), 'yy-MM-dd HH:mm')}
				</p>
			)}
		</Layout>
	)
}

export const getStaticProps = withGlobalProps({ queries: [GetAllShows] }, async ({ props, revalidate }) => {

	return {
		props: {
			...props,
			image: props.shows[0]?.image,
			color: imageColor(props.shows[0]?.image),
			brightness: await imageBrightness(props.shows[0]?.image)
		},
		revalidate
	};
});