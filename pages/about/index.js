import styles from './About.module.scss'
import { withGlobalProps } from "/lib/hoc";
import { GetAbout} from '/graphql';
import { Image } from 'react-datocms';
import Markdown from '/lib/dato/components/Markdown';
import { imageColor } from 'lib/utils';

export default function About({about}){
	
	const { description, address, hours, email, googleMapsUrl, image} = about || {};

	return (
		<main>
			<section className={styles.about}>
				<div className={styles.content}>
					<div className={styles.contact}>
						<h3>Contact</h3>
						<Markdown>{address}</Markdown>
						Opening hours: {hours}<br/>
						<a href={`mailto:${email}`}>{email}</a><br/>
						<a href={googleMapsUrl}>View in Google Maps</a>
					</div>
					<div className={styles.description}>
						<h1>About</h1>
						<Markdown>{description}</Markdown>
					</div>
				</div>
				<div className={styles.archive}>
					<h3>Archive</h3>
					<div className={styles.links}></div>
				</div>
			</section> 
		</main>
	)
}

export const getStaticProps = withGlobalProps({queries:[GetAbout], model:'about'}, async ({props, revalidate }) => {
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