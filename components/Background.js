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
		height:'0vh',
		transitionEnd: {
			bottom:'unset', 
			top:0,
			height:'0vh'
		},
		transition:{ duration }
	},
	exit: {
		height: '100vh',
		transition :{ duration }
	},
	
};

export default function Background({image, color, pathname}){
  if(!image) return null;
	
	const router = useRouter()
	const [animating, setAnimating] = useState(true)
	const backgroundColor = `rgb(${color.join(',')})`;

	useEffect(()=>{
		const originalColor = document.body.style.backgroundColor;
		document.body.style.backgroundColor = color;
		return () => document.body.style.backgroundColor = originalColor;
	},[])
	
	return (
		<div className={styles.container}>
			<Image lazyLoad={false} className={styles.backgroundImage} data={image.responsiveImage}/>
			<motion.div 
				initial="initial" 
				animate="animate"
				exit="exit"
				variants={pageTransition} 
				className={styles.motionContainer} 
				onAnimationComplete={()=>setAnimating(false)} 
				onAnimationStart={()=>setAnimating(true)}
			>
				<div key={'upper'} className={cn(styles.color, styles.upper)} style={{backgroundColor}}>
					<div 
						className={cn(styles.logo, !animating && styles.hide)} 
						style={{background:`url(${image.url}?w=400)`}}
					>
						<h1>SASKIA NEUMAN GALLERY</h1>
					</div>
				</div>
			</motion.div>
			<div key={'lower'} className={cn(styles.color, styles.lower)}></div>
		</div>
	)
}