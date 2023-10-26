import styles from "./Footer.module.scss";
import useStore from "/lib/store";
import Link from "/components/Link";
import { HeaderBar } from "components/HeaderBar";
import { imageColor } from "/lib/utils";
import cn from "classnames";

export default function Footer(props) {
	const { exhibition, happening, artist } = props;
	const setBackgroundImage = useStore((state) => state.setBackgroundImage);
	const type = exhibition ? "exhibition" : happening ? "happening" : artist ? "artist" : null;

	if (!type || props[type + "s"].length <= 1) return null;

	let nextIndex = 0; // Get the next index
	props[type + "s"].forEach(
		({ slug }, idx) =>
			slug === props[type].slug && (nextIndex = idx + 1 === props[type + "s"].length ? 0 : idx + 1)
	);

	const next = props[type + "s"][nextIndex];
	const label = next.title || `${next.firstName} ${next.lastName}`;
	const slug = `/${type}s/${next.slug}`;

	return (
		<footer className={styles.footer}>
			<div className={styles.wrapper}>
				<div className={styles.next}>
					<HeaderBar>
						<Link href={slug} scroll={false} color={imageColor(next.image)} image={next.image}>
							<h3
								onMouseEnter={() => setBackgroundImage(next.image)}
								onMouseLeave={() => setBackgroundImage(null)}
							>
								Next {type}
							</h3>
						</Link>
					</HeaderBar>
				</div>
				<div className={styles.label}>
					<HeaderBar>
						<b>
							<Link href={slug} scroll={false} color={imageColor(next.image)} image={next.image}>
								<span
									onMouseEnter={() => setBackgroundImage(next.image)}
									onMouseLeave={() => setBackgroundImage(null)}
								>
									{label}
								</span>
							</Link>
						</b>
					</HeaderBar>
				</div>
			</div>
		</footer>
	);
}
