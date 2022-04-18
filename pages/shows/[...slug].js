import styles from './Shows.module.scss'
import { apiQuery } from '/lib/dato/api';
import { withGlobalProps } from "/lib/hoc";
import { imageColor } from '/lib/utils';
import { GetAllShows,  GetShow } from '/graphql';
import Markdown from '/lib/dato/components/Markdown';
import { format } from "date-fns"
import { Image } from 'react-datocms';
import { useState } from 'react';
import Gallery from '/components/Gallery'

export default function Show({ show :{ title, description, startDate, endDate, slug, artwork, artists, press}}){
  
	const [showGallery, setShowGallery] = useState(false)

	return (
		<>
			<main>
				<article className={styles.show}>
					<section className={styles.left}>
						<h3>EXHIBITIONS</h3>
						<p>
							{artists.map(a => a.name).join(', ')}<br/>
							{title}<br/>
							{format(new Date(startDate), 'dd.MM')} - {format(new Date(endDate), 'dd.MM.yyyy')}
						</p>
					</section>
					<section className={styles.right}>
						<h1>{title}</h1>
						<Markdown>{description}</Markdown>
						<div className={styles.artworks}>
							<h3>ARTWORKS</h3>
							<div className={styles.gallery}>
								{artwork.map((image)=>
									<Image data={image.responsiveImage}/>
								)}
							</div>
							<a onClick={()=>setShowGallery(true)}>[Gallery]</a>
						</div>
						<div className={styles.press}>
							<h3>PRESS</h3>
							<div className={styles.press}>
								{press.map(({date, source, author,url})=>
									<div className={styles.block}>
										{format(new Date(date), 'dd.MM.yyyy')}<br/>
										{source} <a href={url}>-></a><br/>
										{author}
									</div>
								)}
							</div>
						</div>
					</section>
				</article>	
			</main>
			{showGallery && <Gallery images={artwork} onClose={()=>setShowGallery(false)}/>}
		</>
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

export const getStaticProps = withGlobalProps({model:'show'}, async ({props, context, revalidate }) => {
  const { show } = await apiQuery(GetShow, {slug:context.params.slug[0]})
	
  return {
		props :{
      ...props,
			image: show.image || null,
			color: imageColor(show.image),
      show
    },
		revalidate
	};
});