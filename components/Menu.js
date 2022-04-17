import styles from "./Menu.module.scss"
import Link from "next/link"
import cn from 'classnames'
import { useState, useEffect } from "react";
import { useRouter } from "next/router"
import { Twirl as Hamburger } from 'hamburger-react'
import {useWindowScrollPosition } from 'rooks'

export default function Menu({artists, shows, events}){
  
  const menu = [
    {type:'artist', path:'/artists', label:'Artists', sub:artists}, 
    {type:'show', path:'/shows', label:'Shows', sub:shows}, 
    {type:'event', path:'/events', label:'Events', sub:events}, 
    {type:'about', path:'/about', label:'About'}
  ]

  const router = useRouter()
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [subMenu, setSubMenu] = useState();
  const [showMenu, setShowMenu] = useState(true);
  const [subMenuMargin, setSubMenuMargin] = useState(0);
  const { scrollY } = useWindowScrollPosition()
  console.log(scrollY)
  const showSeparator = subMenu && menu.filter(({sub, type}) => type === subMenu?.type ).length

  useEffect(()=>{
    const handleRouteChange = (url, { shallow }) => {
      setShowMobileMenu(false)
      setSubMenu(undefined)
    }
    router.events.on('routeChangeStart', handleRouteChange)
    return () => router.events.off('routeChangeStart', handleRouteChange)
  }, [router.asPath])
  
  useEffect(()=>{
    const el = document.getElementById(`menu-${subMenu?.type}`)
    const menu = document.getElementById('menu')
    if(!el) return
    const padding = getComputedStyle(menu, null).getPropertyValue('padding-left')
    setSubMenuMargin(el.offsetLeft-parseInt(padding));
  }, [subMenu])

  return (
    <>
      <div className={styles.logo}>
        <Link href="/">SASKIA NEUMAN GALLERY</Link>
      </div>
      <div id="menu" className={cn(styles.container, (subMenu || showMobileMenu) && showSeparator && styles.open, scrollY > 100 && styles.hide)} onMouseLeave={()=>setSubMenu()}>
        <div className={cn(styles.menu)}>
          <ul>
            {menu.map(m => 
              <li id={`menu-${m.type}`} className={router.asPath === m.path && styles.selected} onMouseOver={()=> setSubMenu(m)}>
                {m.sub  ? 
                  <a onClick={()=> setSubMenu(subMenu ? null : m)}>{m.label}</a>
                : 
                  <Link href={m.path}><a>{m.label}</a></Link> 
                }
              </li>
            )}
          </ul>
          <div className={cn(styles.subMenu)}>
            {menu.map(({type, path, label, sub}) => 
              <ul 
                id={`sub-${type}`} 
                className={cn(subMenu?.type === type && styles.open)} 
                style={{marginLeft: `${subMenuMargin}px`}}
              >
                {sub?.map(a => 
                  <li>
                    <Link href={`${path}/${a.slug}`}>
                      <a>{a.name || a.title}</a>
                    </Link>
                  </li>
                )}
              </ul>
            )}
          </div>
          <div className={cn(styles.line, showSeparator && styles.show)} style={{marginLeft:`${subMenuMargin-0}px`}}></div>
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
    </>
  )
}