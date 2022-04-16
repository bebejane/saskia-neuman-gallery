import '/styles/index.scss'
import DatoSEO from '/lib/dato/components/DatoSEO';
import { GoogleAnalytics, usePagesViews } from "nextjs-google-analytics";
import { useRouter } from 'next/router';
import Menu from '/components/Menu';
import Background from '/components/Background';

function MyApp({ Component, pageProps }) {

  if(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) usePagesViews(); // Google Analytics page view tracker

  const router = useRouter()
  const { asPath : pathname } = router
  const { site, seo, artists, shows, events, image, images, color } = pageProps;
  console.log(pageProps)
  return (
    <>
      <GoogleAnalytics />
      <DatoSEO seo={seo} site={site} pathname={pathname} key={pathname}/>
      <Menu {...{artists, shows, events}}/>
      <Background image={image ? image : images ? images[0] : null} color={color}/>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
