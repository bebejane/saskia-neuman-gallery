import styles from './PageTransition.module.scss'
import useStore from "/store";
import cn from "classnames"
import { useState } from 'react';
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
	
	const backgroundColor = useStore((state) => state.backgroundColor);
	const backgroundImage = useStore((state) => state.backgroundImage);
	
	const router = useRouter()
	const [animating, setAnimating] = useState(false)
	const isHome = router.asPath === '/';
	const showLogo = (animating && isHome)
	const color = `rgb(${backgroundColor?.join(',')})`;

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
      <div className={styles.color} style={{backgroundColor: color}}>
        <div 
					className={cn(styles.logo, !showLogo && styles.hide)} 
					style={{background:`url(${backgroundImage?.url}?w=400)`}}
				>
          <h1>SASKIA NEUMAN GALLERY</h1>
        </div>
      </div>	
    </motion.div>
	)
}