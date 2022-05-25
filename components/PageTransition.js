import styles from './PageTransition.module.scss'
import useStore from "/store";
import cn from "classnames"
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import usePreviousRoute from '/lib/hooks/usePreviousRoute';
import { useState } from 'react';

const duration = 0.6;
const pageTransition = {
	initial: {
		height: '100vh',
		top:'0%'
	},
	enter: {
		height: ['100vh', '0vh'],
		top:['0%', '100%'],
		transition:{ duration, ease:'easeInOut', delay:0.1 },
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
		transition:{ duration, ease:'easeOut'}
	},
	exitInstant: {
		transition:{ duration:0 },
		transitionEnd :{
			top:'0%',
			height:'100vh'
		}
	},
	homeIntro:{
		height: ['0vh', '100vh', '0vh'],
		top:['0%', '0%', '100%', ],
		transition:{ duration: duration*2, ease:'easeInOut', delay:1},
	},
	home:{
		height: ['0vh', '100vh', '0vh'],
		top:['0%', '0%', '100%'],
		transition:{ duration: duration*2, ease:'easeInOut', delay:0},
	}
}

export default function PageTransition({image}){
	
	const backgroundColor = useStore((state) => state.backgroundColor);
	const setIsTransitioning = useStore((state) => state.setIsTransitioning);
	const setIsExiting = useStore((state) => state.setIsExiting);
	const isTransitioning = useStore((state) => state.isTransitioning);
	
	const router = useRouter()
	const prevRoute = usePreviousRoute()

	const isHome = router.asPath === '/';
	const [showLogo, setShowLogo] = useState(isHome)
	const color = `rgb(${backgroundColor?.join(',')})`;
	
	const handleAnimationEvent = (type, variant) => {
		
		if(variant.startsWith('exit') && type === 'complete')
			window.scrollTo({ top: 0, behavior:'instant' }) // Scroll top efter exit animation

		const isComplete = ['home', 'homeIntro', 'enter'].includes(variant) && type === 'complete'
		const isExiting = variant.startsWith('exit') && type === 'start'

		setIsTransitioning(!isComplete)
		setIsExiting(isExiting)

	}

	const handleAnimationUpdate = ({height, top}) => {
		if(parseInt(top) > 0 && parseInt(height) <= 50 && showLogo)
			setShowLogo(false)
	}
	console.log(showLogo)
	return (
    <motion.div
			className={styles.pageTransition} 
			initial="initial" 
      animate={isHome ? !prevRoute ? "homeIntro" : "home" : "enter"}
      exit={isHome ? "exitInstant" : "exit" }
      variants={pageTransition} 
      onAnimationComplete={ (variant) => handleAnimationEvent('complete', variant)}
      onAnimationStart={(variant) => handleAnimationEvent('start', variant)}
			onUpdate={handleAnimationUpdate}
    >	
      <div className={styles.color} style={{backgroundColor: color}}>
        <div 
					className={cn(styles.logo)}
					//style={{background:`url(${image?.url}?w=1400)`}}
				>
          <h1 style={{opacity: showLogo ? 1 : 0}}>
						SASKIA NEUMAN GALLERY
					</h1>
        </div>
      </div>
			{isHome && <div className={styles.white}></div>}
    </motion.div>
	)
}