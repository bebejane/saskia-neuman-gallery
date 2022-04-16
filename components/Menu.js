import styles from "./Menu.module.scss"
import Link from "next/link"
import cn from 'classnames'
import { useState, useEffect } from "react";
import { useRouter } from "next/router"
import { Twirl as Hamburger } from 'hamburger-react'

export default function Menu({artists, shows, events}){
  const router = useRouter()
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [subMenu, setSubMenu] = useState();

  const menu = [
    {type:'artist', path:'/artists', label:'Artists', sub:artists}, 
    {type:'show', path:'/shows', label:'Shows', sub:shows}, 
    {type:'event', path:'/events', label:'Events', sub:events}, 
    {type:'about', path:'/about', label:'About'}
  ]

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
          {menu.map(({type, path, label, sub}) => 
            <li className={router.asPath === path && styles.selected} onMouseOver={()=> setSubMenu(type)}>
              {!sub  ? 
                <Link href={path}><a>{label}</a></Link> 
              : 
                <>
                  <a onClick={()=> setSubMenu(subMenu ? null : type)}>{label}</a>
                  {subMenu === type && 
                    <ul className={cn(styles.subMenu)}>
                      {sub.map(a => 
                        <li>
                          <Link href={`${path}/${a.slug}`}>
                            <a>{a.name || a.title}</a>
                          </Link>
                        </li>
                      )}
                    </ul>
                  }
                </>
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