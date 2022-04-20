import styles from './Events.module.scss'
import { withGlobalProps } from "/lib/hoc";
import { imageColor, imageBrightness } from '/lib/utils';
import { GetAllEvents} from '/graphql';
import { Image } from 'react-datocms';
import { format } from 'date-fns';
import Link from 'next/link';

export default function Events({events}){
	return (
		<main>
			<h3>Events</h3>
			{events.map(({title, description, startDate, endDate, slug}, idx) => 
				<p key={idx}>
					<Link href={`/events/${slug}`}>
						<a>{title}</a>
					</Link>
					<br/>
					{format(new Date(startDate), 'yy-MM-dd HH:mm')} - {format(new Date(endDate), 'yy-MM-dd HH:mm')}
				</p>
			)}
		</main>
	)
}

export const getStaticProps = withGlobalProps({queries:[GetAllEvents]}, async ({props, revalidate }) => {
	return {
		props:{
			...props,
			image: props.events[0]?.image,
			color: imageColor(props.events[0]?.image),
			brightness : await imageBrightness(props.events[0]?.image)
		},
		revalidate
	}
});