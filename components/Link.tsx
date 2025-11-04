'use client';

import { default as NextLink, LinkProps } from 'next/link';
import React, { HTMLProps, FC } from 'react';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useStore, useShallow } from '@/lib/store';
//@ts-expect-error
import Tappable from 'react-tapper';

export type LinkProperties = LinkProps &
	HTMLProps<HTMLAnchorElement> & {
		isSelected?: boolean;
		color: number[];
		image: FileField | null;
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
	isSelected,
	onMouseEnter,
	onMouseLeave,
}) => {
	const router = useRouter();
	const [hover, setHover] = useState(false);
	const setBackgroundColor = useStore((state) => state.setBackgroundColor);
	const linkRef = useRef<HTMLAnchorElement | null>(null);
	//@ts-ignore
	const isWhite = color?.reduce((prev, curr) => parseInt(prev) + parseInt(curr), 0) >= 255 * 3 * 0.97;

	const linkStyle =
		color && (hover || isSelected)
			? { color: isWhite ? 'rgb(0,0,0)' : `rgb(${color.join(',')})`, textShadow: '0 0 5px #fff05' }
			: {};

	const handleMouse = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
		if (e.type === 'mouseleave') {
			setHover(false);
			onMouseLeave && onMouseLeave(e);
		} else if (e.type === 'mouseenter') {
			setHover(true);
			onMouseEnter && onMouseEnter(e);
		}
	};

	const handleTouchEnd = (e: any) => {
		if (e.type === 'click') return;
		setBackgroundColor(color);
		router.push(href);
	};

	useEffect(() => {
		if (!image) return;
		const img = new Image();
		img.src = `${image.url}?fmt=jpg&w=1400`; // Preload image
	}, []);

	useEffect(() => {
		hover && setBackgroundColor(color);
	}, [hover, color]);

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
			suppressHydrationWarning={true}
		>
			<Tappable onTap={handleTouchEnd} className={className}>
				{children}
			</Tappable>
		</NextLink>
	);
};

export default Link;
