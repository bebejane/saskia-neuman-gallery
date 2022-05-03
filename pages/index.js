import styles from './index.module.scss'
import useStore from '/store';
import { withGlobalProps } from "/lib/hoc";
import { imageColor, imageBrightness, rgbToHex } from '/utils';
import { GetStart } from '/graphql';
import { Image } from "react-datocms"
import cn from "classnames"
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Start({ start, image, color }) {

	const { links } = start;

	const isHoveringMenuItem = useStore((state) => state.isHoveringMenuItem)

	const linkType = ({_modelApiKey : model, startDate, endDate}) => {
		if(model === 'external_link')
			return 'News'
		if(new Date() >= new Date(startDate) && new Date() <= new Date(endDate))
			return 'Current'
		else if(new Date(startDate) > new Date() && new Date(endDate) > new Date())
			return 'Upcoming'
		else
			return 'Past'
	}

	useEffect(() => {
		const originalColor = document.body.style.backgroundColor;
		document.body.style.backgroundColor = color;
		return () => document.body.style.backgroundColor = originalColor;
	}, [])

	if (!links || !links.length) return null

	return (
		<div className={styles.container}>
			{links.map((link, idx) => {
				const type = linkType(link)
				const title = `${link.title} by ${link.artists?.length ? link.artists[0]?.name : ''}`
				const bubbleStyle = { color: `rgb(${imageColor(link.image).join(',')})` }
				const href = link._modelApiKey === 'external_link' ? link.url : `/${link._modelApiKey}s/${link.slug}`

				return (
					<Link key={idx} href={href} scroll={false}>
						<a className={styles.card}>
							{idx > 0 && link.image &&
								<Image
									className={styles.linkImage}
									data={(link.image || link.images[0])?.responsiveImage}
									prefetch={true}
								/>
							}
							<div className={cn(styles.headline, isHoveringMenuItem && styles.hide)}>
								<div className={styles.bubble} style={bubbleStyle}>
									<h3>{type}</h3>
									<h1>{title}</h1>
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