import styles from './Artists.module.scss'
import { withGlobalProps } from "/lib/utils";
import { GetAllArtists } from '/graphql';
import { Image } from 'react-datocms';
import Markdown from '/lib/dato/components/Markdown';

export default function Artists({artists}){
	return (
		<main>
			{artists.map(({name, biography, artwork}, idx) => 
				<p key={idx}>
					{name}<br/>
					<Markdown>{biography}</Markdown>
					{artwork.map(image => 
						<Image data={image.responsiveImage}/>
					)}
				</p>
			)}
		</main>
	)
}

export const getStaticProps = withGlobalProps({queries:[GetAllArtists]}, async ({props, revalidate }) => {
	return {
		props,
		revalidate
	};
});