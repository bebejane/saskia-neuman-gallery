import '/styles/index.scss'
import DatoSEO from '/lib/dato/components/DatoSEO';
import { GoogleAnalytics, usePagesViews } from "nextjs-google-analytics";
import { useRouter } from 'next/router';
import Menu from '/components/Menu';

function MyApp({ Component, pageProps }) {

  if(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) usePagesViews(); // Google Analytics page view tracker

  const router = useRouter()
  const { asPath : pathname } = router
  const { site, seo, artists } = pageProps;
  
  return (
    <>
      <GoogleAnalytics />
      <DatoSEO seo={seo} site={site} pathname={pathname} key={pathname}/>
      <Menu artists={artists}/>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
