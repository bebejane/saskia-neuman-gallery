import "/styles/index.scss";
import "swiper/css";
import DatoSEO from "/lib/dato/components/DatoSEO";
import { GoogleAnalytics, usePagesViews } from "nextjs-google-analytics";
import { useRouter } from "next/router";
import { useTransitionFix } from "/lib/hoc/useTransitionFix";

import Menu from "/components/Menu";
import Background from "/components/Background";
import Footer from "/components/Footer";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";

function MyApp({
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
		menu,
	},
}) {
	if (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) usePagesViews(); // Google Analytics page view tracker

	const router = useRouter();
	const transitionFix = useTransitionFix()
	const [backgroundColor, setBackgroundColor] = useState(color);
	const [backgroundImage, setBackgroundImage] = useState(image);
	const [isHovering, setIsHovering] = useState(false);

	const { asPath: pathname } = router;
	const title = show?.title || event?.title || artist?.name || (about ? "About" : null);

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
			<Menu
				{...{ menu: menu || [], artists, shows, events, color, brightness }}
				onColorChange={(c) => setBackgroundColor(c)}
				isHovering={isHovering}
				onHover={(item, hovering) =>{
          hovering ? setBackgroundImage(item.image) : setBackgroundImage(image)
          setIsHovering(hovering)
        }}
			/>
			<AnimatePresence
				exitBeforeEnter
				//initial={true}	
				onExitComplete={() => typeof window !== "undefined" && window.scrollTo({ top: 0 })}
			>
			<Background
				image={backgroundImage}
				color={backgroundColor}
				key={pathname}
				title={title}
				brightness={brightness}
			/>
		</AnimatePresence>
			<Component {...{...pageProps, isHovering}}/>
			<Footer {...pageProps} />	
		</>
	);
}

export default MyApp;
