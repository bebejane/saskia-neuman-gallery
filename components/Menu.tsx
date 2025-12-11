'use client';

import s from './Menu.module.scss';
import Link from '@/components/Link';
import cn from 'classnames';
import React from 'react';
import { useStore, useShallow } from '@/lib/store';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useWindowSize } from 'usehooks-ts';
import { useScrollInfo } from 'next-dato-utils/hooks';
import { findtMenuItem, MenuItem, MenuItemSub } from '@/lib/menu';
import { useRouteChangeStart } from '@/lib/hooks/useRouteChange';
import { Markdown } from 'next-dato-utils/components';

export default function Menu({ menu }: { menu: MenuItem[] }) {
	const [
		theme,
		setTheme,
		setBackgroundImage,
		setIsHoveringMenuItem,
		isHoveringMenuItem,
		setShowMenu,
		showMenu,
		isExiting,
		isTransitioning,
		transition,
	] = useStore(
		useShallow((s) => [
			s.theme,
			s.setTheme,
			s.setBackgroundImage,
			s.setIsHoveringMenuItem,
			s.isHoveringMenuItem,
			s.setShowMenu,
			s.showMenu,
			s.isExiting,
			s.isTransitioning,
			s.transition,
		])
	);

	const pathname = usePathname();
	const [hoverSubMenu, setHoverSubMenu] = useState<MenuItem | null>(null);
	const [subMenu, setSubMenu] = useState<MenuItem | null>(null);
	const [menuBackground, setMenuBackground] = useState(false);
	const [subMenuStyles, setSubMenuStyles] = useState<React.CSSProperties | undefined>(undefined);
	const [separatorMargin, setSeparatorMargin] = useState(0);
	const [showMore, setShowMore] = useState({ ExhibitionRecord: false, HappeningRecord: false });
	const { isPageBottom, isScrolledUp, scrolledPosition, isPageTop } = useScrollInfo();
	const { width, height } = useWindowSize();
	const isMobile = width <= 768;
	const selected = findtMenuItem(menu, pathname);

	const handleMouseOver = (item: MenuItem | MenuItemSub, hovering: boolean) => {
		setTimeout(
			() => {
				setIsHoveringMenuItem(hovering);
				setBackgroundImage(hovering ? item.image : null);
			},
			isTransitioning ? 1000 : 0
		);
	};

	useEffect(() => {
		// Toggle menu bar on scroll
		setShowMenu((isScrolledUp && !isPageBottom) || isPageTop);
	}, [scrolledPosition, isPageBottom, isPageTop, isScrolledUp]);

	useRouteChangeStart(() => {
		setIsHoveringMenuItem(false);
		setSubMenu(null);
	});

	useEffect(() => {
		setIsHoveringMenuItem(false);
		setSubMenu(null);
	}, [pathname]);

	useEffect(() => {
		if (!subMenu) return;

		const subMenuEl = document.getElementById(`menu-${subMenu.__typename}`) as HTMLDivElement;
		const menuWrapper = document.getElementById('menu-wrapper');
		const main = document.getElementById('main');

		if (!subMenuEl || !menu || !menuWrapper || !main) return;

		const parent = subMenuEl.offsetParent as HTMLDivElement;
		const paddingLeft = getComputedStyle(menuWrapper, null).getPropertyValue('padding-left');
		const menuWrapperPaddingLeft = getComputedStyle(menuWrapper, null).getPropertyValue(
			'padding-left'
		);
		const mainPaddingLeft = getComputedStyle(main, null).getPropertyValue('padding-left');
		const separatorMargin = parent?.offsetLeft + subMenuEl.offsetLeft - parseInt(paddingLeft);
		const maxWidth =
			main.clientWidth -
			separatorMargin -
			parseInt(menuWrapperPaddingLeft) -
			parseInt(mainPaddingLeft);

		setSubMenuStyles({ marginLeft: `${subMenuEl.offsetLeft}px`, maxWidth: `${maxWidth}px` });
		setSeparatorMargin(separatorMargin);
	}, [subMenu, width, height]);

	useEffect(() => {
		// Toggle dark/light logo on scroll after fold
		const logo = document.getElementById('logo');
		const main = document.getElementById('main');
		const menu = document.getElementById('menu');

		if (!main || !logo || !menu || transition) return setMenuBackground(false);

		const logoStyle = getComputedStyle(logo, null);
		const logoHeight =
			parseInt(logoStyle.getPropertyValue('height')) -
			parseInt(logoStyle.getPropertyValue('padding-top'));
		const threshold = main.offsetTop - logoHeight * 2;

		if (scrolledPosition > threshold) setTheme({ current: 'light' });
		else if (scrolledPosition < threshold) setTheme({ current: theme.original });

		setMenuBackground(scrolledPosition > main.offsetTop - menu.offsetTop);
	}, [scrolledPosition, transition]);

	useEffect(() => {
		if (showMenu && isExiting) {
			setSubMenu(null);
		}
	}, [isTransitioning, isExiting]);

	const showSeparator =
		subMenu &&
		showMenu &&
		menu.filter(({ sub, __typename }) => __typename === subMenu?.__typename).length;
	const navbarStyles = cn(
		s.navbar,
		!showMenu && s.hide,
		theme.current === 'dark' && !subMenu && s.dark
	);
	const menuWrapperStyles = cn(
		s.menuWrapper,
		theme.current === 'dark' && !subMenu ? s.dark : s.light,
		subMenu && showMenu && subMenuStyles?.marginLeft && s.open,
		(!showMenu || isExiting) && s.hide,
		isHoveringMenuItem && s.transparent
	);

	const navItems = menu.filter(({ __typename }) => __typename !== 'StartRecord');

	return (
		<>
			<div className={navbarStyles}>
				<Link href={'/'} className={s.logo}>
					<div id='logo'>SASKIA NEUMAN GALLERY</div>
				</Link>
			</div>
			<div id='menu-wrapper' className={menuWrapperStyles}>
				<div
					id={'menu'}
					onMouseLeave={() => setSubMenu(null)}
					className={cn(
						s.menu,
						menuBackground && !isTransitioning && !isHoveringMenuItem && s.opaque,
						subMenu && s.open
					)}
				>
					<ul>
						{navItems.map((m, idx) => (
							<li
								id={`menu-${m.__typename}`}
								key={`menu-${idx}`}
								onClick={(e) => {
									!isMobile &&
										setSubMenu(subMenu && subMenu?.__typename === m.__typename ? null : m);
								}}
								onMouseEnter={() => setHoverSubMenu(m)}
								onMouseLeave={() => setHoverSubMenu(null)}
							>
								<span>
									{m.label}{' '}
									<span
										className={cn(
											s.arrow,
											subMenu?.__typename === m.__typename && s.open,
											hoverSubMenu?.__typename !== m.__typename && s.hide
										)}
									>
										›
									</span>
								</span>
							</li>
						))}
					</ul>
					<div className={cn(s.subMenu, subMenuStyles?.marginLeft && s.show)}>
						{navItems.map((item, i) =>
							item.sub && item.__typename === 'ArtistRecord' ? (
								<div
									className={cn(s.artists, subMenu?.__typename === item.__typename && s.open)}
									key={i}
								>
									<div>
										<h3>Represented</h3>
										<ul>
											{item.sub
												.filter(({ data }) => data?.exhibiting === false)
												.map((sub, idx) => (
													<li key={`sub-${idx}`} className={cn()}>
														<Link
															href={sub.href}
															color={sub.color}
															selected={selected?.id === sub.id}
															image={item.image}
															onMouseEnter={() => handleMouseOver(sub, true)}
															onMouseLeave={() => handleMouseOver(sub, false)}
														>
															{sub.title}
														</Link>
													</li>
												))}
										</ul>
									</div>
									<div>
										<h3>Exhibited</h3>
										<ul>
											{item.sub
												.filter(({ data }) => data?.exhibiting === true)
												.map((sub, idx) => (
													<li key={`sub-${idx}`} className={cn()}>
														<Link
															href={sub.href}
															color={sub.color}
															selected={selected?.id === sub.id}
															image={item.image}
															onMouseEnter={() => handleMouseOver(sub, true)}
															onMouseLeave={() => handleMouseOver(sub, false)}
														>
															{sub.title}
														</Link>
													</li>
												))}
										</ul>
									</div>
								</div>
							) : (
								<ul
									key={`submenu-${i}`}
									id={`sub-${item.__typename}`}
									className={cn(subMenu?.__typename === item.__typename && s.open)}
									style={subMenuStyles}
								>
									{item.sub?.map((sub, idx) => (
										<li
											key={`sub-${idx}`}
											className={cn(sub.__typename === 'AboutRecord' && s.about)}
										>
											{item.__typename !== 'AboutRecord' ? (
												<Link
													href={sub.href}
													color={sub.color}
													selected={selected?.id === sub.id}
													image={item.image}
													onMouseEnter={() => handleMouseOver(sub, true)}
													onMouseLeave={() => handleMouseOver(sub, false)}
												>
													{sub.period && <h3>{sub.period}</h3>}
													{sub.text && (
														<>
															{sub.text}
															<br />
														</>
													)}
													<i>{sub.title}</i>

													{sub.date && (
														<>
															<br />
															{sub.date}
														</>
													)}
												</Link>
											) : (
												<>
													<Link
														href={'/about'}
														color={item.color}
														selected={selected?.id === item.id}
														image={item.image}
														onMouseEnter={() => handleMouseOver(item, true)}
														onMouseLeave={() => handleMouseOver(item, false)}
													>
														About
													</Link>
													<h3>Contact</h3>
													<Markdown content={item.data.address} />
													<a href={`mailto:${item.data.email}`}>{item.data.email}</a>
													<a href={item.data.phone}>{item.data.phone}</a>
													<h3>Happenings</h3>
													<Link
														href={sub.href}
														color={sub.color}
														selected={selected?.id === sub.id}
														image={item.image}
														onMouseEnter={() => handleMouseOver(sub, true)}
														onMouseLeave={() => handleMouseOver(sub, false)}
													>
														{sub.title}
													</Link>
												</>
											)}
										</li>
									))}
									{item.more && item.more.length > 0 && (
										<li className={s.more}>
											<button
												role='switch'
												aria-checked={
													showMore[item.more?.[0].__typename as keyof typeof showMore]
														? 'true'
														: 'false'
												}
												onClick={() =>
													setShowMore((prev) => {
														const t = item.more?.[0].__typename as keyof typeof showMore;
														return {
															...prev,
															[t]: !showMore[t],
														};
													})
												}
											>
												<h3>
													More{' '}
													<span
														className={cn(s.arrow, showMore[item.more[0].__typename] && s.opened)}
													>
														›
													</span>
												</h3>
											</button>
											{showMore[item.more[0].__typename] &&
												item.more.map((more, idx) => (
													<Link
														key={`more-${idx}`}
														href={more.href}
														color={more.color}
														selected={selected?.id === more.id}
														image={more.image}
														onMouseEnter={() => handleMouseOver(more, true)}
														onMouseLeave={() => handleMouseOver(more, false)}
													>
														{more.text && (
															<>
																{more.text}
																<br />
															</>
														)}
														<i>{more.title}</i>
														<br />
														{more.date}
													</Link>
												))}
										</li>
									)}
								</ul>
							)
						)}
					</div>
				</div>
				<div
					id='menu-separator'
					className={cn(s.separator, separatorMargin > 0 && showSeparator && s.show)}
					style={{ marginLeft: `${separatorMargin}px` }}
				></div>
			</div>
		</>
	);
}
