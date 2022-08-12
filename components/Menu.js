import styles from "./Menu.module.scss";
import Link from "/components/Link";
import cn from "classnames";
import useStore from "/store";
import { useState, useEffect, Fragment } from "react";
import { useRouter } from "next/router";
import { useWindowScrollPosition } from "rooks";
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
				sub: artists.map((a) => ({ ...a, slug: `artists/${a.slug}`, color: imageColor(a.image) })).sort((a, b) => a.lastName > b.lastName ? 1 : -1),
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
	const isExiting = useStore((state) => state.isExiting);
	const showMenu = useStore((state) => state.showMenu);
	const setShowMenu = useStore((state) => state.setShowMenu);

	const showMobileMenu = useStore((state) => state.showMobileMenu);
	const setShowMobileMenu = useStore((state) => state.setShowMobileMenu);

	const imageTheme = image?.customData.theme || 'light'
	const [darkTheme, setDarkTheme] = useState(false);
	const [hoverSubMenu, setHoverSubMenu] = useState();
	const [subMenu, setSubMenu] = useState();
	const [subMenuMobile, setSubMenuMobile] = useState();
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

	useEffect(() => { setDarkTheme(imageTheme === 'dark')}, [imageTheme])
	useEffect(() => { // Toggle menu bar on scroll
		setShowMenu((isScrolledUp && !isPageBottom) || isPageTop)
	}, [scrolledPosition, isPageBottom, isPageTop, isScrolledUp]);

	useEffect(() => { // Set Background image on route start change
		setIsHoveringMenuItem(false)

		const handleRouteChange = (url, { shallow }) => {
			const subs = [];
			menu.filter(({ sub }) => sub).forEach(({ sub }) => subs.push.apply(subs, sub));

			const next =
				subs.filter(({ slug }) => `/${slug}` === url)[0] ||
				menu.filter(({ path }) => path === url)[0] || menu.filter(({ path }) => path === url)[0]

			if (next)
				setBackgroundColor(next.color)
		};
		router.events.on("routeChangeStart", handleRouteChange);
		return () => {
			router.events.off("routeChangeStart", handleRouteChange)
		};
	}, []);

	useEffect(() => { // Update separator and sub menu margin

		const el = document.getElementById(`menu-${subMenu?.type}`);
		const menuWrapper = document.getElementById("menu-wrapper");
		if (!el || !menu) return;

		const padding = getComputedStyle(menuWrapper, null).getPropertyValue("padding-left");
		setSubMenuMargin(el.offsetLeft);
		setSeparatorMargin(el.offsetParent?.offsetLeft + el.offsetLeft - parseInt(padding));
		
	}, [subMenu]);

	useEffect(() => { // Toggle dark/light logo on scroll after fold

		const logo = document.getElementById('logo')
		const main = document.getElementById('main')
		const menu = document.getElementById('menu')
		
		if (!main || !logo || !menu) 
			return setMenuBackground(false)

		const logoStyle = getComputedStyle(logo, null);
		const logoHeight = parseInt(logoStyle.getPropertyValue("height")) - parseInt(logoStyle.getPropertyValue("padding-top"))	
		const threshold = main.offsetTop - (logoHeight * 2);
		
		if (scrollY > threshold && darkTheme && imageTheme === 'dark')
			setDarkTheme(false)
		else if (scrollY < threshold)
			setDarkTheme(imageTheme === 'dark')

		setMenuBackground(scrollY > (main.offsetTop - menu.offsetTop))

	}, [scrollY, darkTheme, imageTheme]);

	useEffect(() => { // Hide mobile menu after exiting
		if(showMobileMenu && !isExiting){
			setSubMenu(undefined)
			setShowMobileMenu(false)
		}
	}, [isExiting])

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
							<>{item.firstName ? `${item.firstName} ${item.lastName}` : item.title || item.name}</>
							:
							<>
								<h3>{datePeriod(item.startDate, item.endDate)}</h3>
								{item.artists && item.artists?.map((a, idx) => `${a.firstName} ${a.lastName}`).join(', ')}{item.artists && <br />}
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
						<p>Stockholm</p>
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
						{item.artists && item.artists?.map((a) => `${a.firstName} ${a.lastName}`).join(', ')}{item.artists && <br />}
						<i>{item.title}</i>
						{m.type === 'event' ? <><br />{format(new Date(item.startDate), 'dd.MM')}—{format(new Date(item.endDate), 'dd.MM.yyyy')}</> : ''}
					</p>
				</Link>
			)
		)
	}))

	const showSeparator = subMenu && showMenu && menu.filter(({ sub, type }) => type === subMenu?.type).length;
	const navbarStyles = cn(styles.navbar, (!showMenu && !showMobileMenu) && styles.hide, (darkTheme && !(subMenu || showMobileMenu)) && styles.dark);
	const menuWrapperStyles = cn(
		styles.menuWrapper,
		darkTheme && !(subMenu || showMobileMenu) ? styles.dark : styles.light,
		((showMobileMenu) || (subMenu && showMenu && subMenuMargin > 0)) && styles.open,
		((!showMenu && !showMobileMenu) || (isExiting && !showMobileMenu)) && styles.hide,
		isHoveringMenuItem && styles.transparent
	);

	const menuStyles = cn(
		styles.menu,
		showMobileMenu && styles.show, 
		menuBackground && !isTransitioning && !isHoveringMenuItem && styles.opaque
	)

	if (!menu || menu.length === 0) return null
	
	return (
		<>
			<div className={navbarStyles}>
				<Link href={'/'} className={styles.logo}>
					<div id="logo">SASKIA NEUMAN GALLERY</div>
				</Link>
				<div className={styles.hamburger}>
					<Hamburger
						toggled={showMobileMenu}
						duration={0.5}
						onToggle={setShowMobileMenu}
						color={"#000"}
						label={"Menu"}
						size={17}
					/>
				</div>
			</div>
			<div id="menu-wrapper" className={menuWrapperStyles}>
				<div id={'menu'} className={menuStyles} onMouseLeave={() => setSubMenu()}>
					<ul>
						{menu.slice(1).map((m, idx) => (
							<li 
								id={`menu-${m.type}`} 
								key={`menu-${idx}`} 
								onClick={() => setSubMenu(subMenu?.type === m.type ? undefined : m)}
								onMouseEnter={() => setHoverSubMenu(m)}
								onMouseLeave={() => setHoverSubMenu(undefined)}
							>
								<span onTouchEnd={() => setSubMenuMobile(subMenuMobile && subMenuMobile.label === m.label ? undefined : m)}>
									{m.label} <span className={cn(styles.arrow, subMenu?.type === m.type && styles.open, hoverSubMenu?.type !== m.type && styles.hide)}>›</span>
								</span>
								{showMobileMenu && m.type === subMenuMobile?.type && (
									<ul key={`mobile-list-${idx}`} id={`sub-${m.type}`} className={cn(subMenuMobile?.type === m.type && styles.open)}>
										{m.sub.length > 0 ? 
											m.sub	
										:
											'To be announced...'
										}
										{m.more && m.sub?.length > 0 &&
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
					<div className={cn(styles.subMenu, subMenuMargin > 0 && styles.show)}>
						{menu.slice(1).map(
							({ type, sub, more }, idx) => (sub && !showMobileMenu) &&
								<ul
									key={`submenu-${idx}`}
									id={`sub-${type}`}
									className={cn(subMenu?.type === type && styles.open)}
									style={{ marginLeft: `${subMenuMargin}px` }}
								>
									{sub.length > 0 ? 
											sub.map((s, idx) => <Fragment key={`sub-desktop-${idx}`}>{s}</Fragment>)
										:
											<li>To be announced...</li>
										}
									
									{more && sub?.length > 0 	&& 
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
					className={cn(styles.separator, separatorMargin > 0 && showSeparator && styles.show)}
					style={{ marginLeft: `${separatorMargin}px` }}
				></div>
			</div>
		</>
	);
}
