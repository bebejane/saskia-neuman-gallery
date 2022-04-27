import styles from './Background.module.scss'
import { Image } from "react-datocms"
import cn from "classnames"
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import PageTransition from "/components/PageTransition";

const duration = 1.5;
const pageTransition = {
	initial: {
		height: '0vh',
		top:'0%'
	},
	animate: {
		height: ['0vh', '100vh', '0vh'],
		top:['0%', '0%', '100%'],
		transition:{ duration },
		transitionEnd:{
			top:'0%',
			height:'0vh'
		}
	},
	exit: {
		height: ['0vh', '100vh'],
		top:['0%', '0%'],
		transitionEnd :{
		},
		transition:{ duration }
	}
}

export default function Background({image, color, title, brightness}){
  
	if(!image) return null;

	const router = useRouter()
	const [animating, setAnimating] = useState(true)
	const backgroundColor = `rgb(${color?.join(',')})`;
	const isHome = router.asPath === '/';
	const showLogo = (animating && isHome)
	
	useEffect(()=>{
		const originalColor = document.body.style.backgroundColor;
		document.body.style.backgroundColor = color;
		return () => document.body.style.backgroundColor = originalColor;
	},[])
	
	return (
		<>
			<PageTransition backgroundImage={image} color={color}/>
			<div className={cn(styles.container, isHome && styles.sticky)}>
				<Image lazyLoad={false} className={styles.backgroundImage} data={image.responsiveImage}/>
			</div>
		</>
	)
}