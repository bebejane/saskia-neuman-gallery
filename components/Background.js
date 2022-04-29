import styles from './Background.module.scss'
import useStore from "/store";
import { Image } from "react-datocms"
import cn from "classnames"
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Background({image, color, title, brightness}){
  
	const setBackgroundImage = useStore((state) => state.setBackgroundImage);
	const setBackgroundColor = useStore((state) => state.setBackgroundColor);
	const backgroundImage = useStore((state) => state.backgroundImage);
	const router = useRouter()
	const isHome = router.asPath === '/';
	
	useEffect(()=>{ 
		setBackgroundImage(image); 
		setBackgroundColor(color)
	}, [router.asPath])
	
	if(!backgroundImage) return null

	return (
		<div className={cn(styles.container, isHome && styles.sticky)}>
			<Image 
				className={styles.backgroundImage} 
				lazyLoad={false}
				data={backgroundImage?.responsiveImage}
			/>
		</div>
	)
}