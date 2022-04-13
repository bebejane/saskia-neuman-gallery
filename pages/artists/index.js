import styles from './Artists.module.scss'
import { withGlobalProps } from "/lib/utils";
import { GetAllArtists } from '/graphql';
import { Image } from 'react-datocms';
import Markdown from '/lib/dato/components/Markdown';
import Link from 'next/link';

export default function Artists({artists}){
	return (
		<main>
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
		revalidate:200
	};
});