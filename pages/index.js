import styles from './index.module.scss'
import { withGlobalProps } from "/lib/hoc";
import { imageColor, imageBrightness } from '/lib/utils';
import { GetStart } from '/graphql';
import { Image } from "react-datocms"
import cn from "classnames"
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Start({start, image, color}){
	
	const { links } = start;

	if(!links) return null;

	const category = links[0]._modelApiKey === 'show' ? 'SHOWING NOW' : 'UPCOMING'
	const title = `${links[0].title} ${links[0].artists.length ? links[0].artists[0]?.name : ''}`
	
	useEffect(()=>{
		const originalColor = document.body.style.backgroundColor;
		document.body.style.backgroundColor = color;
		return () => document.body.style.backgroundColor = originalColor;
	},[])
	
	
	if(!links || !links.length) return null

	return (
		<div className={styles.container}>
			{links.slice(1).map((link, idx)=>
				<Link href={`/${link._modelApiKey}s/${link.slug}`}>
					<a key={idx}>
						<Image 
							data={(link.image || link.images[0])?.responsiveImage}
							className={styles.linkImage} 
							prefetch={true}
						/>
					</a>
				</Link>
			)}
			<div className={cn(styles.titleContainer)}>
				<Link href={`/${links[0]._modelApiKey}s/${links[0].slug}`}>
					<a>
						<div className={cn(styles.bubble)} style={{color:`rgb(${ color.join(',') })`}}>
							<span className={styles.category}>{category}</span> <span className={styles.title}>{title}</span>
						</div>
					</a>
				</Link>
			</div>
		</div>
	)
}


export const getStaticProps = withGlobalProps({queries:[GetStart], model:'start'}, async ({props, revalidate }) => {
	const { links } = props.start
	const image = links[0]?.image ? links[0].image : links[0]?.images?.length ? links[0]?.images[0] : null

	return {
		props:{
			...props,
			image,
			color: imageColor(image),
			brightness : await imageBrightness(image)
		},
		revalidate
	};
});