'use client';

import s from './MenuMobile.module.scss';
import Link from '@/components/Link';
import cn from 'classnames';
import { useStore, useShallow } from '@/lib/store';
import { use, useEffect, useState } from 'react';
import { Twirl as Hamburger } from 'hamburger-react';
import { MenuItem } from '@/lib/menu';
import React from 'react';
import { usePathname } from 'next/navigation';

export default function MenuMobile({ menu, image }: { menu: MenuItem[]; image: any }) {
	const pathname = usePathname();
	const [showMobileMenu, setShowMobileMenu, transition] = useStore(
		useShallow((s) => [s.showMobileMenu, s.setShowMobileMenu, s.transition])
	);
	const imageTheme = image?.customData.theme || 'light';
	const [darkTheme, setDarkTheme] = useState(false);
	const [subMenu, setSubMenu] = useState<MenuItem | null>(null);
	const navItems = menu.filter(({ __typename }) => __typename !== 'StartRecord');

	useEffect(() => {
		setShowMobileMenu(transition === 'exit' || false);
	}, [transition, pathname]);

	return (
		<>
			<div className={cn(s.navbar, darkTheme && !subMenu && s.dark)}>
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
			<div className={cn(s.wrapper, showMobileMenu && s.open)}>
				<nav className={s.menu}>
					<ul>
						{navItems.map((m, idx) => (
							<li id={`menu-${m.__typename}`} key={`menu-${idx}`}>
								<div onClick={() => setSubMenu(subMenu?.__typename === m.__typename ? null : m)}>
									<span>{m.label}</span>
									<span className={cn(s.arrow, subMenu?.__typename === m.__typename && s.open)}>›</span>
								</div>
								{m.sub && (
									<ul
										id={`sub-mobile-${m.__typename}`}
										key={`submenu-${idx}`}
										className={cn(s.sub, subMenu?.__typename === m.__typename && s.open)}
									>
										{m.sub?.map(({ color, href, selected, title, text, date, period, __typename }, idx) => (
											<React.Fragment key={idx}>
												<Link key={`sub-${idx}`} href={href} color={color} selected={selected} image={image}>
													<li data-type={__typename}>
														{m.__typename === 'ArtistRecord' || m.__typename === 'AboutRecord' ? (
															<span>{title}</span>
														) : (
															<>
																<h3>{period}</h3>
																{text}

																<i>{title}</i>
																<br />
																{date}
															</>
														)}
													</li>
												</Link>
												{__typename === 'AboutRecord' && (
													<li className={s.contact}>
														<h3>Contact</h3>
														Linnégatan 19
														<p>Stockholm</p>
														<p className={s.narrowHide}>{title}</p>
														<p className={s.narrowHide}>
															<a href={href} target='new'>
																Google Maps ↗
															</a>
														</p>
													</li>
												)}
											</React.Fragment>
										))}
										{/*m.more && m.more.length > 0 && (
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
																<p>
																	<h3>{period}</h3>
																	{text}
																	<br />
																	<i>{title}</i>
																	<br />
																	{date}
																</p>
															</Link>
														))}
												</li>
											)*/}
									</ul>
								)}
							</li>
						))}
					</ul>
				</nav>
			</div>
		</>
	);
}
