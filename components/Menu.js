import styles from "./Menu.module.scss";
import Link from "/components/Link";
import cn from "classnames";
import useStore from "/store";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useWindowScrollPosition, useWindowSize } from "rooks";
import { useScrollDirection } from "use-scroll-direction";
import { Twirl as Hamburger } from "hamburger-react";
import { imageColor, datePeriod } from "/utils";
import { format } from 'date-fns'

const brightnessThreshold = 0.35

const generateMenu = ({ start, artists, events, shows, about }, path) => {

	if (!artists || !events || !shows || !about || !start) return []

	try {
		const menu = [
			{
				type: "start",
				path: "/",
				label: "SASKIA NEUMAN GALLERY",
				image: start.links[0].image,
			},
			{
				type: "artist",
				path: "/artists",
				label: "Artists",
				sub: artists.map((a) => ({ ...a, slug: `artists/${a.slug}`, color: imageColor(a.image) })),
			},
			{
				type: "show",
				path: "/shows",
				label: "Shows",
				more: true,
				current: shows.find(({ startDate, endDate }) => datePeriod(startDate, endDate) === 'current'),
				upcoming: shows.filter(({ startDate, endDate }) => datePeriod(startDate, endDate) === 'upcoming')[0],
				past: shows.filter(({ startDate, endDate }) => datePeriod(startDate, endDate) === 'past')[0],
				sub: shows.map((s) => ({ ...s, slug: `shows/${s.slug}`, color: imageColor(s.image) })),
			},
			{
				type: "event",
				path: "/events",
				label: "Events",
				more: true,
				upcoming: events.filter(({ startDate, endDate }) => datePeriod(startDate, endDate) === 'upcoming')[0],
				past: events.filter(({ startDate, endDate }) => datePeriod(startDate, endDate) === 'past')[0],
				sub: events.map((e) => ({ ...e, slug: `events/${e.slug}`, color: imageColor(e.image) })),
			},
			{ type: "about", path: "/about", label: "About", image: about.image, color: imageColor(about.image) },
		].map((m) => ({
			...m,
			image: m.sub ? m.sub[0]?.image : m.image,
			color: imageColor(m.sub ? m.sub[0]?.image : m.image),
			isSelected: !m.sub && m.path === path,
			sub: m.sub?.map((s) => ({ ...s, isSelected: `/${s.slug}` === path }))
		}));
		return menu;
	} catch (err) {
		console.error(err)
		return [];
	}
};

export default function Menu(props) {

	const { brightness, start } = props;
	const router = useRouter();
	const menu = generateMenu(props, router.asPath)

	const setBackgroundImage = useStore((state) => state.setBackgroundImage);
	const setBackgroundColor = useStore((state) => state.setBackgroundColor);
	const setIsHoveringMenuItem = useStore((state) => state.setIsHoveringMenuItem);
	const isHoveringMenuItem = useStore((state) => state.isHoveringMenuItem);
	const showMenu = useStore((state) => state.showMenu);
	const setShowMenu = useStore((state) => state.setShowMenu);

	const [showMobileMenu, setShowMobileMenu] = useState(false);
	const [darkTheme, setDarkTheme] = useState(false);
	const [subMenu, setSubMenu] = useState();
	const [menuBackground, setMenuBackground] = useState(false);
	const [subMenuMargin, setSubMenuMargin] = useState(0);
	const [separatorMargin, setSeparatorMargin] = useState(0);
	const [showMore, setShowMore] = useState({ event: false, show: false, artist: false });
	const { scrollY } = typeof window !== "undefined" ? useWindowScrollPosition() : { scrollY: 0 };
	const { scrollDirection } = useScrollDirection();
	const { innerHeight } = useWindowSize()

	const handleMouseOver = (item, hovering) => {
		setIsHoveringMenuItem(hovering);
		setBackgroundImage(hovering ? item.image : null);
	};

	useEffect(() => setDarkTheme(brightness < brightnessThreshold), [brightness])
	
	useEffect(() => {
		if(scrollDirection === "NONE" || showMobileMenu || scrollY > innerHeight) return 
		const show = scrollDirection === "DOWN" ? scrollY < 10 : true; 
		setShowMenu(show)		
	}, [scrollY, scrollDirection, showMobileMenu, innerHeight]);

	useEffect(() => {
		const handleRouteChange = (url, { shallow }) => {
			const subs = [];
			menu.filter(({ sub }) => sub).forEach(({ sub }) => subs.push.apply(subs, sub));

			const next =
				subs.filter(({ slug }) => `/${slug}` === url)[0] ||
				menu.filter(({ path }) => path === url)[0] || menu.filter(({ path }) => path === url)[0]

			if (next)
				setBackgroundColor(next.color)

			setShowMobileMenu(false);
			setSubMenu(undefined);
		};

		router.events.on("routeChangeStart", handleRouteChange);
		return () => router.events.off("routeChangeStart", handleRouteChange);
	}, []);

	useEffect(() => {
		const el = document.getElementById(`menu-${subMenu?.type}`);
		const menuWrapper = document.getElementById("menu-wrapper");
		if (!el || !menu) return;

		const padding = getComputedStyle(menuWrapper, null).getPropertyValue("padding-left");
		setSeparatorMargin(el.offsetParent.offsetLeft + el.offsetLeft - parseInt(padding));
		setSubMenuMargin(el.offsetLeft);
	}, [subMenu]);

	useEffect(() => {

		const logo = document.getElementById('logo')
		const main = document.getElementById('main')
		const menu = document.getElementById('menu')

		if (!main || !logo || !menu) return

		const threshold = main.offsetTop - (logo.clientHeight * 2);

		if (scrollY > threshold && darkTheme && brightness < brightnessThreshold)
			setDarkTheme(false)
		else if (scrollY < threshold && !darkTheme && brightness < brightnessThreshold)
			setDarkTheme(true)

		setMenuBackground(scrollY > (main.offsetTop-menu.offsetTop))

	}, [scrollY, darkTheme, brightness]);

	const showSeparator = subMenu && showMenu && menu.filter(({ sub, type }) => type === subMenu?.type).length;
	const navbarStyles = cn(styles.navbar, (!showMenu && !showMobileMenu) && styles.hide, (darkTheme && !(subMenu || showMobileMenu)) && styles.dark);
	const menuStyles = cn(
		styles.menuWrapper,
		darkTheme && !(subMenu || showMobileMenu) ? styles.dark : styles.light,
		(subMenu || showMobileMenu) && showMenu && styles.open,
		!showMenu && !showMobileMenu && styles.hide,
		isHoveringMenuItem && styles.transparent
	);

	if (!menu || menu.length === 0) return null

	return (
		<>
			<div className={navbarStyles}>
				<Link href={menu[0].path} id="logo" className={styles.logo}>
					{menu[0].label}
				</Link>
				<div className={styles.hamburger}>
					<Hamburger
						toggled={showMobileMenu}
						duration={0.5}
						onToggle={(toggle) => setShowMobileMenu(toggle)}
						color={darkTheme && !showMobileMenu ? "#fff" : "#000"}
						label={"Menu"}
						size={17}
					/>
				</div>
			</div>
			<div id="menu-wrapper" className={menuStyles}>
				<div id={'menu'} className={cn(styles.menu, showMobileMenu && styles.show, menuBackground && styles.opaque)} onMouseLeave={() => setSubMenu()}>
					<ul>
						{menu.slice(1).map((m, idx) => (
							<li
								id={`menu-${m.type}`}
								key={idx}
								className={cn(router.asPath === m.path && styles.selected)}
								onMouseOver={() => setSubMenu(m)}
							>
								{m.sub ? (
									<span onClick={() => setSubMenu(m)}>{m.label}</span>
								) : (
									<Link href={m.path} onMouseEnter={() => handleMouseOver(m, true)} onMouseLeave={() => handleMouseOver(m, false)}>
										{m.label}
									</Link>
								)}
								{showMobileMenu && m.type === subMenu?.type && (
									<ul key={idx} id={`sub-${m.type}`} className={cn(subMenu?.type === m.type && styles.open)}>
										{m.sub?.map((a, idx) => (
											<Link key={idx} href={`/${a.slug}`} color={a.color} onMouseEnter={() => handleMouseOver(m, true)} onMouseLeave={() => handleMouseOver(m, false)}>
												<li className={cn(a.isSelected && styles.selected)}>
													{a.name || a.title}
												</li>
											</Link>
										))}
									</ul>
								)}
							</li>
						))}
					</ul>
					<div className={styles.subMenu}>
						{menu.slice(1).map(
							({ type, path, label, sub, past, upcoming, current, more }, idx) =>
								(sub && !showMobileMenu) &&
								<ul
									key={idx}
									id={`sub-${type}`}
									className={cn(subMenu?.type === type && styles.open)}
									style={{ marginLeft: `${subMenuMargin}px` }}
								>
									{sub.map((item, idx) => (
										<li
											key={idx}
											onMouseEnter={() => handleMouseOver(item, true)}
											onMouseLeave={() => handleMouseOver(item, false)}
										>
											<Link href={`/${item.slug}`} color={item.color}>
												{type === 'artist' ?
													<>{item.name || item.title}</>
													:
													<>
														<h3>{datePeriod(item.startDate, item.endDate)}</h3>
														{item.artists && item.artists?.map((a) => a.name).join(', ')}{item.artists && <br />}
														<i>{item.title}</i><br />
														{format(new Date(item.startDate), 'dd.MM')}—{format(new Date(item.endDate), 'dd.MM.yyyy')}
													</>
												}
											</Link>
										</li>
									))}
									{more &&
										<li className={styles.more} onClick={() => setShowMore({ ...showMore, [type]: !showMore[type] })}>
											{!showMore[type] ?
												'Show all ›'
												:
												sub.filter(({ startDate, endDate }) => datePeriod(startDate, endDate)).map((item, idx) =>
													<>
														<Link 
															key={idx} 
															href={`/${item.slug}`} 
															color={item.color} 
															onMouseEnter={() => handleMouseOver(item, true)} 
															onMouseLeave={() => handleMouseOver(item, false)}
														>
															{item.title}
														</Link>
														<br />
													</>
												)
											}
										</li>
									}
								</ul>
						)}
					</div>
				</div>
				<div
					id="menu-separator"
					className={cn(styles.separator, showSeparator && styles.show)}
					style={{ marginLeft: `${separatorMargin}px` }}
				></div>
			</div>
		</>
	);
}
