'use client';

import s from './MenuMobile.module.scss';
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
import { MenuItem } from '@/lib/menu';

export default function MenuMobile({ menu, image }: { menu: MenuItem[]; image: any }) {
	//const router = useRouter();
	const pathname = usePathname();
	const setBackgroundImage = useStore((state) => state.setBackgroundImage);
	const setBackgroundColor = useStore((state) => state.setBackgroundColor);
	const setIsHoveringMenuItem = useStore((state) => state.setIsHoveringMenuItem);
	const isHoveringMenuItem = useStore((state) => state.isHoveringMenuItem);
	const isTransitioning = useStore((state) => state.isTransitioning);
	const isExiting = useStore((state) => state.isExiting);
	const showMenu = useStore((state) => state.showMenu);
	const setShowMenu = useStore((state) => state.setShowMenu);

	const showMobileMenu = useStore((state) => state.showMobileMenu);
	const setShowMobileMenu = useStore((state) => state.setShowMobileMenu);

	const imageTheme = image?.customData.theme || 'light';
	const [darkTheme, setDarkTheme] = useState(false);
	const [hoverSubMenu, setHoverSubMenu] = useState();
	const [subMenu, setSubMenu] = useState();
	const [subMenuMobile, setSubMenuMobile] = useState();
	const [menuBackground, setMenuBackground] = useState(false);
	const [subMenuMargin, setSubMenuMargin] = useState(0);
	const [separatorMargin, setSeparatorMargin] = useState(0);
	const [showMore, setShowMore] = useState({ event: false, show: false, artist: false });
	const { isPageBottom, isScrolledUp, scrolledPosition, isPageTop } = useScrollInfo();
	const { width } = useWindowSize();
	const isMobile = width <= 768;

	const handleMouseOver = (item, hovering) => {
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
	}, [pathname]);

	useEffect(() => {
		// Update separator and sub menu margin

		const el = document.getElementById(`menu-${subMenu?.type}`);
		const menuWrapper = document.getElementById('menu-wrapper');
		if (!el || !menu) return;

		const padding = getComputedStyle(menuWrapper, null).getPropertyValue('padding-left');
		setSubMenuMargin(el.offsetLeft);
		setSeparatorMargin(el.offsetParent?.offsetLeft + el.offsetLeft - parseInt(padding));
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
		// Hide mobile menu after exiting
		if (showMobileMenu && !isExiting) {
			setSubMenu(undefined);
			setShowMobileMenu(false);
		}
		if (showMenu && isExiting) {
			setSubMenu(undefined);
		}
	}, [isTransitioning, isExiting]);

	const nav = menu.map((m) => ({
		...m,
		sub: m.sub?.map((item, idx) => (
			<>
				<Link
					key={`sub-${idx}`}
					href={`/${item.slug}`}
					color={item.color}
					isSelected={item.isSelected}
					image={item.image}
				>
					<li onMouseEnter={() => handleMouseOver(item, true)} onMouseLeave={() => handleMouseOver(item, false)}>
						{m.type === 'artist' || m.type === 'about' ? (
							<span>{item.firstName ? `${item.firstName} ${item.lastName}` : (item.title ?? item.name)}</span>
						) : (
							<>
								<h3>{datePeriod(item.startDate, item.endDate)}</h3>
								{item.artists && item.artists?.map((a, idx) => `${a.firstName} ${a.lastName}`).join(', ')}
								{item.artists && <br />}
								<i>{item.title}</i>
								<br />
								{format(new Date(item.startDate), 'dd.MM')}—{format(new Date(item.endDate), 'dd.MM.yyyy')}
							</>
						)}
					</li>
				</Link>
				{m.type === 'about' && idx === m.sub?.length - 1 ? (
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
		)),
		more: m.all
			?.filter(({ startDate, endDate, id }) => datePeriod(startDate, endDate) === 'past' && m.past?.id !== id)
			.map((item, idx) => (
				<Link
					key={`more-${idx}`}
					href={`/${item.slug}`}
					color={item.color}
					isSelected={item.isSelected}
					image={item.image}
					onMouseEnter={() => handleMouseOver(item, true)}
					onMouseLeave={() => handleMouseOver(item, false)}
				>
					<p>
						{item.artists && item.artists?.map((a) => `${a.firstName} ${a.lastName}`).join(', ')}
						{item.artists && <br />}
						<i>{item.title}</i>
						<br />
						{format(new Date(item.startDate), 'dd.MM')}—{format(new Date(item.endDate), 'dd.MM.yyyy')}
					</p>
				</Link>
			)),
	}));

	const showSeparator = subMenu && showMenu && menu.filter(({ sub, type }) => type === subMenu?.type).length;
	const navbarStyles = cn(
		s.navbar,
		!showMenu && !showMobileMenu && s.hide,
		darkTheme && !(subMenu || showMobileMenu) && s.dark
	);
	const menuWrapperStyles = cn(
		s.menuWrapper,
		darkTheme && !(subMenu || showMobileMenu) ? s.dark : s.light,
		(showMobileMenu || (subMenu && showMenu && subMenuMargin > 0)) && s.open,
		((!showMenu && !showMobileMenu) || (isExiting && !showMobileMenu)) && s.hide,
		isHoveringMenuItem && s.transparent
	);

	const menuStyles = cn(
		s.menu,
		showMobileMenu && s.show,
		menuBackground && !isTransitioning && !isHoveringMenuItem && s.opaque
	);

	console.log({ showMenu, subMenu, isHoveringMenuItem });
	if (!menu || menu.length === 0) return null;

	console.log(nav);

	return (
		<>
			<div className={navbarStyles}>
				<Link href={'/'} className={s.logo}>
					<div id='logo'>SASKIA NEUMAN GALLERY</div>
				</Link>
				<div className={s.hamburger}>
					<Hamburger
						toggled={showMobileMenu}
						duration={0.5}
						onToggle={setShowMobileMenu}
						color={'#000'}
						label={'Menu'}
						size={17}
					/>
				</div>
			</div>
			<div id='menu-wrapper' className={menuWrapperStyles}>
				<div id={'menu'} className={menuStyles} onMouseLeave={() => setSubMenu(undefined)}>
					<ul>
						{nav.slice(1).map((m, idx) => (
							<li
								id={`menu-${m.type}`}
								key={`menu-${idx}`}
								onClick={(e) => {
									!isMobile && setSubMenu(subMenu?.type === m.type ? undefined : m);
								}}
								onMouseEnter={() => setHoverSubMenu(m)}
								onMouseLeave={() => setHoverSubMenu(undefined)}
								onTouchEnd={() => setSubMenuMobile(subMenuMobile && subMenuMobile.label === m.label ? undefined : m)}
							>
								<span>
									{m.label}{' '}
									<span
										className={cn(
											s.arrow,
											(subMenu?.type === m.type || subMenuMobile?.type === m.type) && s.open,
											hoverSubMenu?.type !== m.type && s.hide
										)}
									>
										›
									</span>
								</span>
								{showMobileMenu && m.type === subMenuMobile?.type && (
									<ul
										onTouchEnd={(e) => e.stopPropagation()}
										key={`mobile-list-${idx}`}
										id={`sub-${m.type}`}
										className={cn(subMenuMobile?.type === m.type && s.open)}
									>
										{m.sub.length > 0 ? <>{m.sub}</> : 'To be announced...'}
										{m.more && m.more?.length > 0 && (
											<li className={s.more}>
												<div onClick={() => setShowMore({ ...showMore, [m.type]: !showMore[m.type] })}>
													<h3>
														More <div className={cn(s.arrow, showMore[m.type] && s.opened)}>›</div>
													</h3>
												</div>
												{showMore[m.type] && m.more}
											</li>
										)}
									</ul>
								)}
							</li>
						))}
					</ul>
					<div className={cn(s.subMenu, subMenuMargin > 0 && s.show)}>
						{nav.slice(1).map(
							({ type, sub, more }, idx) =>
								sub &&
								!showMobileMenu && (
									<ul
										key={`submenu-${idx}`}
										id={`sub-${type}`}
										className={cn(subMenu?.type === type && s.open)}
										style={{ marginLeft: `${subMenuMargin}px` }}
									>
										{sub?.length > 0 ? (
											sub.map((item, idx) => <Fragment key={`sub-desktop-${idx}`}>{item.name}</Fragment>)
										) : (
											<li>To be announced...</li>
										)}

										{more && more?.length > 0 && (
											<li className={s.more}>
												<div onClick={() => setShowMore({ ...showMore, [type]: !showMore[type] })}>
													<h3>
														More <div className={cn(s.arrow, showMore[type] && s.opened)}>›</div>
													</h3>
												</div>
												{showMore[type] && more}
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
