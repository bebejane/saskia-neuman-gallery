import styles from './About.module.scss'
import { withGlobalProps } from "/lib/utils";
import { GetAbout} from '/graphql';
import { Image } from 'react-datocms';

export default function About({about}){
	console.log(about)
	const { summary, address, hours, email, googleMapsUrl, image} = about || {};
	return (
		<div className={styles.container}>	
			<p>
				{summary}
			</p>
			<p>
				{address}<br/>
				{email}
			</p>
			<p>
				{hours}
			</p>
			<p>
				<a href={googleMapsUrl}>Google maps</a>
			</p>

		</div>
	)
}

export const getStaticProps = withGlobalProps({queries:[GetAbout]}, async ({props, revalidate }) => {
	return {
		props,
		revalidate
	};
});