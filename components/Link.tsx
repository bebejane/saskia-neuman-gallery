'use client';

import { default as NextLink, LinkProps } from 'next/link';
import React, { HTMLProps, FC } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useStore, useShallow } from '@/lib/store';
import { sleep } from 'next-dato-utils/utils';
import { duration } from '@/components/PageTransition';

export type LinkProperties = LinkProps &
	Omit<HTMLProps<HTMLAnchorElement>, 'color'> & {
		selected?: boolean;
		color?: number[];
		image?: FileField | null;
	};

const Link: FC<LinkProperties> = ({
	id,
	href,
	color,
	image,
	children,
	scroll,
	className,
	target,
	style = {},
	selected,
	onMouseEnter,
	onMouseLeave,
}) => {
	const router = useRouter();
	const pathname = usePathname();
	const [hover, setHover] = useState(false);
	const [setBackgroundColor, setIsExiting, setTransition, transition] = useStore(
		useShallow((state) => [state.setBackgroundColor, state.setIsExiting, state.setTransition, state.transition])
	);
	const linkRef = useRef<HTMLAnchorElement | null>(null);
	//@ts-ignore
	const isWhite = color?.reduce((prev, curr) => parseInt(prev) + parseInt(curr), 0) >= 255 * 3 * 0.97;
	const linkStyle =
		color && (hover || selected)
			? { color: isWhite ? 'rgb(0,0,0)' : `rgb(${color.join(',')})`, textShadow: '0 0 5px #fff05' }
			: {};

	async function handleClick(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
		if (pathname === href) return;
		e.preventDefault();
		e.stopPropagation();
		color && setBackgroundColor(color);
		setTransition('exit');
		await sleep(duration);
		router.push(href);
		setTransition('enter');
	}

	function handleMouse(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
		if (e.type === 'mouseleave') {
			setHover(false);
			onMouseLeave && onMouseLeave(e);
		} else if (e.type === 'mouseenter') {
			setHover(true);
			onMouseEnter && onMouseEnter(e);
		}
	}

	useEffect(() => {
		if (!image) return;
		const img = new Image();
		img.src = `${image.url}?fmt=jpg&w=1400`; // Preload image
	}, []);

	return (
		<NextLink
			href={href}
			scroll={scroll !== undefined ? scroll : false}
			id={id}
			ref={linkRef}
			style={{ ...linkStyle, ...style }}
			target={target}
			onMouseEnter={handleMouse}
			onMouseLeave={handleMouse}
			onClick={handleClick}
			suppressHydrationWarning={true}
			className={className}
		>
			{children}
		</NextLink>
	);
};

export default Link;
