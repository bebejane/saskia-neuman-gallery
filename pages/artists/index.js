import styles from './Artists.module.scss'
import { withGlobalProps } from "/lib/hoc";
import { GetAllArtists } from '/graphql';
import { Image } from 'react-datocms';
import Markdown from '/lib/dato/components/Markdown';
import Link from 'next/link';

export default function Artists({artists}){
	return (
		<main>
			<h3>Artists</h3>
			{artists.map(({name, biography, artwork, slug}, idx) => 
				<Link href={`/artists/${slug}`}>
					<a>{name}</a>
				</Link>
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