'use client';

import s from './PageTransition.module.scss';
import cn from 'classnames';
import { useStore, useShallow } from '@/lib/store';
import { use, useEffect, useRef } from 'react';
import { detect } from 'detect-browser';
import { usePathname } from 'next/navigation';
import { usePrevious } from '@/lib/hooks/usePrevious';

declare module 'react' {
	interface CSSProperties {
		[key: `--${string}`]: string | number;
	}
}

export const duration = 700;

export default function PageTransition() {
	const backgroundColor = useStore(useShallow((state) => state.backgroundColor));
	const backgroundImage = useStore(useShallow((state) => state.backgroundImage));
	const setBackgroundImage = useStore(useShallow((state) => state.setBackgroundImage));
	const transition = useStore(useShallow((state) => state.transition));
	const setTransition = useStore(useShallow((state) => state.setTransition));
	const pathname = usePathname();
	const prevPathname = usePrevious(pathname);
	const isHome = pathname === '/';
	const colorRef = useRef<HTMLDivElement | null>(null);
	const logoRef = useRef<HTMLDivElement | null>(null);
	const whiteBackgroundRef = useRef<HTMLDivElement | null>(null);
	const color = backgroundColor ? `rgb(${backgroundColor.join(',')})` : null;

	useEffect(() => {
		// Safari bug, Text clip mask supported from v. 15.5
		const device = detect();
		if (!device) return;

		if (device.name === 'safari' && parseInt(device.version.replace(/\./g, '')) < 1550)
			logoRef.current?.classList.add(s.nomask);
	}, []);

	useEffect(() => {
		color && colorRef.current?.style.setProperty('background-color', color);
		!isHome && logoRef.current?.classList.add(s.hide);
		backgroundImage && logoRef.current?.style.setProperty('background', `url(${backgroundImage.url}?w=1400)`);
		whiteBackgroundRef.current?.classList.toggle(s.hide, !(isHome && transition && !prevPathname));
	}, [isHome, backgroundImage, color, transition]);

	function handleIntroStart() {
		setTimeout(
			() => {
				setBackgroundImage(null);
				logoRef.current?.classList.add(s.hide);
			},
			duration / 2 + 300
		);
	}

	const handleAnimationEvent = async (type: 'start' | 'end') => {
		if (type === 'start' && isHome && !prevPathname) handleIntroStart();
		else if (type === 'end') {
			window.scrollTo({ top: 0, behavior: 'instant' }); // Scroll top efter exit animation
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
		<div
			key={'page-transition'}
			className={s.pageTransition}
			onAnimationStart={() => handleAnimationEvent('start')}
			onAnimationEnd={() => handleAnimationEvent('end')}
		>
			<div
				id='color'
				key={'color'}
				className={cn(s.color, s.animation, animation)}
				style={{ '--duration': `${duration}ms` }}
				ref={colorRef}
			>
				<div id='logo-background' key='logo-background' className={s.logo} ref={logoRef}>
					<h1>SASKIA NEUMAN GALLERY</h1>
				</div>
			</div>
			{/*<div id='white-background' className={s.white} ref={whiteBackgroundRef} /> */}
		</div>
	);
}
