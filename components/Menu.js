import styles from "./Menu.module.scss"
import Link from "next/link"
import cn from 'classnames'
import { useState, useEffect } from "react";
import { useRouter } from "next/router"
import { Twirl as Hamburger } from 'hamburger-react'

const menu = [
  {path:'/artists', label:'Artists', sub:true}, 
  {path:'/shows', label:'Shows'}, 
  {path:'/events', label:'Events'}, 
  {path:'/about', label:'About'}
]

export default function Menu({artists}){
  const router = useRouter()
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [subMenu, setSubMenu] = useState();

  useEffect(()=>{
    const handleRouteChange = (url, { shallow }) => setShowMobileMenu(false)
    router.events.on('routeChangeStart', handleRouteChange)
    return () => router.events.off('routeChangeStart', handleRouteChange)
  }, [router.asPath])
  
  return (
    <div id="menu" className={cn(styles.container, showMobileMenu && styles.open)}>
      <div className={styles.logo}>
        <Link href="/">SASKIA NEUMAN GALLERY</Link>
      </div>
      <div className={cn(styles.menu)}>
        <ul>
          {menu.map(({path, label, sub}) => 
            <li className={router.asPath === path && styles.selected}>
              {!sub || !showMobileMenu ? 
                <Link href={path}><a>{label}</a></Link> 
              : 
                <a onClick={()=> setSubMenu(subMenu ? null : label.toLowerCase())}>{label}</a>
              }
              
              {path === '/artists' && subMenu === 'artists' &&
                <ul className={cn(styles.subMenu, subMenu === 'artists' && subMenu)}>
                  {artists.map(a => <li><Link href={`/artists/${a.slug}`}><a>{a.name}</a></Link></li>)}
                </ul>
              } 
            </li>
          )}
        </ul>
      </div>
      <Hamburger
        toggled={showMobileMenu}
        duration={0.5}
        onToggle={(toggle) => setShowMobileMenu(toggle)}
        color={'#000'}
        label={'Menu'}
        size={20}
      />
    </div>
  )
}