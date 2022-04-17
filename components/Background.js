import styles from './Background.module.scss'
import { Image } from "react-datocms"
import cn from "classnames"
import { useEffect, useState } from 'react';

export default function Background({image, color, pathname}){
  if(!image) return null;
	
	const [animating, setAnimating] = useState(true)
	const backgroundColor = `rgb(${color.join(',')})`;

	useEffect(()=>{
		const originalColor = document.body.style.backgroundColor;
		document.body.style.backgroundColor = color;
		return () => document.body.style.backgroundColor = originalColor;
	},[])
	
	return (
		<div className={styles.container}>
			<Image lazyLoad={false} className={styles.backgroundImage} data={image.responsiveImage}/>
			{animating && 
				<div className={cn(styles.color, styles.upper)} style={{backgroundColor}} onAnimationEnd={()=>setAnimating(false)}>
					<div className={cn(styles.logo)} style={{background:`url(${image.url}?w=1440)`}}><h1>SASKIA NEUMAN GALLERY</h1></div>
				</div>
			}
			<div className={cn(styles.color, styles.lower)}></div>
		</div>
	)
}