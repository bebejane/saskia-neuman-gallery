import styles from './About.module.scss'
import { withGlobalProps } from "/lib/hoc";
import { GetAbout } from '/graphql';
import { Image } from 'react-datocms';
import Markdown from '/lib/dato/components/Markdown';
import { imageColor, imageBrightness } from '/lib/utils';
import { Layout, Meta, Content } from '/components/Layout'
import { HeaderBar } from 'components/HeaderBar';

export default function About({ about }) {
	const { description, address, hours, email, googleMapsUrl, image } = about || {};
	return (
		<Layout>
			<Meta>
				<HeaderBar>
					<h3>Contact</h3>
				</HeaderBar>
				<p><b>
					<Markdown>{address}</Markdown>
					<a href={googleMapsUrl}>View in Google Maps</a><br />
					Opening hours:<br />
					{hours}<br /><br />
					<a href={`mailto:${email}`}>{email}</a><br />
				</b></p>
			</Meta>
			<Content>
				<HeaderBar>
					<h1>About</h1>
				</HeaderBar>
				<Markdown>{description}</Markdown>
			</Content>
			<section className={styles.archive}>
				<h2>Archive</h2>
				Archive of all external links (model that doesent exists yet). Might need some kind of auto load on scroll...
				<div className={styles.links}></div>
			</section>
		</Layout>
	)
}

export const getStaticProps = withGlobalProps({ queries: [GetAbout], model: 'about' }, async ({ props, revalidate }) => {
	const { image } = props.about;
	return {
		props: {
			...props,
			image: image || null,
			color: imageColor(image),
			brightness: await imageBrightness(image)
		},
		revalidate
	};
});