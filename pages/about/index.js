import styles from './About.module.scss'
import { withGlobalProps } from "/lib/hoc";
import { GetAbout } from '/graphql';
import { Image } from 'react-datocms';
import Markdown from '/lib/dato/components/Markdown';
import { imageColor, imageBrightness } from '/utils';
import { Layout, Meta, Content } from '/components/Layout'
import { HeaderBar } from 'components/HeaderBar';
import { format } from "date-fns"

export default function About({ about, externalLinks }) {
	const { description, address, hours, email, googleMapsUrl, image } = about || {};

	externalLinks = externalLinks.concat(externalLinks).concat(externalLinks).concat(externalLinks).concat(externalLinks).concat(externalLinks)

	return (
		<>
			<Layout noMargin='true'>
				<Meta>
					<HeaderBar>
						<h3>Contact</h3>
					</HeaderBar>
					<p><b>
						<Markdown>{address}</Markdown>
						<a href={googleMapsUrl} target="new">View in Google Maps ↗</a><br /><br />
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

			</Layout>
			<Layout noMargin='true'>
				<section className={styles.archive}>
					<h2>Archive</h2>
					<ul>
						{externalLinks.map(({ title, url, image, _createdAt }) =>
							<a href={url} target="new">
								<li>
									<Image data={image.responsiveImage} className={styles.image} />
									<h4>{format(new Date(_createdAt), 'dd.MM.yy')}</h4>
									<h1>{title} ↗</h1>
								</li>
							</a>
						)}
					</ul>
				</section>
			</Layout>
		</>
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