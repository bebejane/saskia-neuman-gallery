import s from './page.module.scss';
import { StartDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
//import useStore from '@/lib/store';
import { imageColor, datePeriod } from '@/lib/utils';
import { Image } from 'react-datocms';
import cn from 'classnames';
//import { useEffect } from 'react';
import Link from '@/components/Link';

//import { Block } from '@/components';
import { DraftMode } from 'next-dato-utils/components';
import { Layout } from '@/components/Layout';

export default async function Home() {
	const { start, draftUrl } = await apiQuery(StartDocument);
	const links = start?.links.splice(0, 3);

	const isHoveringMenuItem = false; //useStore((state) => state.isHoveringMenuItem);
	//const isHoveringMenuItem = useStore((state) => state.isHoveringMenuItem);
	//const setBackgroundColor = useStore((state) => state.setBackgroundColor);

	//const linkType = ({ _modelApiKey: model, startDate, endDate }) =>
	//model === 'external_link' ? 'news' : datePeriod(startDate, endDate);

	/*
	useEffect(() => {
		const originalColor = document.body.style.backgroundColor;
		document.body.style.backgroundColor = color;
		return () => (document.body.style.backgroundColor = originalColor);
	}, []);

	const handleMouseOver = (item, hovering) => setBackgroundColor(hovering ? imageColor(item.image) : null);
*/
	if (!links || !links.length) return null;

	return (
		<div className={s.container}>
			{links?.map(({ title, artists, image, url, slug, startDate, endDate, _modelApiKey: model }, idx) => {
				const type = model === 'external_link' ? 'news' : datePeriod(startDate, endDate);
				const byArtists = artists?.length
					? ` — ${artists.map(({ firstName, lastName }) => `${firstName} ${lastName}`).join(', ')}`
					: '';
				const href = model === 'external_link' ? url : `/${model}s/${slug}`;
				const theme = image.customData.theme;

				return (
					<Link
						key={idx}
						href={href}
						image={image}
						color={imageColor(image)}
						className={s.card}
						target={type === 'news' ? '_blank' : '_self'}
					>
						{idx > 0 && image && (
							<Image
								className={cn(s.linkImage)}
								data={(image || images[0])?.responsiveImage}
								//prefetch={true}
								intersectionMargin='0px 0px 100% 0px'
							/>
						)}
						<div className={cn(s.headline, isHoveringMenuItem && s.hide, s[theme])}>
							<div className={s.bubble}>
								<h3>{type}</h3>
								<h1>
									{title}
									<span>{byArtists}</span>
								</h1>
								{type === 'news' && <span className={s.link}>↗</span>}
							</div>
						</div>
					</Link>
				);
			})}
		</div>
	);
}
