import styles from './PageTransition.module.scss'
import useStore from "/store";
import cn from "classnames"
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import usePreviousRoute from '/lib/hooks/usePreviousRoute';
import { useEffect, useState } from 'react';
import { detect } from 'detect-browser';

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
	enterInstant: {
		transition:{ duration:0 },
		top:'0%',
		height:'0vh'
	},
	exit: {
		height: ['0vh', '100vh'],
		top:['0%', '0%'],
		transitionEnd :{
			top:'0%',
			height:'100vh'
		},
		transition:{ duration, ease:'easeOut' }
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
	
	const router = useRouter()
	const prevRoute = usePreviousRoute()

	const isHome = router.pathname === '/';
	const [showLogo, setShowLogo] = useState(isHome)
	const [textMaskSupported, setTextMaskSupported] = useState(true)
	const color = `rgb(${backgroundColor?.join(',')})`;
	
	useEffect(()=>{ // Safari bug, Text clip mask supported from v. 15.5
		const device = detect();
		if(device.name === 'safari' && parseInt(device.version.replace(/\./g, '')) < 1550)
			setTextMaskSupported(false)
	}, [setTextMaskSupported])

	const handleAnimationEvent = async (type, variant) => {
		
		const isComplete = ['home', 'homeIntro', 'enter'].includes(variant) && type === 'complete'
		const isExiting = variant.startsWith('exit') && type === 'start'
		const didExit = variant.startsWith('exit') && type === 'complete'
		
		if(didExit) 
			window.scrollTo({ top: 0, behavior:'instant' }) // Scroll top efter exit animation	
		
		setIsTransitioning(!isComplete)
		setIsExiting(isExiting)
		
	}

	const handleAnimationUpdate = ({height, top}) => { // Hide logo mid transition 
		if(parseInt(top) > 0 && parseInt(height) <= 50 && showLogo){
			setShowLogo(false)
		}
	}
	
	const enterAnimation = isHome ? !prevRoute ? "homeIntro" : "home" : prevRoute ? "enter" : "enterInstant"
	const exitAnimation = isHome ? "exitInstant" : "exit" 
	
	return (
    <motion.div
			className={styles.pageTransition} 
			initial="initial" 
      animate={enterAnimation}
      exit={exitAnimation}
      variants={pageTransition} 
      onAnimationComplete={ (variant) => handleAnimationEvent('complete', variant)}
      onAnimationStart={(variant) => handleAnimationEvent('start', variant)}
			onUpdate={handleAnimationUpdate}
    >	
      <div className={styles.color} style={{backgroundColor: color}}>
        <div 
					className={cn(styles.logo, !showLogo && styles.hideLogo, !textMaskSupported && styles.nomask)}
					style={{background:`url(${image?.url}?w=1400)`}}
				>
          <h1>SASKIA NEUMAN GALLERY</h1>
        </div>
      </div>
			{isHome && <div className={styles.white}></div>}
    </motion.div>
	)
}