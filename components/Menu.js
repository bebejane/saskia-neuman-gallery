import styles from "./Menu.module.scss";
import Link from "next/link";
import cn from "classnames";
import useStore from "/store";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useWindowScrollPosition, useWindowSize } from "rooks";
import { useScrollDirection } from "use-scroll-direction";
import { Twirl as Hamburger } from "hamburger-react";
import { imageColor } from "/lib/utils";

const generateMenu = ({ artists, events, shows, about }) => {
	try {
		const menu = [
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
				sub: shows.map((s) => ({ ...s, slug: `shows/${s.slug}`, color: imageColor(s.image) })),
			},
			{
				type: "event",
				path: "/events",
				label: "Events",
				sub: events.map((e) => ({ ...e, slug: `events/${e.slug}`, color: imageColor(e.image) })),
			},
			{ type: "about", path: "/about", label: "About", image: about.image },
		].map((m) => ({
			...m,
			image: m.sub ? m.sub[0]?.image : m.image,
			color: imageColor(m.sub ? m.sub[0]?.image : m.image),
		}));
		return menu;
	} catch (err) {
		return [];
	}
};

export default function Menu(props) {
	
	const { image, brightness } = props;
	const menu = generateMenu(props);
	const router = useRouter();

	const setBackgroundImage = useStore((state) => state.setBackgroundImage);
	const setIsHoveringMenuItem = useStore((state) => state.setIsHoveringMenuItem);
	const isHoveringMenuItem = useStore((state) => state.isHoveringMenuItem);

	const [showMobileMenu, setShowMobileMenu] = useState(false);
	const [darkTheme, setDarkTheme] = useState(brightness < 0.35);
	const [subMenu, setSubMenu] = useState();
	const [showMenu, setShowMenu] = useState(true);
	const [subMenuMargin, setSubMenuMargin] = useState(0);
	const [separatorMargin, setSeparatorMargin] = useState(0);
	const { scrollY } = typeof window !== "undefined" ? useWindowScrollPosition() : { scrollY: 0 };
	const { scrollDirection } = useScrollDirection();

	const showSeparator = subMenu && menu.filter(({ sub, type }) => type === subMenu?.type).length;
	const menuStyles = cn(
		styles.menuWrapper,
		darkTheme ? styles.dark : styles.light,
		(subMenu || showMobileMenu) && styles.open,
		!showMenu && !showMobileMenu && styles.hide,
		isHoveringMenuItem && styles.transparent
	);

	const navbarStyles = cn(
		styles.navbar,
		!showMenu && !showMobileMenu && styles.hide,
		darkTheme && styles.dark
	);
	
	const handleMouseOver = (item, hovering) => {
		setBackgroundImage(hovering ? item.image : image);
		setIsHoveringMenuItem(hovering);
	};

	useEffect(() => {
		const handleRouteChange = (url, { shallow }) => {
			const subs = [];
			menu.filter(({ sub }) => sub).forEach(({ sub }) => subs.push.apply(subs, sub));
			const next = subs.filter(({ slug }) => `/${slug}` === url)[0] || menu.filter(({ path }) => path === url)[0] || menu.filter(({ path }) => path === url)[0];

			if (next){
				handleMouseOver(next, true);
			}

			setShowMobileMenu(false);
			setSubMenu(undefined);
		};
		router.events.on("routeChangeStart", handleRouteChange);
		return () => router.events.off("routeChangeStart", handleRouteChange);
	}, [router.asPath]);

	useEffect(() => {
		const el = document.getElementById(`menu-${subMenu?.type}`);
		const menuWrapper = document.getElementById("menu-wrapper");
		if (!el || !menu) return;

		const padding = getComputedStyle(menuWrapper, null).getPropertyValue("padding-left");
		setSeparatorMargin(el.offsetParent.offsetLeft + el.offsetLeft - parseInt(padding));
		setSubMenuMargin(el.offsetLeft);
	}, [subMenu]);

	useEffect(() => (scrollDirection !== "NONE" || scrollY < 50) && setShowMenu(scrollY < 50 || scrollDirection === "UP"), [scrollY, scrollDirection]);

	useEffect(() => {
		
		const logo = document.getElementById('logo')
		const main = document.getElementById('main')
		
		if(!main || !logo) return 
		
		const threshold = main.offsetTop - logo.clientHeight;
		
		if(scrollY > threshold && darkTheme && brightness < 0.35)
			setDarkTheme(false)
		else if(scrollY < threshold && !darkTheme && brightness < 0.35)
			setDarkTheme(true)

	}, [scrollY, darkTheme, brightness]);

	return (
		<>
			<div className={navbarStyles}>
				<Link href="/">
					<a id="logo" className={cn(styles.logo)}>SASKIA NEUMAN GALLERY</a>
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
						{menu.map((m, idx) => (
							<li
								id={`menu-${m.type}`}
								key={idx}
								className={cn(router.asPath === m.path && styles.selected)}
								onMouseOver={() => setSubMenu(m)}
							>
								{m.sub ? (
									<a onClick={() => setSubMenu(m)}>{m.label}</a>
								) : (
									<Link href={m.path} scroll={false}>
										<a
											onMouseEnter={() => handleMouseOver(m, true)}
											onMouseLeave={() => handleMouseOver(m, false)}
										>
											{m.label}
										</a>
									</Link>
								)}
								{showMobileMenu && m.type === subMenu?.type && (
									<ul
										key={idx}
										id={`sub-${m.type}`}
										className={cn(subMenu?.type === m.type && styles.open)}
									>
										{m.sub?.map((a, idx) => (
											<Link key={idx} href={`/${a.slug}`} scroll={false}>
												<li>
													<a>{a.name || a.title}</a>
												</li>
											</Link>
										))}
									</ul>
								)}
							</li>
						))}
					</ul>
					<div className={styles.subMenu}>
						{menu.map(
							({ type, path, label, sub }, idx) =>
								sub &&
								!showMobileMenu && (
									<ul
										key={idx}
										id={`sub-${type}`}
										className={cn(subMenu?.type === type && styles.open)}
										style={{ marginLeft: `${subMenuMargin}px` }}
									>
										{sub.map((a, idx) => (
											<li
												key={idx}
												onMouseEnter={() => handleMouseOver(a, true)}
												onMouseLeave={() => handleMouseOver(a, false)}
											>
												<Link href={`/${a.slug}`} scroll={false}>
													<a>{a.name || a.title}</a>
												</Link>
											</li>
										))}
									</ul>
								)
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
