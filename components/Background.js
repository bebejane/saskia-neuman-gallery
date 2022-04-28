import styles from './Background.module.scss'
import useStore from "/store";
import { Image } from "react-datocms"
import cn from "classnames"
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Background({title, brightness}){
  
	const backgroundColor = useStore((state) => state.backgroundColor);
	const backgroundImage = useStore((state) => state.backgroundImage);
	
	if(!backgroundImage) return null
	
	const router = useRouter()
	const isHome = router.asPath === '/';

	useEffect(()=>{
		return
		const originalColor = document.body.style.backgroundColor;
		document.body.style.backgroundColor = `rgb(${backgroundColor?.join(',')})`
		return () => document.body.style.backgroundColor = originalColor;
	},[])

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