import styles from "./Menu.module.scss";
import Link from "/components/Link";
import cn from "classnames";
import useStore from "/store";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useWindowScrollPosition, useDebounce } from "rooks";
import useScrollInfo from "/lib/hooks/useScrollInfo";
import { Twirl as Hamburger } from "hamburger-react";
import { imageColor, datePeriod } from "/utils";
import { format } from 'date-fns'

const generateMenu = ({ start, artists, happenings, exhibitions, about }, path) => {
	
	if (!artists || !happenings || !exhibitions || !about || !start) return []

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
				type: "exhibition",
				path: "/exhibitions",
				label: "Exhibitions",
				more: true,
				current: exhibitions.find(({ startDate, endDate }) => datePeriod(startDate, endDate) === 'current'),
				upcoming: exhibitions.filter(({ startDate, endDate }) => datePeriod(startDate, endDate) === 'upcoming')[0],
				past: exhibitions.filter(({ startDate, endDate }) => datePeriod(startDate, endDate) === 'past')[0],
				sub: [
					exhibitions.find(({ startDate, endDate }) => datePeriod(startDate, endDate) === 'current'),
					exhibitions.filter(({ startDate, endDate }) => datePeriod(startDate, endDate) === 'upcoming')[0],
					exhibitions.filter(({ startDate, endDate }) => datePeriod(startDate, endDate) === 'past')[0]
				].filter(i => i).map(s => ({ ...s, slug: `exhibitions/${s.slug}` })),
				all: exhibitions.map((s) => ({ ...s, slug: `exhibitions/${s.slug}`, color: imageColor(s.image) })),
			},
			{
				type: "happening",
				path: "/happenings",
				label: "Happenings",
				more: true,
				sub: [
					happenings.filter(({ startDate, endDate }) => datePeriod(startDate, endDate) === 'upcoming')[0],
					happenings.filter(({ startDate, endDate }) => datePeriod(startDate, endDate) === 'past')[0]
				].filter(i => i).map(s => ({ ...s, slug: `happenings/${s.slug}` })),
				all: happenings.map((e) => ({ ...e, slug: `happenings/${e.slug}`, color: imageColor(e.image) })),
			},
			{
				type: "about",
				path: "/about",
				label: "About",
				more: false,
				about: about,
				sub: [{ name: 'The Gallery', image: about.image, color: imageColor(about.image), slug: 'about' }]
			},
		].map((m) => ({
			...m,
			image: m.sub ? m.sub[0]?.image : m.image,
			color: imageColor(m.sub ? m.sub[0]?.image : m.image),
			isSelected: !m.sub && m.path === path,
			sub: m.sub?.map((s) => ({ ...s, isSelected: `/${s.slug}` === path, color: imageColor(s.image) }))
		}));
		return menu;
	} catch (err) {
		console.error(err)
		return [];
	}
};

export default function Menu(props) {

	const { image } = props;
	const router = useRouter();
	const setBackgroundImage = useStore((state) => state.setBackgroundImage);
	const setBackgroundColor = useStore((state) => state.setBackgroundColor);
	const setIsHoveringMenuItem = useStore((state) => state.setIsHoveringMenuItem);
	const isHoveringMenuItem = useStore((state) => state.isHoveringMenuItem);
	const isTransitioning = useStore((state) => state.isTransitioning);
	const showMenu = useStore((state) => state.showMenu);
	const setShowMenu = useStore((state) => state.setShowMenu);

	const showMobileMenu = useStore((state) => state.showMobileMenu);
	const setShowMobileMenu = useStore((state) => state.setShowMobileMenu);

	const imageTheme = image?.customData.theme || 'light'
	const [darkTheme, setDarkTheme] = useState(false);
	const [subMenu, setSubMenu] = useState();
	const [menuBackground, setMenuBackground] = useState(false);
	const [subMenuMargin, setSubMenuMargin] = useState(0);
	const [separatorMargin, setSeparatorMargin] = useState(0);
	const [showMore, setShowMore] = useState({ event: false, show: false, artist: false });
	const { scrollY } = typeof window !== "undefined" ? useWindowScrollPosition() : { scrollY: 0 };
	const { isPageBottom, isScrolledUp, scrolledPosition, isPageTop } = useScrollInfo();

	
	
	const handleMouseOver = (item, hovering) => {
		setIsHoveringMenuItem(hovering);
		setBackgroundImage(hovering ? item.image : null);
	};

	useEffect(() => setDarkTheme(imageTheme === 'dark'), [imageTheme])
	useEffect(() => { setShowMenu((isScrolledUp && !isPageBottom) || isPageTop) }, [scrolledPosition, isPageBottom, isPageTop, isScrolledUp]);
	useEffect(() => {
		const handleRouteChange = (url, { shallow }) => {
			const subs = [];
			menu.filter(({ sub }) => sub).forEach(({ sub }) => subs.push.apply(subs, sub));

			const next =
				subs.filter(({ slug }) => `/${slug}` === url)[0] ||
				menu.filter(({ path }) => path === url)[0] || menu.filter(({ path }) => path === url)[0]

			if (next)
				setBackgroundColor(next.color)
		};

		const handleRouteChangeComplete = (url, { shallow }) => {
			setTimeout(() => {
				setShowMenu(true)
				setSubMenu(undefined)
			}, 600)
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

		if (scrollY > threshold && darkTheme)
			setDarkTheme(false)
		else if (scrollY < threshold && !darkTheme)
			setDarkTheme(true)

		setMenuBackground(scrollY > (main.offsetTop - menu.offsetTop))
	}, [scrollY, darkTheme]);

	const menu = generateMenu(props, router.asPath).map(m => ({
		...m,
		sub: m.sub?.map((item, idx) => (
			<>
				<Link key={`sub-${idx}`} href={`/${item.slug}`} color={item.color} isSelected={item.isSelected} image={item.image}>
					<li
						onMouseEnter={() => handleMouseOver(item, true)}
						onMouseLeave={() => handleMouseOver(item, false)}
					>
						{m.type === 'artist' || m.type === 'about' ?
							<>{item.name || item.title}</>
							:
							<>
								<h3>{datePeriod(item.startDate, item.endDate)}</h3>
								{item.artists && item.artists?.map((a, idx) => a.name).join(', ')}{item.artists && <br />}
								<i>{item.title}</i><br />
								{format(new Date(item.startDate), 'dd.MM')}—{format(new Date(item.endDate), 'dd.MM.yyyy')}
							</>
						}
					</li>
				</Link>
				{m.type === 'about' && idx === m.sub.length - 1 &&
					<li className={styles.contact}>
						<h3>Contact</h3>
						Linnégatan 19
						<p>{m.about.phone}</p>
						<p><a href={m.about.googleMapsUrl} target="new">Google Maps ↗</a></p>
					</li>
				}
			</>
		)),
		more: m.more && m.sub?.map(item =>
			m.sub.map((item, idx) =>
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
						{item.artists && item.artists?.map((a) => a.name).join(', ')}{item.artists && <br />}
						<i>{item.title}</i>
						{m.type === 'event' ? <><br />{format(new Date(item.startDate), 'dd.MM')}—{format(new Date(item.endDate), 'dd.MM.yyyy')}</> : ''}
					</p>
				</Link>
			)
		)
	}))

	const exhibitionseparator = subMenu && showMenu && menu.filter(({ sub, type }) => type === subMenu?.type).length;
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
				<Link href={'/'} id="logo" className={styles.logo}>
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
							<li id={`menu-${m.type}`} key={`menu-${idx}`} onMouseOver={() => setSubMenu(m)}>
								{m.sub ?
									<span onTouchEnd={() => setSubMenu(subMenu && subMenu.label === m.label ? undefined : m)}>{m.label}</span>
									:
									<Link
										href={m.path}
										isSelected={m.isSelected}
										image={m.image}
										onMouseEnter={() => handleMouseOver(m, true)}
										onMouseLeave={() => handleMouseOver(m, false)}
									>
										{m.label}
									</Link>
								}
								{showMobileMenu && m.type === subMenu?.type && (
									<ul key={idx} id={`sub-${m.type}`} className={cn(subMenu?.type === m.type && styles.open)}>
										{m.sub}
										{m.more &&
											<li className={styles.more} >
												<div onClick={() => setShowMore({ ...showMore, [m.type]: !showMore[m.type] })}>
													<h3>More <div className={cn(styles.arrow, showMore[m.type] && styles.opened)}>›</div></h3>
												</div>
												{showMore[m.type] && m.more}
											</li>
										}
									</ul>
								)}
							</li>
						))}
					</ul>
					<div className={styles.subMenu}>
						{menu.slice(1).map(
							({ type, sub, more }, idx) => (sub && !showMobileMenu) &&
								<ul
									key={idx}
									id={`sub-${type}`}
									className={cn(subMenu?.type === type && styles.open)}
									style={{ marginLeft: `${subMenuMargin}px` }}
								>
									{sub}
									{more &&
										<li className={styles.more} >
											<div onClick={() => setShowMore({ ...showMore, [type]: !showMore[type] })}>
												<h3>More <div className={cn(styles.arrow, showMore[type] && styles.opened)}>›</div></h3>
											</div>
											{showMore[type] && more}
										</li>
									}
								</ul>
						)}
					</div>
				</div>
				<div
					id="menu-separator"
					className={cn(styles.separator, exhibitionseparator && styles.show)}
					style={{ marginLeft: `${separatorMargin}px` }}
				></div>
			</div>
		</>
	);
}
