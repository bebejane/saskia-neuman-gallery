import styles from './Shows.module.scss'
import { apiQuery } from '/lib/dato/api';
import { withGlobalProps } from "/lib/hoc";
import { GetAllShows,  GetShow } from '/graphql';
import { Image } from 'react-datocms';
import Markdown from '/lib/dato/components/Markdown';
import { format } from "date-fns"
import Link from 'next/link';

export default function Show({show}){
  const { title, description, startDate, endDate, slug, artists} = show;
	return (
		<main>
			{title} - 
			{artists.map(a => 
				<Link href={`/artists/${a.slug}`}>
					<a>{a.name}</a>
				</Link>
			)}
			<br/>
      {format(new Date(startDate), 'yy-MM-dd HH:mm')} - {format(new Date(endDate), 'yy-MM-dd HH:mm')}
      <Markdown>{description}</Markdown>
		</main>
	)
}

export async function getStaticPaths(context) {
  const { shows } = await apiQuery(GetAllShows)
	const paths = shows.map(({slug}) => ({params:{slug:[slug]}}))
	return {
		paths,
		fallback: 'blocking'
	}
}

export const getStaticProps = withGlobalProps(async ({props, context, revalidate }) => {
  const { show } = await apiQuery(GetShow, {slug:context.params.slug[0]})
  return {
		props :{
      ...props,
			image:show.images[0] || null,
			color:show.images[0]?.colors[0] || null,
      show
    },
		revalidate
	};
});