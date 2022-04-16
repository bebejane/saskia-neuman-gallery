import styles from './Artists.module.scss'
import { apiQuery } from '/lib/dato/api';
import { withGlobalProps } from "/lib/hoc";
import { GetAllArtists,  GetArtist } from '/graphql';
import { Image } from 'react-datocms';
import Markdown from '/lib/dato/components/Markdown';
import Link from 'next/link';

export default function Artist({artist:{ name, biography, images }}){
	return (
		<main>
      {name}<br/>
      <Markdown>{biography}</Markdown>
      {images.map(image => 
        <Image data={image.responsiveImage}/>
      )}
		</main>
	)
}

export async function getStaticPaths(context) {
  const { artists } = await apiQuery(GetAllArtists)
	const paths = artists.map(({slug}) => ({params:{slug:[slug]}}))
	return {
		paths,
		fallback: 'blocking'
	}
}

export const getStaticProps = withGlobalProps(async ({props, context, revalidate }) => {
  const { artist } = await apiQuery(GetArtist, {slug:context.params.slug[0]})
	const image = artist.images[0]
  
	return {
		props :{
      ...props,
      artist,
			image:artist.images[0] || null,
			color:artist.images[0]?.colors[0] || null,
    },
		revalidate
	};
});