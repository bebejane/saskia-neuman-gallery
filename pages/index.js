import styles from './index.module.scss'
import { withGlobalProps } from "/lib/utils";
import { GetStart } from '/graphql';
import { Image } from "react-datocms"
import cn from "classnames"
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useWindowSize, useWindowScrollPosition } from 'rooks';

const { getColorFromURL } = require('color-thief-node');

export default function Start({current, image, color}){
	if(!current) return null;

	const [animating, setAnimating] = useState(true)
	const { scrollY } = useWindowScrollPosition()
	const { innerHeight: height, innerWidth:width} = useWindowSize()

	const scrollPercentage = (scrollY/height);
	const category = current._modelApiKey === 'show' ? 'SHOWING NOW' : 'UPCOMING'
	const title = `${current.title} ${current.artists ? current.artists[0].name : ''}`
	const backgroundColor = color
	const logoStyle = {background:`url(${image.url})`}
	const colorStyle = {backgroundColor, top:`${(scrollPercentage*height)*2}px`, maxHeight:`${((1-(scrollPercentage))*100)}vh`};

	useEffect(()=>{
		
		
		//const {clientWidth} = document.querySelector(`.${styles.backgroundImage} > picture > img`)
		//onsole.log(image)
		//console.log(clientWidth)
	}, [image, animating])
	//console.log(size)
	return (
		<div className={styles.container}>
			{image && !animating && 
				<Image className={`${styles.backgroundImage} ${styles.show}`} data={image.responsiveImage}/>
			}
			<div className={cn(styles.logo)} style={logoStyle} onAnimationEnd={()=>setAnimating(false)} >
				{!animating && <h1>SASKIA NEUMAN GALLERY</h1>}
			</div>
			<div className={cn(styles.color)} style={colorStyle}></div>
			{!animating &&
				<div className={cn(styles.titleContainer)}>
					<Link href={`/${current._modelApiKey}s/${current.slug}`}>
						<a>
							<div className={cn(styles.bubble)} style={{color}}>
								<span className={styles.category}>{category}</span> 
								<span className={styles.title}>{title}</span>
							</div>
						</a>
					</Link>
				</div>
			}
		</div>
	)
}

export const getStaticProps = withGlobalProps({queries:[GetStart], model:'start'}, async ({props, revalidate }) => {
	const { current } = props.start
	const image = current.image ? current.image : current.images?.length ? current.images[0] : null
	const color = 'pink'//image ? `rgb(${(await getColorFromURL(image.url)).join(',')})` : null;

	return {
		props:{
			...props.start,
			image, 
			color
		},
		revalidate
	};
});