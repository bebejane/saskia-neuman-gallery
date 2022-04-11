import styles from './Artists.module.scss'
import { withGlobalProps } from "/lib/utils";
import { GetAllArtists } from '/graphql';
import { Image } from 'react-datocms';

export default function Artists({artists}){
	console.log(artists)
	return (
		<div className={styles.container}>
			{artists.map(({name, biography, artwork}, idx) => 
				<p key={idx}>
					{name}<br/>
					{biography}
					{artwork.map(image => 
						<Image data={image.responsiveImage}/>
					)}
				</p>
			)}
		</div>
	)
}

export const getStaticProps = withGlobalProps({queries:[GetAllArtists]}, async ({props, revalidate }) => {
	return {
		props,
		revalidate
	};
});