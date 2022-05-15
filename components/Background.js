import styles from './Background.module.scss'
import cn from "classnames"
import useStore from "/store";
import { Image } from "react-datocms"
import { useEffect } from 'react';
import {  motion } from 'framer-motion'
import Router, { useRouter } from 'next/router';

export default function Background({image, color, title, brightness}){

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
				<Image 
					className={styles.backgroundImage} 
					layout="responsive"
					objectFit="cover"
					objectPosition="50% 50%"
					fadeInDuration={0}
					usePlaceholder={true}
					lazyLoad={true}
					data={image?.responsiveImage}
				/>
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