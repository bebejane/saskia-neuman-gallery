'use client';

import s from './MenuMobile.module.scss';
import Link from '@/components/Link';
import cn from 'classnames';
import { useStore, useShallow } from '@/lib/store';
import { use, useEffect, useState } from 'react';
import { Twirl as Hamburger } from 'hamburger-react';
import { findtMenuItem, MenuItem } from '@/lib/menu';
import React from 'react';
import { usePathname } from 'next/navigation';
import { Markdown } from 'next-dato-utils/components';

export default function MenuMobile({ menu, image }: { menu: MenuItem[]; image: any }) {
	const pathname = usePathname();
	const [showMobileMenu, setShowMobileMenu, transition] = useStore(
		useShallow((s) => [s.showMobileMenu, s.setShowMobileMenu, s.transition])
	);
	const imageTheme = image?.customData.theme || 'light';
	const [darkTheme, setDarkTheme] = useState(false);
	const [subMenu, setSubMenu] = useState<MenuItem | null>(null);
	const [showMore, setShowMore] = useState({ ExhibitionRecord: false, HappeningRecord: false });
	const selected = findtMenuItem(menu, pathname);
	const navItems = menu.filter(({ __typename }) => __typename !== 'StartRecord');

	useEffect(() => {
		setShowMobileMenu(false);
	}, [pathname]);

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
						{navItems.map((item, idx) => (
							<li
								id={`menu-${item.__typename}`}
								key={`menu-${idx}`}
								onClick={() => setSubMenu(subMenu?.__typename === item.__typename ? null : item)}
							>
								<div>
									<span>{item.label}</span>
									<span className={cn(s.arrow, subMenu?.__typename === item.__typename && s.open)}>
										›
									</span>
								</div>
								{item.sub && item.__typename === 'ArtistRecord' ? (
									<ul className={cn(s.sub, subMenu?.__typename === item.__typename && s.open)}>
										<h3 className={s.margin}>Representing</h3>
										{item.sub
											.filter(({ data }) => data?.exhibiting === false)
											.map((sub, idx) => (
												<li key={`sub-${idx}`} className={cn()}>
													<Link
														href={sub.href}
														color={sub.color}
														selected={selected?.id === sub.id}
														image={item.image}
													>
														{sub.title}
													</Link>
												</li>
											))}
										<h3 className={s.margin}>Exhibiting</h3>
										{item.sub
											.filter(({ data }) => data?.exhibiting === true)
											.map((sub, idx) => (
												<li key={`sub-${idx}`} className={cn()}>
													<Link
														href={sub.href}
														color={sub.color}
														selected={selected?.id === sub.id}
														image={item.image}
													>
														{sub.title}
													</Link>
												</li>
											))}
									</ul>
								) : (
									<ul
										id={`sub-mobile-${item.__typename}`}
										key={`submenu-${idx}`}
										className={cn(s.sub, subMenu?.__typename === item.__typename && s.open)}
									>
										{item.sub?.map((sub, idx) => (
											<li
												key={`sub-${idx}`}
												className={cn(sub.__typename === 'AboutRecord' && s.abou, s.about)}
											>
												{item.__typename !== 'AboutRecord' ? (
													<Link
														href={sub.href}
														color={sub.color}
														selected={selected?.id === sub.id}
														image={item.image}
													>
														{sub.period && <h3>{sub.period}</h3>}
														{sub.text && (
															<>
																{sub.text}
																<br />
															</>
														)}
														{item.__typename === 'ArtistRecord' ? (
															<span>{sub.title}</span>
														) : (
															<i>{sub.title}</i>
														)}
														{sub.date && (
															<>
																<br />
																{sub.date}
															</>
														)}
													</Link>
												) : (
													<>
														<Link
															href={'/about'}
															color={sub.color}
															selected={selected?.id === sub.id}
															image={item.image}
															onClick={(e) => {
																e.stopPropagation();
															}}
														>
															About
														</Link>

														<h3>Contact</h3>
														<Markdown content={item.data.address} disableBreaks={true} />
														<a className={s.mail} href={`mailto:${item.data.email}`}>
															{item.data.email}
														</a>
														<br />
														<a href={item.data.phone}>{item.data.phone}</a>
														<br />
														<h3>Happenings</h3>
														<Link
															href={sub.href}
															color={sub.color}
															selected={selected?.id === sub.id}
															image={item.image}
														>
															{sub.title}
														</Link>
													</>
												)}
											</li>
										))}
										{item.more && item.more.length > 0 && (
											<li className={s.more}>
												<button
													role='switch'
													aria-checked={
														showMore[item.more?.[0].__typename as keyof typeof showMore]
															? 'true'
															: 'false'
													}
													onClick={(e) => {
														e.stopPropagation();
														setShowMore((prev) => {
															const t = item.more?.[0].__typename as keyof typeof showMore;
															return {
																...prev,
																[t]: !showMore[t],
															};
														});
													}}
												>
													<h3>
														More{' '}
														<span
															className={cn(s.arrow, showMore[item.more[0].__typename] && s.opened)}
														>
															›
														</span>
													</h3>
												</button>
												<ul>
													{showMore[item.more[0].__typename] &&
														item.more.map((more, idx) => (
															<li key={`more-${idx}`}>
																<Link
																	href={more.href}
																	color={more.color}
																	selected={selected?.id === more.id}
																	image={image}
																>
																	{more.text && (
																		<>
																			{more.text}
																			<br />
																		</>
																	)}
																	<i>{more.title}</i>
																	<br />
																	{more.date}
																</Link>
															</li>
														))}
												</ul>
											</li>
										)}
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
