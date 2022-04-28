import "/styles/index.scss";
import "swiper/css";
import useStore from "/store";
import DatoSEO from "/lib/dato/components/DatoSEO";
import { GoogleAnalytics, usePagesViews } from "nextjs-google-analytics";
import { useRouter } from "next/router";
import { useTransitionFix } from "/lib/hoc/useTransitionFix";
import PageTransition from "/components/PageTransition";
import Menu from "/components/Menu";
import Background from "/components/Background";
import Footer from "/components/Footer";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";

function SaskiaNeumanGallery({
	Component,
	pageProps,
	pageProps: {
		site,
		seo,
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
	
	if (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) usePagesViews(); // Google Analytics page view tracker

	const router = useRouter();
	const transitionFix = useTransitionFix()
	const { backgroundImage, setBackgroundImage, backgroundColor, setBackgroundColor} = useStore((state) => state);
	const { asPath: pathname } = router;
	const title = show?.title || event?.title || artist?.name || (about ? "About" : null);
	
	useState(()=>{ setBackgroundImage(image); setBackgroundColor(color);}, [image, color])
	useState(()=> setBackgroundImage(backgroundImage || image), [backgroundImage, image])
	useState(()=> setBackgroundColor(backgroundColor || color), [backgroundColor, color])
	
	return (
		<>
			<GoogleAnalytics />
			<DatoSEO
				seo={seo}
				site={site}
				title={`Saskia Neumann Gallery${title ? ` · ${title}` : ''}`}
				pathname={pathname}
				key={pathname}
			/>
			<Menu {...{artists, shows, events, about, color, brightness, image }}/>
			<AnimatePresence
				exitBeforeEnter
				initial={true}
				onExitComplete={() =>  typeof window !== 'undefined' && window.scrollTo({ top: 0 })}
			>
				<div key={router.asPath}>
					<PageTransition/>
					<Background
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
