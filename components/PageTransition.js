import styles from './PageTransition.module.scss'
import useStore from "/store";
import cn from "classnames"
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';

const duration = 0.6;
const pageTransition = {
	initial: {
		height: '100vh',
		top:'0%'
	},
	enter: {
		height: ['100vh', '0vh'],
		top:['0%', '100%'],
		transition:{ duration, ease:'easeOut' },
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
		transition:{ duration, ease  : 'easeIn'}
	},
	home:{
		height: ['0vh', '100vh', '0vh'],
		top:['0%', '0%', '100%'],
		transition:{ duration: duration*2, ease:['easeIn', 'easeOut'] },
	},
	
	exitHome: {
		transition:{ duration:0 }
	}
}

export default function PageTransition({image}){
	
	const backgroundColor = useStore((state) => state.backgroundColor);
	const router = useRouter()
	const [animating, setAnimating] = useState(true)
	const isHome = router.asPath === '/';
	const hideLogo = (isHome && !animating) || !isHome
	const color = `rgb(${backgroundColor?.join(',')})`;
	
	return (
    <motion.div
			className={styles.pageTransition} 
			initial="initial" 
      animate={isHome ? "home" : "enter"}
      exit={!isHome ? "exit" : undefined}
      variants={pageTransition} 
      onAnimationComplete={()=>setAnimating(false)} 
      onAnimationStart={()=>setAnimating(true)}
    >
      <div className={styles.color} style={{backgroundColor: color}}>
        <div 
					className={cn(styles.logo, hideLogo && styles.hide)} 
					style={{background:`url(${image?.url}?w=1400)`}}
				>
          <h1>SASKIA NEUMAN GALLERY</h1>
        </div>
      </div>
			{isHome && <div className={styles.white}></div>}
    </motion.div>
	)
}