import styles from './Events.module.scss'
import { apiQuery } from '/lib/dato/api';
import { withGlobalProps } from "/lib/hoc";
import { imageColor } from '/lib/utils';
import { GetAllEvents,  GetEvent } from '/graphql';
import { Image } from 'react-datocms';
import Markdown from '/lib/dato/components/Markdown';

export default function Event({event}){
	return (
		<main>
			{event.title}
		</main>
	)
}

export async function getStaticPaths(context) {
  const { events } = await apiQuery(GetAllEvents)
	const paths = events.map(({slug}) => ({params:{slug:[slug]}}))
	return {
		paths,
		fallback: 'blocking'
	}
}

export const getStaticProps = withGlobalProps(async ({props, context, revalidate }) => {
  const { event } = await apiQuery(GetEvent, {slug:context.params.slug[0]})
  
	return {
		props :{
      ...props,
      event,
			image: event.image || null,
			color: imageColor(event.image),
    },
		revalidate
	};
});