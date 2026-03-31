'use client';

import s from './StartLink.module.scss';
import cn from 'classnames';
import { imageColor, datePeriod } from '@/lib/utils';
import { Image } from 'react-datocms';
import Link from '@/components/Link';

type StartLinkProps = AllExhibitionsQuery['allExhibitions'][number];

export function StartLink(exhibition: StartLinkProps) {
	const { title, image, startDate, endDate, slug, artists, _editingUrl } = exhibition;
	const target = '_self';
	const theme = image?.customData?.theme ?? '';
	const type = datePeriod(startDate, endDate);
	const href = `/exhibitions/${slug}`;
	const subtitle = ` — ${artists.map(({ firstName, lastName }) => `${firstName} ${lastName}`).join(', ')}`;

	return (
		<Link
			href={href}
			className={s.link}
			image={image as FileField}
			color={imageColor(image as FileField)}
			target={target}
			data-datocms-content-link-url={_editingUrl}
			data-datocms-content-link-boundary
		>
			{image?.responsiveImage && (
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
						{title}
						{subtitle && <span>{subtitle}</span>}
					</h1>
				</div>
			</div>
		</Link>
	);
}
