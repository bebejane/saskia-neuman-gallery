import "/styles/index.scss";
import DatoSEO from "/lib/dato/components/DatoSEO";
import { GoogleAnalytics, usePagesViews } from "nextjs-google-analytics";
import { useRouter } from "next/router";
import { useTransitionFix } from "/lib/hooks";
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
		shows,
		events,
		show,
		event,
		artist,
		about,
		image,
		color,
		brightness,
	},
}) {
	//console.log(pageProps)
	if (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) 
		usePagesViews(); // Google Analytics page view tracker

	const router = useRouter();
	const transitionFix = useTransitionFix()

	const { asPath: pathname } = router;
	const title = show?.title || event?.title || artist?.name || (about ? "About" : null);
		
	return (
		<>
			<GoogleAnalytics />
			<DatoSEO
				seo={seo}
				site={site}
				title={`Saskia Neumann Gallery${title ? ` — ${title}` : ''}`}
				pathname={pathname}
				key={pathname}
			/>
			<Menu {...{start, artists, shows, events, about, color, brightness, image }}/>
			<AnimatePresence
				exitBeforeEnter
				initial={true}
				onExitComplete={() =>  typeof window !== 'undefined' && window.scrollTo({ top: 0 })}
			>
				<div id="app" key={router.asPath}>
					<PageTransition image={image}/>
					<Background
						image={image}
						color={color}
						key={pathname}
						title={title}
						brightness={brightness}
					/>
					<Component {...{...pageProps}}/>
					<Footer {...pageProps} />
				</div>
			</AnimatePresence>
		</>
	);
}

export default SaskiaNeumanGallery;
