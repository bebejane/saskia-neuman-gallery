import styles from './PageTransition.module.scss'
import useStore from "/store";
import cn from "classnames"
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
		transition:{ duration, ease:'easeOut', delay:0.1 },
		transitionEnd:{
			top:'0%',
			height:'0vh'
		}
	},
	exit: {
		height: ['0vh', '100vh'],
		top:['0%', '0%'],
		transitionEnd :{
			top:'0%',
			height:'100vh'
		},
		transition:{ duration, ease  : 'easeIn'}
	},
	home:{
		height: ['0vh', '100vh', '0vh'],
		top:['0%', '0%', '100%'],
		transition:{ duration: duration*2, ease:['easeIn', 'easeOut'], delay:1},
	}
}

export default function PageTransition({image}){
	
	const backgroundColor = useStore((state) => state.backgroundColor);
	const setIsTransitioning = useStore((state) => state.setIsTransitioning);
	const setIsExiting = useStore((state) => state.setIsExiting);
	const isTransitioning = useStore((state) => state.isTransitioning);
	const setShowMobileMenu = useStore((state) => state.setShowMobileMenu);
  
	const router = useRouter()
	const isHome = router.asPath === '/';
	const hideLogo = (isHome && !isTransitioning) || !isHome
	const color = `rgb(${backgroundColor?.join(',')})`;
	
	const handleAnimationEvent = (type, variant) => {
		const isComplete = ['home', 'enter'].includes(variant) && type === 'complete'
		const isExiting = variant === 'exit' && type === 'start'

		setIsTransitioning(!isComplete)
		setIsExiting(isExiting)

		if(variant === 'exit' && type === 'complete') {
			window.scrollTo({ top: 0, behavior:'instant' })
			setShowMobileMenu(false)
		}	
	}

	return (
    <motion.div
			className={styles.pageTransition} 
			initial="initial" 
      animate={isHome ? "home" : "enter"}
      exit={!isHome ? "exit" : undefined}
      variants={pageTransition} 
      onAnimationComplete={ (variant) => handleAnimationEvent('complete', variant)}
      onAnimationStart={(variant) => handleAnimationEvent('start', variant)}
    >
			
      <div className={styles.color} style={{backgroundColor: color}}>
        <div className={cn(styles.logo, hideLogo && styles.hide)}  style={{background:`url(${image?.url}?w=1400)`}}>
          <h1>SASKIA NEUMAN GALLERY</h1>
        </div>
      </div>
			{isHome && <div className={styles.white}></div>}
    </motion.div>
	)
}