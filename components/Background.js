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
	
	
	useEffect(()=>{  
		setBackgroundImage(null)
		setBackgroundColor(color)
	}, [router.asPath])	
	
	return (
		<>
			<div className={cn(styles.container)}>
				<Image 
					className={styles.backgroundImage} 
					lazyLoad={false}
					data={image?.responsiveImage}
				/>
			</div>	
			<div className={cn(styles.hoverImage, !backgroundImage && styles.hide)}>
				{backgroundImage && <Image 
					className={styles.image} 
					lazyLoad={false}
					data={backgroundImage?.responsiveImage}
				/>}
			</div>	
		</>
	)
}