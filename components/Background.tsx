'use client';

import s from './Background.module.scss';
import cn from 'classnames';
import { useStore, useShallow } from '@/lib/store';
import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export type BackgroundProps = {
	image?: FileField | null;
	color: number[];
	href?: string;
	fullHeight?: boolean;
};

export default function Background({ image, color, href, fullHeight }: BackgroundProps) {
	const pathname = usePathname();
	const [setBackgroundColor, setIsRouting, backgroundImage, showMenu, setTheme] = useStore(
		useShallow((s) => [s.setBackgroundColor, s.setIsRouting, s.backgroundImage, s.showMenu, s.setTheme])
	);

	useEffect(() => {
		const originalColor = document.body.style.backgroundColor;
		document.body.style.backgroundColor = `rgb(${color.join(',')})`;

		const t = image?.customData?.theme || 'light';
		setTheme({ original: t, current: t });

		return () => {
			document.body.style.backgroundColor = originalColor;
		};
	}, [image]);

	useEffect(() => {
		const routeChangeStart = () => setIsRouting(true);
		const routeChangeComplete = () => setTimeout(() => setIsRouting(false), 1000);
		//setBackgroundImage(null);
		setBackgroundColor(color);
		routeChangeComplete();

		return () => {
			routeChangeStart();
		};
	}, [pathname]);

	if (!image) return null;

	return (
		<>
			<div className={cn(s.container, !showMenu && s.hiddenMenu)}>
				<img className={cn(s.backgroundImage, !fullHeight && s.halfHeight)} src={`${image.url}?fmt=jpg&w=1400`} />
				{href && <Link href={href} className={s.link}></Link>}
			</div>
			{backgroundImage && (
				<div className={s.hoverContainer} key={backgroundImage.id}>
					<div className={s.hoverImage}>
						<img src={`${backgroundImage.url}?fmt=jpg&w=1400`} className={s.image} />
					</div>
				</div>
			)}
		</>
	);
}
