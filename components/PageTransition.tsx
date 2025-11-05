'use client';

import s from './PageTransition.module.scss';
import { useStore, useShallow } from '@/lib/store';
import cn from 'classnames';
import usePreviousRoute from '@/lib/hooks/usePreviousRoute';
import { AnimationEventHandler, useEffect, useState } from 'react';
import { detect } from 'detect-browser';
import { usePathname } from 'next/navigation';
import { useRouteChangeStart } from '@/lib/hooks/useRouteChangeStart';

export const duration = 600;
export type PageTransitionProps = {
	image: FileField;
};

export default function PageTransition({ image }: PageTransitionProps) {
	return null;
	const [backgroundColor, transition, setTransition] = useStore(
		useShallow((state) => [state.backgroundColor, state.transition, state.setTransition])
	);

	const pathname = usePathname();
	const prevRoute = usePreviousRoute();
	const isHome = pathname === '/';
	const [showLogo, setShowLogo] = useState(isHome);
	const [textMaskSupported, setTextMaskSupported] = useState(true);
	const color = `rgb(${backgroundColor?.join(',')})`;

	useEffect(() => {
		// Safari bug, Text clip mask supported from v. 15.5
		const device = detect();
		if (!device) return;

		if (device.name === 'safari' && parseInt(device.version.replace(/\./g, '')) < 1550) setTextMaskSupported(false);
	}, [setTextMaskSupported]);

	useRouteChangeStart(() => setTransition('exit'));

	const handleAnimationEvent = async (type: 'start' | 'end') => {
		if (type === 'start') {
			setTimeout(() => setShowLogo(false), duration / 2);
		} else if (type === 'end') {
			window.scrollTo({ top: 0, behavior: 'instant' }); // Scroll top efter exit animation
			transition && setTransition(null);
		}
		//const isComplete = ['home', 'home.intro', 'enter'].includes(variant) && type === 'end';
		//const isStarting = type === 'start';ty
		//const isExiting = variant.startsWith('exit') && type === 'start';
		//const didExit = variant.startsWith('exit') && type === 'end';
		//setTransition(isComplete ? null : isExiting ? 'exit' : 'enter');
		//if (isStarting) setTimeout(() => setShowLogo(false), duration / 2);
		//if (didExit) window.scrollTo({ top: 0, behavior: 'instant' }); // Scroll top efter exit animation
	};

	//const enter = isHome ? (!prevRoute ? cn(s.home, s.intro) : s.home) : prevRoute ? s.enter : cn(s.enter, s.instant);
	//const exit = isHome ? cn(s.exit, s.instant) : s.exit;
	const animation = cn(!transition ? cn(s.enter, s.instant) : transition === 'enter' ? s.enter : s.exit);

	console.log(transition, animation);
	return (
		<div
			key={pathname}
			className={cn(s.pageTransition, animation)}
			onAnimationStart={() => handleAnimationEvent('start')}
			onAnimationEnd={() => handleAnimationEvent('end')}
		>
			<div className={s.color} style={{ backgroundColor: color }}>
				<div
					className={cn(s.logo, !showLogo && s.hideLogo, !textMaskSupported && s.nomask)}
					style={{ background: `url(${image?.url}?w=1400)` }}
				>
					<h1>SASKIA NEUMAN GALLERY</h1>
				</div>
			</div>
			{isHome && <div className={s.white}></div>}
		</div>
	);
}
