import styles from "./index.module.scss";
import useStore from "/lib/store";
import { withGlobalProps } from "/lib/hoc";
import { imageColor, datePeriod } from "/lib/utils";
import { GetStart } from "/graphql";
import { Image } from "react-datocms";
import cn from "classnames";
import { useEffect } from "react";
import Link from "/components/Link";

export default function Start({ start, image, color }) {
	const { links } = start;

	const isHoveringMenuItem = useStore((state) => state.isHoveringMenuItem);
	const setBackgroundColor = useStore((state) => state.setBackgroundColor);

	const linkType = ({ _modelApiKey: model, startDate, endDate }) =>
		model === "external_link" ? "news" : datePeriod(startDate, endDate);

	useEffect(() => {
		const originalColor = document.body.style.backgroundColor;
		document.body.style.backgroundColor = color;
		return () => (document.body.style.backgroundColor = originalColor);
	}, []);

	const handleMouseOver = (item, hovering) =>
		setBackgroundColor(hovering ? imageColor(item.image) : null);

	if (!links || !links.length) return null;

	return (
		<div className={styles.container}>
			{links.map(
				({ title, artists, image, url, slug, startDate, endDate, _modelApiKey: model }, idx) => {
					const type = model === "external_link" ? "news" : datePeriod(startDate, endDate);
					const byArtists = artists?.length
						? ` — ${artists
								.map(({ firstName, lastName }) => `${firstName} ${lastName}`)
								.join(", ")}`
						: "";
					const href = model === "external_link" ? url : `/${model}s/${slug}`;
					const theme = image.customData.theme;

					return (
						<Link
							key={idx}
							href={href}
							image={image}
							color={imageColor(image)}
							className={styles.card}
							target={type === "news" ? "_blank" : "_self"}
						>
							{idx > 0 && image && (
								<Image
									className={cn(styles.linkImage)}
									data={(image || images[0])?.responsiveImage}
									prefetch={true}
								/>
							)}
							<div
								className={cn(styles.headline, isHoveringMenuItem && styles.hide, styles[theme])}
							>
								<div className={styles.bubble}>
									<h3>{type}</h3>
									<h1>
										{title}
										<span>{byArtists}</span>
									</h1>
									{type === "news" && <span className={styles.link}>↗</span>}
								</div>
							</div>
						</Link>
					);
				}
			)}
		</div>
	);
}

export const getStaticProps = withGlobalProps(
	{ queries: [GetStart], model: "start" },
	async ({ props, revalidate }) => {
		const { links } = props.start;
		const image = links[0]?.image
			? links[0].image
			: links[0]?.images?.length
			? links[0]?.images[0]
			: null;

		return {
			props: {
				...props,
				image,
				color: imageColor(image),
			},
			revalidate,
		};
	}
);
