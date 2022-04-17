import styles from './About.module.scss'
import { withGlobalProps } from "/lib/hoc";
import { GetAbout} from '/graphql';
import { Image } from 'react-datocms';
import Markdown from '/lib/dato/components/Markdown';
import { imageColor } from 'lib/utils';

export default function About({about}){
	const { summary, address, hours, email, googleMapsUrl, image} = about || {};
	return (
		<main>
			<h3>About</h3>
			<p>
				<Markdown>{summary}</Markdown>
				<Markdown>{address}</Markdown>
				<a href={`mailto:${email}`}>{email}</a>
			</p>
			<p>
				Opening hours: {hours}
			</p>
			<p>
				<a href={googleMapsUrl}>Google maps</a>
			</p>
		</main>
	)
}

export const getStaticProps = withGlobalProps({queries:[GetAbout]}, async ({props, revalidate }) => {
	const { image } = props.about;

	return {
		props:{
			...props,
			image: image || null,
			color: imageColor(image)
		},
		revalidate
	};
});