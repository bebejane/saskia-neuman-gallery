import "/styles/index.scss";
import DatoSEO from "/lib/dato/components/DatoSEO";
import { GoogleAnalytics, usePagesViews } from "nextjs-google-analytics";
import { useRouter } from "next/router";
import PageTransition from "/components/PageTransition";
import Menu from "/components/Menu";
import Background from "/components/Background";
import Footer from "/components/Footer";
import { AnimatePresence } from "framer-motion";

function SaskiaNeumanGallery({
	Component,
	pageProps,
	pageProps: {
		site,
		seo,
		start,
		artists,
		exhibitions,
		exhibition,
		happenings,
		happening,
		artist,
		about,
		image,
		color,
	},
}) {
	if (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) usePagesViews(); // Google Analytics page view tracker

	const router = useRouter();
	//const transitionFix = useTransitionFix()
	const { asPath: pathname } = router;
	const isHome = !pathname || pathname === "/";
	const title = isHome
		? ""
		: exhibition?.title ||
		  happening?.title ||
		  (artist ? `${artist.firstName} ${artist.lastName}` : undefined) ||
		  (pathname === "/about" ? "About" : null);
	const backgroundLink = start?.links?.[0].slug
		? `/${start.links[0]._modelApiKey}s/${start.links[0].slug}`
		: start?.links?.[0].url || null;
	const isSingleLinkHome = isHome && pageProps.start?.links?.length === 1;

	return (
		<>
			<GoogleAnalytics />
			<DatoSEO
				seo={seo}
				site={site}
				title={`Saskia Neuman Gallery${title ? ` — ${title}` : ""}`}
				pathname={pathname}
				key={pathname}
			/>
			<Menu {...{ start, artists, happenings, exhibitions, about, color, image }} key={`menu`} />
			<AnimatePresence exitBeforeEnter initial={true}>
				<div id="app" key={pathname}>
					<PageTransition image={image} />
					<Background
						image={image}
						color={color}
						key={pathname}
						title={title}
						href={isHome ? backgroundLink : undefined}
						fullHeight={isSingleLinkHome}
					/>
					<Component {...{ ...pageProps }} />
					<Footer {...pageProps} />
				</div>
			</AnimatePresence>
		</>
	);
}

export default SaskiaNeumanGallery;
