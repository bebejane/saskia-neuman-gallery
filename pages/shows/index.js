import styles from './Shows.module.scss'
import { withGlobalProps } from "/lib/utils";
import { GetAllShows } from '/graphql';
import { format } from 'date-fns';
import { Image } from 'react-datocms';

export default function Shows({shows}){
	return (
		<main>
			{shows.map(({title, description, startDate, endDate, images}, idx) => 
				<p key={idx}>
					{title}<br/>
					{format(new Date(startDate), 'yy-MM-dd HH:mm')} - {format(new Date(endDate), 'yy-MM-dd HH:mm')}
					{images.map(image => 
						<Image data={image.responsiveImage}/>
					)}
				</p>
			)}
		</main>
	)
}

export const getStaticProps = withGlobalProps({queries:[GetAllShows]}, async ({props, revalidate }) => {
	return {
		props,
		revalidate
	};
});