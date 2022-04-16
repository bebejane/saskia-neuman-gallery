import styles from './index.module.scss'
import { withGlobalProps } from "/lib/hoc";
import { GetStart } from '/graphql';
import { Image } from "react-datocms"
import cn from "classnames"
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useWindowSize } from 'rooks';

export default function Start({start, image, color}){
	const { links } = start;
	if(!links) return null;

	const [animating, setAnimating] = useState(true)
	const { innerHeight: height, innerWidth:width} = useWindowSize()

	const category = links[0]._modelApiKey === 'show' ? 'SHOWING NOW' : 'UPCOMING'
	const title = `${links[0].title} ${links[0].artists ? links[0].artists[0].name : ''}`
	
	useEffect(()=>{
		const originalColor = document.body.style.backgroundColor;
		document.body.style.backgroundColor = color;
		return () => document.body.style.backgroundColor = originalColor;
	},[])
	
	return (
		<div className={styles.container}>
			{links.map((link)=>
				<Image 
					data={(link.image || link.images[0])?.responsiveImage}
					className={styles.linkImage} 
					prefetch={true}
				/>
			)}
			<div className={cn(styles.titleContainer)}>
				<Link href={`/${links._modelApiKey}s/${links.slug}`}>
					<a>
						<div className={cn(styles.bubble)} style={{color}}>
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
	const color = `rgb(${image?.colors[0].red},${image?.colors[0].green},${image?.colors[0].blue})`
	return {
		props:{
			...props,
			image,
			color
		},
		revalidate
	};
});