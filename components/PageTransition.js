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
	home:{
		height: ['0vh', '100vh', '0vh'],
		top:['0%', '0%', '100%'],
		transition:{ duration: duration*2 },
	},
	exit: {
		height: ['0vh', '100vh'],
		top:['0%', '0%'],
		transitionEnd :{
		},
		transition:{ duration }
	},
	exitHome: {
		transition:{ duration:0 }
	}
}

export default function PageTransition(props){
	const { image } = props
	const backgroundColor = useStore((state) => state.backgroundColor);
	const router = useRouter()
	const [animating, setAnimating] = useState(true)
	const isHome = router.asPath === '/';
	const showLogo = (isHome && animating)
	const color = `rgb(${backgroundColor?.join(',')})`;
	
	return (
    <motion.div
			className={styles.container} 
			initial="initial" 
      animate={isHome ? "home" : "animate"}
      exit={!isHome ? "exit" :undefined}
      variants={pageTransition} 
      onAnimationComplete={()=>setAnimating(false)} 
      onAnimationStart={()=>setAnimating(true)}
    >
      <div className={styles.color} style={{backgroundColor: color}}>
        <div className={cn(styles.logo, showLogo && styles.show)} style={{background:`url(${image?.url}?w=400)`}}>
          <h1>SASKIA NEUMAN GALLERY</h1>
        </div>
      </div>	
    </motion.div>
	)
}