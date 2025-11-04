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

	useEffect(() => {
		// Set Background image on route start change
		setIsHoveringMenuItem(false);

		/*
		const handleRouteChange = (url, { shallow }) => {
			const subs = [];
			menu.filter(({ sub }) => sub).forEach(({ sub }) => subs.push.apply(subs, sub));

			const next =
				subs.filter(({ slug }) => `/${slug}` === url)[0] ||
				menu.filter(({ path }) => path === url)[0] ||
				menu.filter(({ path }) => path === url)[0];

			if (next) setBackgroundColor(next.color);
		};
		//router.events.on('routeChangeStart', handleRouteChange);
		return () => {
			//router.events.off('routeChangeStart', handleRouteChange);
		};
		*/
	}, [pathname]);

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

	console.log({ showMenu, subMenu, isHoveringMenuItem });
	if (!menu || menu.length === 0) return null;

	console.log(nav);

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
											(subMenu?.__typename === m.__typename || subMenuMobile?.__typename === m.__typename) && s.open,
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
							({ __typename, sub, more }, idx) =>
								sub && (
									<ul
										key={`submenu-${idx}`}
										id={`sub-${__typename}`}
										className={cn(subMenu?.__typename === __typename && s.open)}
										style={{ marginLeft: `${subMenuMargin}px` }}
									>
										{sub?.length > 0 ? (
											sub.map((item, idx) => (
												<>
													<Link
														key={`sub-${idx}`}
														href={`/${item.slug}`}
														color={item.color}
														isSelected={item.isSelected}
														image={item.image}
													>
														<li
															onMouseEnter={() => handleMouseOver(item, true)}
															onMouseLeave={() => handleMouseOver(item, false)}
														>
															{__typename === 'ArtistRecord' || __typename === 'AboutRecord' ? (
																<span>
																	{item.firstName ? `${item.firstName} ${item.lastName}` : (item.title ?? item.name)}
																</span>
															) : (
																<>
																	<h3>{datePeriod(item.startDate, item.endDate)}</h3>
																	{item.artists &&
																		item.artists?.map((a, idx) => `${a.firstName} ${a.lastName}`).join(', ')}
																	{item.artists && <br />}
																	<i>{item.title}</i>
																	<br />
																	{format(new Date(item.startDate), 'dd.MM')}—
																	{format(new Date(item.endDate), 'dd.MM.yyyy')}
																</>
															)}
														</li>
													</Link>
													{__typename === 'AboutRecord' && sub && idx === sub.length - 1 ? (
														<li className={s.contact}>
															<h3>Contact</h3>
															Linnégatan 19
															<p>Stockholm</p>
															<p className={s.narrowHide}>{m.about.phone}</p>
															<p className={s.narrowHide}>
																<a href={m.about.googleMapsUrl} target='new'>
																	Google Maps ↗
																</a>
															</p>
														</li>
													) : (
														<>mada</>
													)}
												</>
											))
										) : (
											<li>To be announced...</li>
										)}

										{more && more?.length > 0 && (
											<li className={s.more}>
												<div
													onClick={() =>
														setShowMore((prev) => ({ ...prev, [__typename]: !showMore[more[0].__typename] }))
													}
												>
													<h3>
														More <div className={cn(s.arrow, showMore[more[0].__typename] && s.opened)}>›</div>
													</h3>
												</div>
												{showMore[more[0].__typename] && more}
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
