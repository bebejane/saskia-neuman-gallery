import styles from './Background.module.scss'
import cn from "classnames"
import useStore from "/store";
import { Image } from "react-datocms"
import { useEffect } from 'react';

export default function Background({image, color, title, brightness}){
  
	const setBackgroundImage = useStore((state) => state.setBackgroundImage);
	const setBackgroundColor = useStore((state) => state.setBackgroundColor);
	const backgroundImage = useStore((state) => state.backgroundImage);

	useEffect(()=>{  
		setBackgroundImage(null)
		setBackgroundColor(color)
	}, [])	
	
	if(!image) return null
	
	return (
		<>			
			<div className={cn(styles.container)}>
				<Image 
					className={styles.backgroundImage} 
					lazyLoad={false}
					data={image?.responsiveImage}
				/>
			</div>	
			{backgroundImage &&
				<div className={cn(styles.hoverImage)}>
					<Image 
						className={styles.image} 
						lazyLoad={true}
						usePlaceholder={false}
						data={backgroundImage?.responsiveImage}
					/>
				</div>
			}
		</>
	)
}