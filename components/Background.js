import styles from './Background.module.scss'
import cn from "classnames"
import useStore from "/store";
import { Image } from "react-datocms"
import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion'

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
					layout="responsive"
					objectFit="contain"
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
						<img src={`${backgroundImage.url}?fmt=jpg&w=1000`} className={styles.image} />
						{ /* Not working Safari
							<Image 
							className={styles.image} 
							layout="responsive"
							objectFit="contain"
							objectPosition="50% 50%"
							fadeInDuration={0}
							usePlaceholder={true}
							lazyLoad={false}	
							data={backgroundImage?.responsiveImage}
						/>*/}
					</motion.div>
				</div>
			}
		</>
	)
}