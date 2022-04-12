import styles from './index.module.scss'
import { withGlobalProps } from "/lib/utils";
import { GetStart } from '/graphql';
import { Image } from "react-datocms"
import cn from "classnames"
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useWindowSize, useWindowScrollPosition } from 'rooks';
import * as Vibrant from 'node-vibrant'

export default function Start({start, image, color}){
	const { current } = start;
	if(!current) return null;

	const [animating, setAnimating] = useState(true)
	const { scrollY } = useWindowScrollPosition()
	const { innerHeight: height, innerWidth:width} = useWindowSize()

	const scrollPercentage = (scrollY/height);
	const category = current._modelApiKey === 'show' ? 'SHOWING NOW' : 'UPCOMING'
	const title = `${current.title} ${current.artists ? current.artists[0].name : ''}`
	const backgroundColor = `rgb(${image?.colors[0].red},${image?.colors[0].green},${image?.colors[0].blue})`
	
	const logoStyle = {background:`url(${image.url}?w=400)`}
	const colorStyle = {
		backgroundColor, 
		maxHeight:`${100-(scrollPercentage*100)}vh`, 
		top:`${(scrollPercentage*height)*2}px`, 
	};
	const colorStyleLower = { 
		height:`${100-(scrollPercentage*100)}vh`, 
		top:`${(scrollPercentage*height)*2}px`, 
		maxHeight:`${100-(scrollPercentage*100)}vh`,
	};

	useEffect(()=>{
		document.body.style.backgroundColor = backgroundColor;
		return () => document.body.style.backgroundColor = 'unset';
	},[])
	
	return (
		<div className={styles.container}>
			{image && !animating && <Image lazyLoad={false} className={`${styles.backgroundImage} ${styles.show}`} data={image.responsiveImage}/>}
			<div className={cn(styles.color, styles.lower)} style={colorStyleLower}></div>
			<div className={cn(styles.logo)} style={logoStyle}><h1>SASKIA NEUMAN GALLERY</h1></div>
			<div className={cn(styles.color, styles.upper)} style={colorStyle} onAnimationEnd={()=>setAnimating(false)}></div>
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
		</div>
	)
}

export const getStaticProps = withGlobalProps({queries:[GetStart], model:'start'}, async ({props, revalidate }) => {
	const { current } = props.start
	const image = current?.image ? current.image : current?.images?.length ? current?.images[0] : null
	//const palette = await Vibrant.from(image.url).getPalette()
	//const dominantColor = palette.DarkMuted._rgb// Object.keys(palette).map(k => palette[k]).sort((a,b) => a._population < b._population ? 1 : -1)[0]._rgb
	//const color = image ? `rgb(${dominantColor.join(',')})` : null;
	//console.log(palette)
	return {
		props:{
			...props,
			image
			//color
		},
		revalidate
	};
});