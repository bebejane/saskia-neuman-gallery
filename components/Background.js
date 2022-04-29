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
					lazyLoad={false}
					data={image?.responsiveImage}
				/>
			</div>	
			
			<AnimatePresence
				//exitBeforeEnter
				//initial={true}	
			>
				{backgroundImage &&
					<div className={styles.hoverContainer} key={backgroundImage.id}>
						<motion.div 
							initial={{opacity:0}}
							animate={{opacity:1, transition:{duration:0.5}}}
							//exit={{opacity:0.5, transition:{duration:0.2}}}
							className={styles.hoverImage}
						>
							<Image 
								className={styles.image} 
								lazyLoad={true}
								usePlaceholder={false}
								data={backgroundImage?.responsiveImage}
							/>
						</motion.div>
					</div>
				}
			</AnimatePresence>
		</>
	)
}