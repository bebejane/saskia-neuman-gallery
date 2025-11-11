'use client';

import s from './PageTransition.module.scss';
import cn from 'classnames';
import { useStore, useShallow } from '@/lib/store';
import { use, useEffect, useState } from 'react';
import { detect } from 'detect-browser';
import { usePathname } from 'next/navigation';

export const duration = 1000;

export type PageTransitionProps = {
	//image: FileField;
};

export default function PageTransition({}: PageTransitionProps) {
	const backgroundColor = useStore(useShallow((state) => state.backgroundColor));
	const backgroundImage = useStore(useShallow((state) => state.backgroundImage));
	const transition = useStore(useShallow((state) => state.transition));
	const setTransition = useStore(useShallow((state) => state.setTransition));
	const pathname = usePathname();
	//const prevRoute = usePreviousRoute();
	const isHome = pathname === '/';
	const [showLogo, setShowLogo] = useState(isHome);
	const [textMaskSupported, setTextMaskSupported] = useState(true);

	useEffect(() => {
		// Safari bug, Text clip mask supported from v. 15.5
		const device = detect();
		if (!device) return;

		//if (device.name === 'safari' && parseInt(device.version.replace(/\./g, '')) < 1550) setTextMaskSupported(false);
	}, [setTextMaskSupported]);

	useEffect(() => {
		const color = backgroundColor ? `rgb(${backgroundColor.join(',')})` : undefined;
		color && document.getElementById('color')?.style.setProperty('background-color', color);
	}, [backgroundColor]);

	/*
	useRouteChangeStart(() => {
		console.log('start');
		//transition && setTransition('enter');
	});

	useRouteChangeEnd(() => {
		console.log('end');
		//transition && setTransition('exit');
	});
*/

	const handleAnimationEvent = async (type: 'start' | 'end') => {
		if (type === 'start') {
			//setTimeout(() => setShowLogo(false), duration / 2);
		} else if (type === 'end') {
			window.scrollTo({ top: 0, behavior: 'instant' }); // Scroll top efter exit animation
			transition === 'enter' && console.log('set trans null');
			transition === 'enter' && setTransition(null);
		}
		//const isComplete = ['home', 'home.intro', 'enter'].includes(variant) && type === 'end';
		//const isStarting = type === 'start';ty
		//const isExiting = variant.startsWith('exit') && type === 'start';
		//const didExit = variant.startsWith('exit') && type === 'end';
		//setTransition(isComplete ? null : isExiting ? 'exit' : 'enter');
		//if (isStarting) setTimeout(() => setShowLogo(false), duration / 2);
		//if (didExit) window.scrollTo({ top: 0, behavior: 'instant' }); // Scroll top efter exit animation
	};

	function generateAnimation() {
		if (!transition && isHome) return cn(s.intro);
		if (!transition && !isHome) return cn(s.enter, s.instant);
		if (transition === 'enter') return s.enter;
		if (transition === 'exit') return s.exit;
		return undefined;
	}

	const duration = 1000;
	const animation = generateAnimation();

	// /
	//if (!backgroundColor) return null;
	//console.log(backgroundColor, backgroundImage, transition, setTransition);
	console.log(animation);
	return (
		<div
			//key={pathname}
			className={s.pageTransition}
			onAnimationStart={() => handleAnimationEvent('start')}
			onAnimationEnd={() => handleAnimationEvent('end')}
		>
			<div
				id='color'
				className={cn(s.color, s.animation, animation)}
				key={pathname}
				style={{
					//@ts-ignore
					'--duration': `${duration}ms`,
				}}
			>
				<div
					className={cn(s.logo, !showLogo && s.hide, !textMaskSupported && s.nomask)}
					style={{ background: `url(${backgroundImage?.url}?w=1400)` }}
				>
					<h1>SASKIA NEUMAN GALLERY</h1>
				</div>
			</div>
			{isHome && transition && <div className={s.white}></div>}
		</div>
	);
}
