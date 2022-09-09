import styles from './Background.module.scss'
import cn from "classnames"
import useStore from "/lib/store";
import { Image } from "react-datocms"
import { useEffect } from 'react';
import { motion } from 'framer-motion'
import Link from 'next/link';
import Router from 'next/router';

export default function Background({image, color, href, fullHeight}){

	const setBackgroundImage = useStore((state) => state.setBackgroundImage);
	const setBackgroundColor = useStore((state) => state.setBackgroundColor);
	const setIsRouting = useStore((state) => state.setIsRouting);
	const backgroundImage = useStore((state) => state.backgroundImage);
	const showMenu = useStore((state) => state.showMenu);

	useEffect(()=>{
		setBackgroundImage(null)
		setBackgroundColor(color)

		const routeChangeStart = (url) => setIsRouting(true)
		const routeChangeComplete = (url) => setTimeout(()=>setIsRouting(false), 1000)	

		Router.events.on('routeChangeStart', routeChangeStart)
		Router.events.on('routeChangeComplete', routeChangeComplete)

		return () => {
			Router.events.off('routeChangeStart', routeChangeStart)
			Router.events.off('routeChangeComplete', routeChangeComplete)
		}
	}, [])	

	if(!image) return null
	
	return (
		<>			
			<div className={cn(styles.container, !showMenu && styles.hiddenMenu)}>
					<img className={cn(styles.backgroundImage, fullHeight && styles.fullHeight)} src={`${image.url}?fmt=jpg&w=1400`}/>
				{href && <Link href={href}><a className={styles.link}></a></Link>}
			</div>	
			{backgroundImage && 
				<div className={styles.hoverContainer} key={backgroundImage.id}>
					<motion.div 
						initial={{opacity:0}}
						animate={{opacity:1, transition:{duration:0.35}}}
						className={styles.hoverImage}
					>
						<img 
							src={`${backgroundImage.url}?fmt=jpg&w=1400`} 
							className={styles.image} 
						/>
					</motion.div>
				</div>
			}
		</>
	)
}