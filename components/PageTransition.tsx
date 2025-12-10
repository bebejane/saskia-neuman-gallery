'use client';

import s from './PageTransition.module.scss';
import cn from 'classnames';
import { useStore, useShallow } from '@/lib/store';
import { useEffect, useRef } from 'react';
import { detect } from 'detect-browser';
import { usePrevious } from '@/lib/hooks/usePrevious';
import usePreviousRoute from '@/lib/hooks/usePreviousRoute';

export const duration = 800;

declare module 'react' {
	interface CSSProperties {
		[key: `--${string}`]: string | number;
	}
}

type PageTransitionProps = {
	defaultColor?: number[];
	defaultImage?: FileField;
	isHome: boolean;
};

export default function PageTransition({
	defaultColor,
	defaultImage,
	isHome,
}: PageTransitionProps) {
	const backgroundColor = useStore(useShallow((state) => state.backgroundColor));
	const backgroundImage = useStore(useShallow((state) => state.backgroundImage));
	const transition = useStore(useShallow((state) => state.transition));
	const setTransition = useStore(useShallow((state) => state.setTransition));
	const prevPathname = usePreviousRoute();
	const prevColor = usePrevious(backgroundColor);
	const colorRef = useRef<HTMLDivElement | null>(null);
	const logoRef = useRef<HTMLDivElement | null>(null);
	const color = `rgb(${(backgroundColor ?? prevColor ?? defaultColor)?.join(',')})`;

	useEffect(() => {
		const device = detect();
		if (!device) return;
		// Safari bug, Text clip mask supported from v. 15.5
		if (device.name === 'safari' && parseInt(device.version.replace(/\./g, '')) < 1550)
			logoRef.current?.classList.add(s.nomask);
	}, []);

	useEffect(() => {
		color && colorRef.current?.style.setProperty('background-color', color);
		(backgroundImage || defaultImage) &&
			logoRef.current?.style.setProperty(
				'background',
				`url(${(backgroundImage ?? defaultImage)?.url}?w=1400)`
			);
	}, [isHome, transition, color, defaultImage, backgroundImage]);

	function handleIntroStart() {
		setTimeout(
			() => {
				logoRef.current?.classList.remove(s.show);
			},
			duration / 2 + 300
		);
	}

	const handleAnimationEvent = async (type: 'start' | 'end') => {
		if (type === 'start' && isHome && !prevPathname) handleIntroStart();
		else if (type === 'end') {
			window.scrollTo({ top: 0, behavior: 'instant' });
			transition === 'exit' && setTransition('enter');
			transition === 'enter' && setTransition(null);
		}
	};

	function generateAnimation() {
		if (!transition && !isHome && !prevPathname) return cn(s.instant);
		if (!transition && isHome && !prevPathname) return cn(s.intro);
		if (transition === 'enter') return s.enter;
		if (transition === 'exit') return s.exit;
		return s.blank;
	}

	const animation = generateAnimation();

	return (
		<>
			<div
				key={'page-transition'}
				className={s.pageTransition}
				onAnimationStart={() => handleAnimationEvent('start')}
				onAnimationEnd={() => handleAnimationEvent('end')}
			>
				<div
					id='color'
					key={'color'}
					ref={colorRef}
					className={cn(s.color, s.animation, animation)}
					style={{ '--duration': `${duration}ms`, 'backgroundColor': color }}
				>
					<div
						id='logo-background'
						key='logo-background'
						ref={logoRef}
						className={cn(s.logo, isHome && !prevPathname && s.show)}
						style={{
							background: `url(${(backgroundImage ?? defaultImage)?.url}?w=1400)`,
						}}
					>
						<h1>SASKIA NEUMAN GALLERY</h1>
					</div>
				</div>
			</div>
		</>
	);
}
