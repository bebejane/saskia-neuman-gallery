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
import useStore from "/store";

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
		color
	},
}) {
	
	if (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) usePagesViews(); // Google Analytics page view tracker

	const router = useRouter();
	const transitionFix = useTransitionFix()
	const setShowMobileMenu = useStore((state) => state.setShowMobileMenu);
	const { asPath: pathname } = router.asPath;
	const title = pathname === '/' ? '' : exhibition?.title || happening?.title || artist?.name || (about ? "About" : null);
		
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
			<Menu {...{start, artists, happenings, exhibitions, about, color, image }} key={`menu-${pathname}`}/>
			<AnimatePresence
				exitBeforeEnter
				initial={true}
				onExitComplete={() =>  {
					setShowMobileMenu(false)
					window.scrollTo({ top: 0, behavior:'instant' })
				}}
			>
				<div id="app" key={router.asPath}>
					<PageTransition image={image}/>
					<Background
						image={image}
						color={color}
						key={pathname}
						title={title}
					/>
					<Component {...{...pageProps}}/>
					<Footer {...pageProps} />
				</div>
			</AnimatePresence>
		</>
	);
}

export default SaskiaNeumanGallery;
