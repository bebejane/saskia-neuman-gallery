import styles from "./Menu.module.scss";
import Link from "/components/Link";
import cn from "classnames";
import useStore from "/store";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useWindowScrollPosition, useWindowSize } from "rooks";
import { useScrollDirection } from "use-scroll-direction";
import { Twirl as Hamburger } from "hamburger-react";
import { imageColor, datePeriod } from "/utils";
import { format } from 'date-fns'
import Markdown from "/lib/dato/components/Markdown";

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
				sub:[
					shows.find(({ startDate, endDate }) => datePeriod(startDate, endDate) === 'current'),
					shows.filter(({ startDate, endDate }) => datePeriod(startDate, endDate) === 'upcoming')[0],
					shows.filter(({ startDate, endDate }) => datePeriod(startDate, endDate) === 'past')[0]
				].filter(i => i).map(s => ({...s, slug: `shows/${s.slug}`})),
				all: shows.map((s) => ({ ...s, slug: `shows/${s.slug}`, color: imageColor(s.image) })),
			},
			{
				type: "event",
				path: "/events",
				label: "Events",
				more: true,
				sub:[
					events.filter(({ startDate, endDate }) => datePeriod(startDate, endDate) === 'upcoming')[0],
					events.filter(({ startDate, endDate }) => datePeriod(startDate, endDate) === 'past')[0]
				].filter(i => i).map(s => ({...s, slug: `events/${s.slug}`})),
				all: events.map((e) => ({ ...e, slug: `events/${e.slug}`, color: imageColor(e.image) })),
			},
			{ 
				type: "about", 
				path: "/about", 
				label: "About",
				more:false,
				about,
				sub: [{name:'Our Gallery', image:about.image, color:imageColor(about.image) }]
			},
		].map((m) => ({
			...m,
			image: m.sub ? m.sub[0]?.image : m.image,
			color: imageColor(m.sub ? m.sub[0]?.image : m.image),
			isSelected: !m.sub && m.path === path,
			sub: m.sub?.map((s) => ({ ...s, isSelected: `/${s.slug}` === path, color:imageColor(s.image) }))
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
		if(scrollDirection === "NONE" || showMobileMenu || scrollY > innerHeight || subMenu) return 
		const show = scrollDirection === "DOWN" ? scrollY < 10 : true; 
		setShowMenu(show)		
	}, [scrollY, scrollDirection, showMobileMenu, innerHeight, subMenu]);

	useEffect(() => {
		const handleRouteChange = (url, { shallow }) => {
			const subs = [];
			menu.filter(({ sub }) => sub).forEach(({ sub }) => subs.push.apply(subs, sub));

			const next =
				subs.filter(({ slug }) => `/${slug}` === url)[0] ||
				menu.filter(({ path }) => path === url)[0] || menu.filter(({ path }) => path === url)[0]

			if(next)
				setBackgroundColor(next.color)
		};

		const handleRouteChangeComplete = (url, { shallow }) => {
			setShowMenu(true)
			setShowMobileMenu(false)
			setSubMenu(undefined)
		};

		router.events.on("routeChangeStart", handleRouteChange);
		router.events.on("routeChangeComplete", handleRouteChangeComplete);
		return () => {
			router.events.off("routeChangeStart", handleRouteChange)
			router.events.off("routeChangeComplete", handleRouteChangeComplete)
		};
	}, []);

	useEffect(() => {
		const el = document.getElementById(`menu-${subMenu?.type}`);
		const menuWrapper = document.getElementById("menu-wrapper");
		if (!el || !menu) return;

		const padding = getComputedStyle(menuWrapper, null).getPropertyValue("padding-left");
		setSeparatorMargin(el.offsetParent?.offsetLeft + el.offsetLeft - parseInt(padding));
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

	const menu = generateMenu(props, router.asPath).map(m => ({
		...m,
		sub: m.sub?.map((item, idx) => (
			<>
			<Link key={`sub-${idx}`} href={`/${item.slug}`} color={item.color} isSelected={item.isSelected}>
				<li 
					className={cn(item.isSelected && styles.selected)} 
					onMouseEnter={() => handleMouseOver(item, true)} 
					onMouseLeave={() => handleMouseOver(item, false)}
				>
					{m.type === 'artist' || m.type === 'about' ?
						<>{item.name || item.title}</>
					:
						<>
							<h3>{datePeriod(item.startDate, item.endDate)}</h3>
							{item.artists && item.artists?.map((a) => a.name).join(', ')}{item.artists && <br />}
							<i>{item.title}</i><br />
							{format(new Date(item.startDate), 'dd.MM')}—{format(new Date(item.endDate), 'dd.MM.yyyy')}
						</>
					}
				</li>
			</Link>
			{m.type === 'about' && idx === m.sub.length-1 &&
				<p>
					<h3>Contact</h3>
					<Markdown>{m.about.address}</Markdown>
					<a href={m.about.googleMapsUrl} target="new">View in Google Maps ↗</a><br /><br />
					Opening hours:<br />
					{m.about.hours}<br /><br />
					<a href={`mailto:${m.about.email}`}>{m.about.email}</a>
				</p>
			}
			</>
		)),
		more: m.more && m.sub?.map(item =>
			m.sub.concat(m.sub).concat(m.sub).concat(m.sub).concat(m.sub).concat(m.sub).concat(m.sub).concat(m.sub).map((item, idx) =>
				<>
					<Link 
						key={`more-${idx}`} 
						href={`/${item.slug}`} 
						color={item.color} 
						isSelected={item.isSelected}
						onMouseEnter={() => handleMouseOver(item, true)} 
						onMouseLeave={() => handleMouseOver(item, false)}
					>
						<p>
							{item.artists && item.artists?.map((a) => a.name).join(', ')}{item.artists && <br />}
							{item.title}
							{m.type === 'event' ? <><br/>{format(new Date(item.startDate), 'dd.MM')}—{format(new Date(item.endDate), 'dd.MM.yyyy')}</> : ''}
						</p>
					</Link>
				</>
			)
		)
	}))

	const showSeparator = subMenu && showMenu && menu.filter(({ sub, type }) => type === subMenu?.type).length;
	const navbarStyles = cn(styles.navbar, (!showMenu && !showMobileMenu) && styles.hide, (darkTheme && !(subMenu || showMobileMenu)) && styles.dark);
	const menuStyles = cn(
		styles.menuWrapper,
		darkTheme && !(subMenu || showMobileMenu) ? styles.dark : styles.light,
		(subMenu || showMobileMenu) && showMenu  && styles.open,
		!showMenu && !showMobileMenu && styles.hide,
		isHoveringMenuItem && styles.transparent
	);

	if (!menu || menu.length === 0) return null	

	return (
		<>
			<div className={navbarStyles}>
				<Link href={menu[0].path} id="logo" className={styles.logo}>
					SASKIA NEUMAN GALLERY
				</Link>
				<div className={styles.hamburger}>
					<Hamburger
						toggled={showMobileMenu}
						duration={0.5}
						onToggle={setShowMobileMenu}
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
							<li id={`menu-${m.type}`} key={idx} onMouseOver={() => setSubMenu(m)}>
								{m.sub ? 
									<span onTouchEnd={() => setSubMenu(subMenu && subMenu.label === m.label ? undefined : m)}>{m.label}</span>
								: 
									<Link 
										href={m.path} 
										isSelected={m.isSelected} 
										onMouseEnter={() => handleMouseOver(m, true)} 
										onMouseLeave={() => handleMouseOver(m, false)}
									>
										{m.label}
									</Link>
								}
								{showMobileMenu && m.type === subMenu?.type && (
									<ul key={idx} id={`sub-${m.type}`} className={cn(subMenu?.type === m.type && styles.open)}>
										{m.sub}
										{m.more && !showMore[m.type] ?
												<div onClick={() => setShowMore({ ...showMore, [m.type]: !showMore[m.type]})}>
													Show all ›
												</div>
											:
											<>{m.more}</>
										}
									</ul>
								)}
							</li>
						))}
					</ul>
					<div className={styles.subMenu}>
						{menu.slice(1).map(
							({ type, path, label, sub, past, upcoming, current, more }, idx) => (sub && !showMobileMenu) &&
								<ul
									key={idx}
									id={`sub-${type}`}
									className={cn(subMenu?.type === type && styles.open)}
									style={{ marginLeft: `${subMenuMargin}px` }}
								>
									{sub}
									{more &&
										<li className={styles.more} >
											{more && !showMore[type] ?
												<div onClick={() => setShowMore({ ...showMore, [type]: !showMore[type] })}>
													Show all ›
												</div>
											:
											<>{more}</>
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
