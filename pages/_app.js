import '/styles/index.scss'
import 'swiper/css';
import DatoSEO from '/lib/dato/components/DatoSEO';
import { GoogleAnalytics, usePagesViews } from "nextjs-google-analytics";
import { useRouter } from 'next/router';
import Menu from '/components/Menu';
import Background from '/components/Background';
import Footer from '/components/Footer';

function MyApp({ Component, pageProps }) {

  if(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) usePagesViews(); // Google Analytics page view tracker

  const router = useRouter()
  const { asPath : pathname } = router
  const { site, seo, artists, shows, events, image, images, color } = pageProps;
  
  return (
    <>
      <GoogleAnalytics />
      <DatoSEO seo={seo} site={site} pathname={pathname} key={pathname}/>
      <Menu {...{artists, shows, events}}/>
      <Background image={image ? image : images ? images[0] : null} color={color} key={pathname}/>
      <Component {...pageProps} />
      <Footer {...pageProps}/>
    </>
  )
}

export default MyApp
