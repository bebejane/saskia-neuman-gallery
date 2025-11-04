import s from './page.module.scss';
import { Image } from 'react-datocms';
import { Markdown } from 'next-dato-utils/components';
import { imageColor } from '@/lib/utils';
import { Article, Meta, Content } from '@/components/Article';
import PrivacyPolicy from '@/components/PrivacyPolicy';
import { HeaderBar } from '@/components/HeaderBar';
import { format } from 'date-fns';
//import { useState } from 'react';
import { AboutDocument, AllExternalLinksDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function About() {
	const { about } = await apiQuery(AboutDocument);

	if (!about) return notFound();

	const { allExternalLinks } = await apiQuery(AllExternalLinksDocument, { all: true });
	const { description, address, hours, phone, email, googleMapsUrl, image } = about || {};

	return (
		<>
			<Article image={image as FileField} noMargin={true}>
				<Meta border={true} sticky={false}>
					<HeaderBar>
						<h3>Contact</h3>
					</HeaderBar>

					<b>
						{address && <Markdown content={address} />}
						{googleMapsUrl && (
							<a href={googleMapsUrl} target='new'>
								View in Google Maps ↗
							</a>
						)}
						<br />
						<br />
						Phone: {phone}
						<br />
						<br />
						Opening hours:
						<br />
						{hours && <Markdown content={hours} />}
						<br />
						<a href={`mailto:${email}`}>{email}</a>
						<br />
						<span className={s.instaWrap}>
							<img className={s.instagram} src='/img/instagram.svg'></img>
							<a href='https://www.instagram.com/saskianeumangallerystockholm/' target='new'>
								@saskianeumangallerystockholm
							</a>
						</span>
					</b>
					<br />
				</Meta>

				<Content>
					<HeaderBar>
						<h1>About</h1>
					</HeaderBar>
					{description && <Markdown content={description} />}
				</Content>

				<section className={s.archive}>
					<h2>Archive</h2>
					<ul>
						{allExternalLinks?.map(({ title, url, image, _createdAt }, idx) => (
							<a key={idx} href={url} target='new'>
								<li>
									{image.responsiveImage && (
										<Image data={image.responsiveImage} className={s.image} intersectionMargin='0px 0px 100% 0px' />
									)}
									<h4>{format(new Date(_createdAt), 'dd.MM.yy')}</h4>
									<h1>{title} ↗</h1>
								</li>
							</a>
						))}
					</ul>
				</section>
				<section className={s.colophon}>
					<div className={s.text}>
						<span>
							Copyright ©2022 Saskia Neuman Gallery · <Link href={'/privacy'}>Privacy Policy</Link>
						</span>
						<a href='http://www.konst-teknik.se/' target='new'>
							Designed and developed by Konst & Teknik
						</a>
					</div>
				</section>
			</Article>
		</>
	);
}
