import styles from "./Menu.module.scss";
import Link from "/components/Link";
import cn from "classnames";
import useStore from "/store";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useWindowScrollPosition } from "rooks";
import { useScrollDirection } from "use-scroll-direction";
import { Twirl as Hamburger } from "hamburger-react";
import { imageColor } from "/lib/utils";
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
				current: shows.find(({ startDate, endDate }) => new Date() >= new Date(startDate) && new Date() <= new Date(endDate)),
				upcoming: shows.filter(({ startDate, endDate }) => new Date(startDate) > new Date() && new Date(endDate) > new Date())[0],
				past: shows.filter(({ startDate, endDate }) => new Date(startDate) < new Date() && new Date(endDate) < new Date())[0],
				sub: shows.map((s) => ({ ...s, slug: `shows/${s.slug}`, color: imageColor(s.image) })),
			},
			{
				type: "event",
				path: "/events",
				label: "Events",
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

	const [showMobileMenu, setShowMobileMenu] = useState(false);
	const [darkTheme, setDarkTheme] = useState(false);
	const [subMenu, setSubMenu] = useState();
	const [showMenu, setShowMenu] = useState(true);
	const [subMenuMargin, setSubMenuMargin] = useState(0);
	const [separatorMargin, setSeparatorMargin] = useState(0);
	const { scrollY } = typeof window !== "undefined" ? useWindowScrollPosition() : { scrollY: 0 };
	const { scrollDirection } = useScrollDirection();

	const handleMouseOver = (item, hovering) => {
		setIsHoveringMenuItem(hovering);
		setBackgroundImage(hovering ? item.image : null);
	};

	useEffect(() => setDarkTheme(brightness < brightnessThreshold), [brightness])
	useEffect(() => {
		if (scrollDirection !== "NONE" || scrollY < 50) {
			const show = scrollY < 50 || scrollDirection === "UP"
			setShowMenu(show)
		}
	}, [scrollY, scrollDirection]);

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

		if (!main || !logo) return

		const threshold = main.offsetTop - (logo.clientHeight * 2);

		if (scrollY > threshold && darkTheme && brightness < brightnessThreshold) {
			setDarkTheme(false)
		}
		else if (scrollY < threshold && !darkTheme && brightness < brightnessThreshold)
			setDarkTheme(true)

	}, [scrollY, darkTheme, brightness]);

	const showSeparator = subMenu && menu.filter(({ sub, type }) => type === subMenu?.type).length;
	const navbarStyles = cn(styles.navbar, !showMenu && !showMobileMenu && styles.hide, (darkTheme && !(subMenu || showMobileMenu)) && styles.dark);
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
						color={darkTheme ? "#fff" : "#000"}
						label={"Menu"}
						size={20}
					/>
				</div>
			</div>
			<div id="menu-wrapper" className={menuStyles}>
				<div
					className={cn(styles.menu, showMobileMenu && styles.show)}
					onMouseLeave={() => setSubMenu()}
				>
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
									<ul
										key={idx}
										id={`sub-${m.type}`}
										className={cn(subMenu?.type === m.type && styles.open)}
									>
										{m.sub?.map((a, idx) => (
											<Link key={idx} href={`/${a.slug}`} color={a.color} onMouseEnter={() => handleMouseOver(m, true)} onMouseLeave={() => handleMouseOver(m, false)}>
												<li className={a.isSelected && styles.selected}>
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
							({ type, path, label, sub, past, upcoming, current }, idx) =>
								(sub && !showMobileMenu) &&
								<ul
									key={idx}
									id={`sub-${type}`}
									className={cn(subMenu?.type === type && styles.open)}
									style={{ marginLeft: `${subMenuMargin}px` }}
								>
									{type !== 'show' ? sub.map((a, idx) => (
										<li
											key={idx}
											onMouseEnter={() => handleMouseOver(a, true)}
											onMouseLeave={() => handleMouseOver(a, false)}
										>
											<Link href={`/${a.slug}`} color={a.color}>
												{a.name || a.title}
											</Link>
										</li>
									))
										: (
											[current, upcoming, past].map((show, idx) => show &&
												<li
													key={idx}
													onMouseEnter={() => handleMouseOver(show, true)}
													onMouseLeave={() => handleMouseOver(show, false)}
												>
													<Link href={`/shows/${show.slug}`} color={imageColor(show.image)}>
														<h3>{idx === 0 ? 'Current' : idx === 1 ? 'Upcoming' : 'Past'}</h3>
														{show.artists.map((a) => a.name).join(', ')}<br />
														<i>{show.title}</i><br />
														{format(new Date(show.startDate), 'dd.MM')}—{format(new Date(show.endDate), 'dd.MM.yyyy')}
													</Link>
												</li>
											)
										)
									}
								</ul>
						)}
					</div>
				</div>
				<div
					id="menu-separator"
					className={cn(styles.separator, showSeparator && showMenu && styles.show)}
					style={{ marginLeft: `${separatorMargin}px` }}
				></div>
			</div>
		</>
	);
}
