import s from './page.module.scss';
import { StartDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import { DraftMode } from 'next-dato-utils/components';
import { imageColor, datePeriod } from '@/lib/utils';
import { Image } from 'react-datocms';
import cn from 'classnames';
import Link from '@/components/Link';
import { Article } from '@/components/Article';

export default async function Home({}: PageProps<'/'>) {
	const { start, draftUrl } = await apiQuery(StartDocument);
	const links = start?.links.splice(0, 5);

	if (!links || !links.length) return null;

	const cover = links[0];
	const image = cover?.image ?? null;
	const path =
		cover.__typename === 'HappeningRecord'
			? `/happenings`
			: cover.__typename === 'ExhibitionRecord'
				? `/exhibitions`
				: null;

	const href = cover?.__typename === 'ExternalLinkRecord' ? cover.url : `${path}/${cover.slug}`;

	return (
		<>
			<Article
				image={image as FileField}
				href={href}
				noMargin={true}
				isHome={true}
				color={[255, 255, 255]}
			>
				<div className={s.container}>
					{links?.map((link, idx) => {
						const t = link.__typename;
						const image = link.image;
						const target = t === 'ExternalLinkRecord' ? '_blank' : '_self';
						const theme = t !== 'ExternalLinkRecord' ? link.image.customData?.theme : '';
						const type =
							t === 'ExternalLinkRecord' ? 'news' : datePeriod(link.startDate, link.endDate);
						const path =
							t === 'HappeningRecord'
								? `/happenings`
								: t === 'ExhibitionRecord'
									? `/exhibitions`
									: null;
						const href = t === 'ExternalLinkRecord' ? link.url : `${path}/${link.slug}`;
						const subtitle =
							t === 'ExhibitionRecord'
								? ` — ${link.artists.map(({ firstName, lastName }) => `${firstName} ${lastName}`).join(', ')}`
								: null;

						return (
							<Link
								key={idx}
								href={href}
								image={image as FileField}
								color={imageColor(image as FileField)}
								className={s.card}
								target={target}
							>
								{idx > 0 && image?.responsiveImage && (
									<Image
										className={s.linkImage}
										data={image.responsiveImage}
										intersectionMargin='0px 0px 100% 0px'
									/>
								)}
								<div className={cn(s.headline, s[theme])}>
									<div className={s.bubble}>
										<h3>{type}</h3>
										<h1>
											{link.title}
											{subtitle && <span>{subtitle}</span>}
										</h1>
										{t === 'ExternalLinkRecord' && <span className={s.link}>↗</span>}
									</div>
								</div>
							</Link>
						);
					})}
				</div>
			</Article>
			<DraftMode url={draftUrl} path='/' />
		</>
	);
}
