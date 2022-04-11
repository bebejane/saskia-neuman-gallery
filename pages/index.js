import styles from './index.module.scss'
import { withGlobalProps } from "/lib/utils";
import { GetStart } from '/graphql';
import { Image } from "react-datocms"
import cn from "classnames"
import { useEffect, useState } from 'react';

export default function Start({start}){
	//console.log(start)
	const { current } = start
	
	if(!current) return null;

	const [animating, setAnimating] = useState(true)
	const image = current.image ? current.image : current.images?.length ? current.images[0] : null
	
	const category = current._modelApiKey === 'show' ? 'SHOWING NOW' : 'UPCOMING'

	const title = `${current.title} by ${current.artists[0].name}`
	const color = 'rgb(255, 207, 188)'
	
	return (
		<div className={styles.container}>
			{image && !animating && <Image className={`${styles.backgroundImage} ${styles.show}`} data={image.responsiveImage}/>}
			<div className={cn(styles.logo)} onAnimationEnd={()=>setAnimating(false)}>
				{!animating && <h1>SASKIA NEUMAN GALLERY</h1>}
			</div>
			<div className={cn(styles.color)} style={{backgroundColor:color}}></div>
			{!animating &&
				<div className={cn(styles.titleContainer)}>
					<div className={cn(styles.bubble)} style={{color}}>
						<span className={styles.category}>{category}</span> 
						<span className={styles.title}>{title}</span>
					</div>
				</div>
			}
		</div>
	)
}

export const getStaticProps = withGlobalProps({queries:[GetStart]}, async ({props, revalidate }) => {
	return {
		props,
		revalidate
	};
});