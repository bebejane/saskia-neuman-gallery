import styles from './PageTransition.module.scss'
import cn from "classnames"
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';

const duration = 0.7;
const pageTransition = {
	initial: {
		height: '100vh',
		top:'0%'
	},
	animate: {
		height: ['100vh', '0vh'],
		top:['0%', '100%'],
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

export default function PageTransition(props){
	
	const {backgroundImage, color} = props;
	const router = useRouter()
	const [animating, setAnimating] = useState(false)
	const backgroundColor = `rgb(${color?.join(',')})`;
	const isHome = router.asPath === '/';
	const showLogo = (animating && isHome)
	
	useEffect(()=>{
		const originalColor = document.body.style.backgroundColor;
		document.body.style.backgroundColor = color;
		return () => document.body.style.backgroundColor = originalColor;
	},[])

	return (
    <motion.div
			className={styles.container} 
			initial="initial" 
      animate={"animate"}
      exit={"exit"}
      variants={pageTransition} 
      onAnimationComplete={()=>setAnimating(false)} 
      onAnimationStart={()=>setAnimating(true)}
    >
      <div className={styles.color} style={{backgroundColor}}>
        <div className={cn(styles.logo, !showLogo && styles.hide)} style={{background:`url(${backgroundImage?.url}?w=400)`}}>
          <h1>SASKIA NEUMAN GALLERY</h1>
        </div>
      </div>	
    </motion.div>
	)
}