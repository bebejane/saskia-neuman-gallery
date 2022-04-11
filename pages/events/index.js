import styles from './Events.module.scss'
import { withGlobalProps } from "/lib/utils";
import { GetAllEvents} from '/graphql';
import { Image } from 'react-datocms';

export default function Events({events}){
	console.log(events)
	return (
		<div className={styles.container}>
			{events.map(({title, description, startDate, endDate}, idx) => 
				<p key={idx}>
					{title}<br/>
					{startDate} - {endDate}
				</p>
			)}
		</div>
	)
}

export const getStaticProps = withGlobalProps({queries:[GetAllEvents]}, async ({props, revalidate }) => {
	return {
		props,
		revalidate
	};
});