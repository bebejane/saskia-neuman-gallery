import styles from "./About.module.scss";
import { withGlobalProps } from "/lib/hoc";
import { GetAbout } from "/graphql";
import { Image } from "react-datocms";
import Markdown from "/lib/dato/components/Markdown";
import { imageColor } from "/lib/utils";
import { Layout, Meta, Content } from "/components/Layout";
import PrivacyPolicy from "/components/PrivacyPolicy";
import { HeaderBar } from "components/HeaderBar";
import { format } from "date-fns";
import { useState } from "react";

export default function About({ aboutGallery, externalLinks }) {
	const { description, address, hours, phone, email, googleMapsUrl, privacyPolicy } =
		aboutGallery || {};
	const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

	return (
		<>
			<Layout noMargin="true">
				<Meta border="true">
					<HeaderBar>
						<h3>Contact</h3>
					</HeaderBar>
					<p>
						<b>
							<Markdown>{address}</Markdown>
							<a href={googleMapsUrl} target="new">
								View in Google Maps ↗
							</a>
							<br />
							<br />
							Phone: {phone}
							<br />
							<br />
							Opening hours:
							<br />
							<Markdown>{hours}</Markdown>
							<br />
							<a href={`mailto:${email}`}>{email}</a>
							<br />
							<span className={styles.instaWrap}>
								<img className={styles.instagram} src="/img/instagram.svg"></img>
								<a href="https://www.instagram.com/saskianeumangallerystockholm/" target="new">
									@saskianeumangallerystockholm
								</a>
							</span>
						</b>
						<br />
					</p>
				</Meta>
				<Content>
					<HeaderBar>
						<h1>About</h1>
					</HeaderBar>
					<Markdown>{description}</Markdown>
				</Content>
			</Layout>

			<Layout noMargin={true} hide={externalLinks?.length === 0}>
				<section className={styles.archive}>
					<h2>Archive</h2>
					<ul>
						{externalLinks?.map(({ title, url, image, _createdAt }, idx) => (
							<a key={idx} href={url} target="new">
								<li>
									<Image
										data={image.responsiveImage}
										className={styles.image}
										intersectionMargin="0px 0px 100% 0px"
									/>
									<h4>{format(new Date(_createdAt), "dd.MM.yy")}</h4>
									<h1>{title} ↗</h1>
								</li>
							</a>
						))}
					</ul>
				</section>
			</Layout>

			<Layout noMargin={true} hide={externalLinks?.length === 0}>
				<section className={styles.colophon}>
					<div className={styles.text}>
						<span>
							Copyright ©2022 Saskia Neuman Gallery ·{" "}
							<a href="#privacy" onClick={() => setShowPrivacyPolicy(true)}>
								Privacy policy
							</a>
						</span>
						<a href="http://www.konst-teknik.se/" target="new">
							Designed and developed by Konst & Teknik
						</a>
					</div>
				</section>
			</Layout>

			{showPrivacyPolicy && (
				<PrivacyPolicy content={privacyPolicy} onClose={() => setShowPrivacyPolicy(false)} />
			)}
		</>
	);
}

export const getStaticProps = withGlobalProps(
	{ queries: [GetAbout], model: "about" },
	async ({ props, revalidate }) => {
		const { image } = props.about;

		return {
			props: {
				...props,
				image: image || null,
				color: imageColor(image),
			},
			revalidate,
		};
	}
);
