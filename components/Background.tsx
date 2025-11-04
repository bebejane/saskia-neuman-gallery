'use client';

import s from './Background.module.scss';
import cn from 'classnames';
import { useStore, useShallow } from '@/lib/store';
import { useEffect } from 'react';
//import { motion } from 'framer-motion';
import Link from 'next/link';

export type BackgroundProps = {
	image?: FileField | null;
	color: number[];
	href?: string;
	fullHeight?: boolean;
};

export default function Background({ image, color, href, fullHeight }: BackgroundProps) {
	const [setBackgroundImage, setBackgroundColor, setIsRouting, backgroundImage, showMenu] = useStore(
		useShallow((s) => [s.setBackgroundImage, s.setBackgroundColor, s.setIsRouting, s.backgroundImage, s.showMenu])
	);

	/*
	useEffect(() => {
		setBackgroundImage(null);
		setBackgroundColor(color);

		const routeChangeStart = (url) => setIsRouting(true);
		const routeChangeComplete = (url) => setTimeout(() => setIsRouting(false), 1000);

		Router.events.on('routeChangeStart', routeChangeStart);
		Router.events.on('routeChangeComplete', routeChangeComplete);

		return () => {
			Router.events.off('routeChangeStart', routeChangeStart);
			Router.events.off('routeChangeComplete', routeChangeComplete);
		};
	}, []);
*/

	if (!image) return null;

	return (
		<>
			<div className={cn(s.container, !showMenu && s.hiddenMenu)}>
				<img className={cn(s.backgroundImage, !fullHeight && s.halfHeight)} src={`${image.url}?fmt=jpg&w=1400`} />
				{href && <Link href={href} className={s.link}></Link>}
			</div>
			{backgroundImage && (
				<div className={s.hoverContainer} key={backgroundImage.id}>
					<div
						//initial={{ opacity: 0 }}
						//animate={{ opacity: 1, transition: { duration: 0.35 } }}
						className={s.hoverImage}
					>
						<img src={`${image.url}?fmt=jpg&w=1400`} className={s.image} />
					</div>
				</div>
			)}
		</>
	);
}
