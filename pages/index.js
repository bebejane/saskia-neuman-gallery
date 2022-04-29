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
	
	useEffect(()=>{
		const originalColor = document.body.style.backgroundColor;
		document.body.style.backgroundColor = color;
		return () => document.body.style.backgroundColor = originalColor;
	},[])
	
	if(!links || !links.length) return null

	return (
		<div className={styles.container}>
			{links.map((link, idx) => {
				
				const type = link._modelApiKey === 'show' ? 'SHOWING NOW' : 'UPCOMING'
				const title = `${link.title} ${link.artists?.length ? link.artists[0]?.name : ''}`
				const bubbleStyle = {color:`rgb(${ imageColor(link.image).join(',') })`}

				return (
					<Link key={idx} href={`/${link._modelApiKey}s/${link.slug}`} scroll={false}>
						<a className={styles.card}>
							{idx > 0 && 
								<Image 
									className={styles.linkImage} 
									data={(link.image || link.images[0])?.responsiveImage}
									prefetch={true}
								/>
							}
							<div className={cn(styles.headline)}>
								<div className={styles.bubble} style={bubbleStyle}>
									<span className={styles.type}>{type}</span> 
									<span className={styles.title}>{title}</span>
								</div>
							</div>
						</a>
					</Link>
				)}
			)}			
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