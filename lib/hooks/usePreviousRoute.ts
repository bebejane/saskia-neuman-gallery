import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const usePreviousRoute = () => {
  
  const storage = globalThis.sessionStorage
  const router = useRouter()
  const [prevRoute, setPrevRoute] = useState(typeof storage !== 'undefined' ? storage.getItem('previousRoute') : null)

	useEffect(()=>{
    const prevRoute = storage.getItem('currentRoute');
    if (prevRoute === router.asPath) return
    storage.setItem('previousRoute', prevRoute)
    storage.setItem("currentRoute", router.asPath);
    setPrevRoute(prevRoute)
	}, [router.asPath, storage])	

  useEffect(()=>{
    const handleWindowReload = (e) => {
      storage.removeItem('previousRoute')
      storage.removeItem("currentRoute")
    }
    window.addEventListener('beforeunload', handleWindowReload)
    return () => window.removeEventListener('beforeunload', handleWindowReload)
  })


  return prevRoute
};

export default usePreviousRoute