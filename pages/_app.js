import '/styles/index.scss'
import DatoSEO from '/lib/dato/components/DatoSEO';
import { GoogleAnalytics, usePagesViews } from "nextjs-google-analytics";
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  
  
  if(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) usePagesViews(); // Google Analytics page view tracker

  const router = useRouter()
  const { asPath : pathname } = router
  const { site, seo } = pageProps;
  
  return (
    <>
      <GoogleAnalytics />
      <DatoSEO seo={seo} site={site} pathname={pathname} key={pathname}/>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
