import styles from './Background.module.scss';
import cn from 'classnames';
import useStore from '/lib/store';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Router from 'next/router';

interface BackgroundProps {
	image?: { url: string };
	color?: string;
	href?: string;
	fullHeight?: boolean;
}

interface BackgroundStore {
	backgroundImage: { url: string; id: string } | null;
	showMenu: boolean;
	setBackgroundImage: (image: { url: string } | null) => void;
	setBackgroundColor: (color: string) => void;
	setIsRouting: (isRouting: boolean) => void;
}

export default function Background({ image, color, href, fullHeight }: BackgroundProps) {
	const setBackgroundImage = useStore((state: BackgroundStore) => state.setBackgroundImage);
	const setBackgroundColor = useStore((state: BackgroundStore) => state.setBackgroundColor);
	const setIsRouting = useStore((state: BackgroundStore) => state.setIsRouting);
	const backgroundImage = useStore((state: BackgroundStore) => state.backgroundImage);
	const showMenu = useStore((state: BackgroundStore) => state.showMenu);

	useEffect(() => {
		setBackgroundImage(null);
		setBackgroundColor(color || '');

		const routeChangeStart = (url: string) => setIsRouting(true);
		const routeChangeComplete = (url: string) => setTimeout(() => setIsRouting(false), 1000);

		Router.events.on('routeChangeStart', routeChangeStart);
		Router.events.on('routeChangeComplete', routeChangeComplete);

		return () => {
			Router.events.off('routeChangeStart', routeChangeStart);
			Router.events.off('routeChangeComplete', routeChangeComplete);
		};
	}, [color, setBackgroundColor, setBackgroundImage, setIsRouting]);

	if (!image) return null;

	return (
		<>
			<div className={cn(styles.container, !showMenu && styles.hiddenMenu)}>
				<img
					className={cn(styles.backgroundImage, !fullHeight && styles.halfHeight)}
					src={`${image.url}?fmt=jpg&w=1400`}
					alt='Background'
				/>
				{href && <Link href={href} className={styles.link}></Link>}
			</div>
			{backgroundImage && (
				<div className={styles.hoverContainer} key={backgroundImage.id}>
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1, transition: { duration: 0.35 } }}
						className={styles.hoverImage}
					>
						<img
							src={`${backgroundImage.url}?fmt=jpg&w=1400`}
							className={styles.image}
							alt='Hover background'
						/>
					</motion.div>
				</div>
			)}
		</>
	);
}
