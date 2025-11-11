'use client';

import s from './Menu.module.scss';
import Link from '@/components/Link';
import cn from 'classnames';
import { useStore, useShallow } from '@/lib/store';
import { useState, useEffect, Fragment } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useWindowSize } from 'usehooks-ts';
import { useScrollInfo } from 'next-dato-utils/hooks';
import { Twirl as Hamburger } from 'hamburger-react';
import { imageColor, datePeriod } from '@/lib/utils';
import { format } from 'date-fns';
import { MenuItem, MenuItemSub } from '@/lib/menu';
import React from 'react';
import { useRouteChangeStart } from '@/lib/hooks/useRouteChange';

export default function Menu({ menu, image }: { menu: MenuItem[]; image: any }) {
	const pathname = usePathname();
	const [
		setBackgroundImage,
		setBackgroundColor,
		setIsHoveringMenuItem,
		isHoveringMenuItem,
		setIsTransitioning,
		setIsExiting,
		setShowMenu,
		showMenu,
		isExiting,
		isTransitioning,
	] = useStore(
		useShallow((s) => [
			s.setBackgroundImage,
			s.setBackgroundColor,
			s.setIsHoveringMenuItem,
			s.isHoveringMenuItem,
			s.setIsTransitioning,
			s.setIsExiting,
			s.setShowMenu,
			s.showMenu,
			s.isExiting,
			s.isTransitioning,
		])
	);

	const imageTheme = image?.customData.theme || 'light';
	const [darkTheme, setDarkTheme] = useState(false);
	const [hoverSubMenu, setHoverSubMenu] = useState<MenuItem | null>(null);
	const [subMenu, setSubMenu] = useState<MenuItem | null>(null);
	const [subMenuMobile, setSubMenuMobile] = useState();
	const [menuBackground, setMenuBackground] = useState(false);
	const [subMenuMargin, setSubMenuMargin] = useState(0);
	const [separatorMargin, setSeparatorMargin] = useState(0);
	const [showMore, setShowMore] = useState({ ExhibitionRecord: false, HappeningRecord: false });
	const { isPageBottom, isScrolledUp, scrolledPosition, isPageTop } = useScrollInfo();
	const { width } = useWindowSize();
	const isMobile = width <= 768;

	const handleMouseOver = (item: MenuItemSub, hovering: boolean) => {
		setTimeout(
			() => {
				setIsHoveringMenuItem(hovering);
				setBackgroundImage(hovering ? item.image : null);
			},
			isTransitioning ? 1000 : 0
		);
	};

	useEffect(() => {
		setDarkTheme(imageTheme === 'dark');
	}, [imageTheme]);

	useEffect(() => {
		// Toggle menu bar on scroll
		setShowMenu((isScrolledUp && !isPageBottom) || isPageTop);
	}, [scrolledPosition, isPageBottom, isPageTop, isScrolledUp]);

	useRouteChangeStart(() => {
		setIsHoveringMenuItem(false);
		setSubMenu(null);
	});

	/*

	useEffect(() => {
		// Set Background image on route start change
		//setIsHoveringMenuItem(false);
		//setSubMenu(null);

		
		const handleRouteChange = (url, { shallow }) => {
			const subs = [];
			menu.filter(({ sub }) => sub).forEach(({ sub }) => subs.push.apply(subs, sub));

			const next =
				subs.filter(({ slug }) => `/${slug}` === url)[0] ||
				menu.filter(({ path }) => path === url)[0] ||
				menu.filter(({ path }) => path === url)[0];

			if (next) setBackgroundColor(next.color);
		};
		
		return () => {
			setIsHoveringMenuItem(false);
			setSubMenu(null);
		};
	}, [pathname]);

	*/

	useEffect(() => {
		// Update separator and sub menu margin
		if (!subMenu) return;
		const el = document.getElementById(`menu-${subMenu.__typename}`) as HTMLDivElement;
		const menuWrapper = document.getElementById('menu-wrapper');
		if (!el || !menu || !menuWrapper) return;

		const padding = getComputedStyle(menuWrapper, null).getPropertyValue('padding-left');
		const parent = el.offsetParent as HTMLDivElement;

		setSubMenuMargin(el.offsetLeft);
		setSeparatorMargin(parent?.offsetLeft + el.offsetLeft - parseInt(padding));
	}, [subMenu]);

	useEffect(() => {
		// Toggle dark/light logo on scroll after fold

		const logo = document.getElementById('logo');
		const main = document.getElementById('main');
		const menu = document.getElementById('menu');

		if (!main || !logo || !menu) return setMenuBackground(false);

		const logoStyle = getComputedStyle(logo, null);
		const logoHeight =
			parseInt(logoStyle.getPropertyValue('height')) - parseInt(logoStyle.getPropertyValue('padding-top'));
		const threshold = main.offsetTop - logoHeight * 2;

		if (scrolledPosition > threshold && darkTheme && imageTheme === 'dark') setDarkTheme(false);
		else if (scrolledPosition < threshold) setDarkTheme(imageTheme === 'dark');

		setMenuBackground(scrolledPosition > main.offsetTop - menu.offsetTop);
	}, [scrolledPosition, darkTheme, imageTheme]);

	useEffect(() => {
		if (showMenu && isExiting) {
			setSubMenu(null);
		}
	}, [isTransitioning, isExiting]);

	const startMenuItem = menu.find(({ __typename }) => __typename === 'StartRecord');
	const navItems = menu.filter(({ __typename }) => __typename !== 'StartRecord');

	const showSeparator =
		subMenu && showMenu && menu.filter(({ sub, __typename }) => __typename === subMenu?.__typename).length;
	const navbarStyles = cn(s.navbar, !showMenu && s.hide, darkTheme && !subMenu && s.dark);
	const menuWrapperStyles = cn(
		s.menuWrapper,
		darkTheme && !subMenu ? s.dark : s.light,
		subMenu && showMenu && subMenuMargin > 0 && s.open,
		(!showMenu || isExiting) && s.hide,
		isHoveringMenuItem && s.transparent
	);

	const menuStyles = cn(s.menu, menuBackground && !isTransitioning && !isHoveringMenuItem && s.opaque);

	return (
		<>
			<div className={navbarStyles}>
				<Link href={'/'} className={s.logo}>
					<div id='logo'>SASKIA NEUMAN GALLERY</div>
				</Link>
			</div>
			<div id='menu-wrapper' className={menuWrapperStyles}>
				<div id={'menu'} className={menuStyles} onMouseLeave={() => setSubMenu(null)}>
					<ul>
						{navItems.map((m, idx) => (
							<li
								id={`menu-${m.__typename}`}
								key={`menu-${idx}`}
								onClick={(e) => {
									!isMobile && setSubMenu(subMenu && subMenu?.__typename === m.__typename ? null : m);
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
					<div className={cn(s.subMenu, subMenuMargin > 0 && s.show)}>
						{navItems.map(
							(item, i) =>
								item.sub && (
									<ul
										key={`submenu-${i}`}
										id={`sub-${item.__typename}`}
										className={cn(subMenu?.__typename === item.__typename && s.open)}
										style={{ marginLeft: `${subMenuMargin}px` }}
									>
										{item.sub?.map((sub, idx) => (
											<React.Fragment key={idx}>
												<Link
													key={`sub-${idx}`}
													href={sub.href}
													color={sub.color}
													selected={sub.selected}
													image={item.image}
												>
													<li
														onMouseEnter={() => handleMouseOver(sub, true)}
														onMouseLeave={() => handleMouseOver(sub, false)}
														data-type={sub.__typename}
													>
														{item.__typename === 'ArtistRecord' || item.__typename === 'AboutRecord' ? (
															<span>{sub.title}</span>
														) : (
															<>
																<h3>{sub.period}</h3>
																{sub.text}
																<br />
																<i>{sub.title}</i>
																<br />
																{sub.date}
															</>
														)}
													</li>
												</Link>
												{item.__typename === 'AboutRecord' && (
													<li className={s.contact}>
														<h3>Contact</h3>
														Linnégatan 19
														<p>Stockholm</p>
														<p className={s.narrowHide}>{sub.title}</p>
														<p className={s.narrowHide}>
															<a href={sub.href} target='new'>
																Google Maps ↗
															</a>
														</p>
													</li>
												)}
											</React.Fragment>
										))}

										{item.more && item.more.length > 0 && (
											<li className={s.more}>
												<div
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
														More <div className={cn(s.arrow, showMore[item.more[0].__typename] && s.opened)}>›</div>
													</h3>
												</div>
												{showMore[item.more[0].__typename] &&
													item.more.map(({ href, color, title, period, selected, text, date }, idx) => (
														<Link
															key={`more-${idx}`}
															href={href}
															color={color}
															selected={selected}
															image={image}
															//onMouseEnter={() => handleMouseOver(sub, true)}
															//onMouseLeave={() => handleMouseOver(sub, false)}
														>
															<div>
																<h3>{period}</h3>
																{text}
																<br />
																<i>{title}</i>
																<br />
																{date}
															</div>
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
