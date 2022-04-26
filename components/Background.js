import styles from './Background.module.scss'
import { Image } from "react-datocms"
import cn from "classnames"
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';

const duration = 1;
const pageTransition = {
	initial: {
		bottom: 0,
		top:'unset',
		height: '100vh',
		transition:{ duration }
	},
	animate: {
		height:'00vh',
		transitionEnd: {
			bottom:'unset', 
			top:0,
			height:'00vh'
		},
		transition:{ duration }
	},
	exit: {
		height: '100vh',
		transition :{ duration }
	},
	
};

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
			<motion.div 
				initial="initial" 
				animate="animate"
				exit="exit"
				variants={pageTransition} 
				className={styles.motionContainer} 
				onAnimationComplete={()=>setAnimating(false)} 
				onAnimationStart={()=>setAnimating(true)}
			>
				<div className={cn(styles.color)} style={{backgroundColor}}>
					<div className={cn(styles.logo, !showLogo && styles.hide)} style={{background:`url(${image.url}?w=400)`}}>
						<h1>SASKIA NEUMAN GALLERY</h1>
					</div>
				</div>
			</motion.div>
			<div className={cn(styles.container, isHome && styles.sticky)}>
				<Image lazyLoad={false} className={styles.backgroundImage} data={image.responsiveImage}/>
			</div>
		</>
	)
}