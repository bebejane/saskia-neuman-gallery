import styles from './About.module.scss'
import { withGlobalProps } from "/lib/utils";
import { GetAbout} from '/graphql';
import { Image } from 'react-datocms';
import Markdown from '/lib/dato/components/Markdown';

export default function About({about}){
	const { summary, address, hours, email, googleMapsUrl, image} = about || {};
	return (
		<main>
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
	return {
		props,
		revalidate
	};
});