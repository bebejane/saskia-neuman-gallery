import styles from './index.module.scss'
import useStore from '/store';
import { withGlobalProps } from "/lib/hoc";
import { imageColor, imageBrightness, rgbToHex, datePeriod } from '/utils';
import { GetStart } from '/graphql';
import { Image } from "react-datocms"
import cn from "classnames"
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Start({ start, image, color }) {

	const { links } = start;

	const isHoveringMenuItem = useStore((state) => state.isHoveringMenuItem)

	const linkType = ({ _modelApiKey: model, startDate, endDate }) => {
		if (model === 'external_link')
			return 'news'
		else
			return datePeriod(startDate, endDate)
	}

	useEffect(() => {
		const originalColor = document.body.style.backgroundColor;
		document.body.style.backgroundColor = color;
		return () => document.body.style.backgroundColor = originalColor;
	}, [])
	console.log(start)
	if (!links || !links.length) return null

	return (
		<div className={styles.container}>
			{links.map(({ title, artists, image, url, slug, startDate, endDate, _modelApiKey: model }, idx) => {

				const type = model === 'external_link' ? 'news' : datePeriod(startDate, endDate)
				const byArtists = artists?.length ? ` by ${artists.map(({ name }) => name).join(', ')}` : ''
				const bubbleStyle = { color: `rgb(${imageColor(image).join(',')})` }
				const href = model === 'external_link' ? url : `/${model}s/${slug}`

				return (
					<Link key={idx} href={href} scroll={false} image={image}>
						<a className={styles.card} target={type === 'news' ? '_blank' : '_self'}>
							{idx > 0 && image &&
								<Image
									className={styles.linkImage}
									data={(image || images[0])?.responsiveImage}
									prefetch={true}
								/>
							}
							<div className={cn(styles.headline, isHoveringMenuItem && styles.hide)}>
								<div className={styles.bubble}>
									<h3>{type}</h3>
									<h1>{title}<span>{byArtists}</span></h1>
									{type === 'news' && <span className={styles.link}>↗</span>}
								</div>
							</div>
						</a>
					</Link>
				)
			}
			)}
		</div>
	)
}

export const getStaticProps = withGlobalProps({ queries: [GetStart], model: 'start' }, async ({ props, revalidate }) => {
	const { links } = props.start
	const image = links[0]?.image ? links[0].image : links[0]?.images?.length ? links[0]?.images[0] : null

	return {
		props: {
			...props,
			image,
			color: imageColor(image),
			brightness: await imageBrightness(image)
		},
		revalidate
	};
});