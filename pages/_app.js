import '/styles/index.scss'
import 'swiper/css';
import DatoSEO from '/lib/dato/components/DatoSEO';
import { GoogleAnalytics, usePagesViews } from "nextjs-google-analytics";
import Router, { useRouter } from 'next/router';
import Menu from '/components/Menu';
import Background from '/components/Background';
import Footer from '/components/Footer';
import { AnimatePresence } from "framer-motion";
import { useState }from 'react'

// Bugfix for framer-motion page transition - https://github.com/vercel/next.js/issues/17464
const routeChange = () => {const allStyleElems = document.querySelectorAll('style[media="x"]'); allStyleElems.forEach((elem) => elem.removeAttribute("media"))};
Router.events.on("routeChangeComplete", routeChange);
Router.events.on("routeChangeStart", routeChange);

function MyApp({ Component, pageProps, pageProps: { site, seo, artists, shows, events, show, event, artist, about, image, color, brightness, menu }}) {

  if(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) usePagesViews(); // Google Analytics page view tracker

  const router = useRouter()
  const [backgroundColor, setBackgroundColor] = useState(color)
  const [backgroundImage, setBackgroundImage] = useState(image)

  const { asPath : pathname } = router  
  const title = show?.title || event?.title || artist?.name || (about ? 'About' : null )

  return (
    <>
      <GoogleAnalytics />
      <DatoSEO seo={seo} site={site} title={`Saskia Neumann Gallery${title ? ` · ${title}` : ''}`} pathname={pathname} key={pathname}/>
      <Menu 
        {...{menu: menu || [], artists, shows, events, color, brightness}} 
        onColorChange={(c)=>setBackgroundColor(c)}
        onHover={(item, hovering) => hovering ? setBackgroundImage(item.image) : setBackgroundImage(image)}
      />
      <AnimatePresence 
        exitBeforeEnter
        initial={true}
        onExitComplete={() => typeof window !== 'undefined' && window.scrollTo({ top: 0 })}
      >
        <Background 
          image={backgroundImage}
          color={backgroundColor}
          key={pathname} 
          title={title} 
          brightness={brightness} 
        />
      </AnimatePresence>
      <Component {...pageProps}/>
      <Footer {...pageProps}/>
    </>
  )
}

export default MyApp
