import styles from './Shows.module.scss'
import { withGlobalProps } from "/lib/utils";
import { GetAllShows } from '/graphql';
import { Image } from 'react-datocms';

export default function Shows({shows}){
	console.log(shows)
	return (
		<div className={styles.container}>
			{shows.map(({title, description, startDate, endDate, images}, idx) => 
				<p key={idx}>
					{title}<br/>
					{startDate} - {endDate}
					{images.map(image => 
						<Image data={image.responsiveImage}/>
					)}
				</p>
			)}
		</div>
	)
}

export const getStaticProps = withGlobalProps({queries:[GetAllShows]}, async ({props, revalidate }) => {
	return {
		props,
		revalidate
	};
});