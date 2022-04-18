import styles from "./Menu.module.scss"
import Link from "next/link"
import cn from 'classnames'
import { useState, useEffect } from "react";
import { useRouter } from "next/router"
import { useWindowScrollPosition } from 'rooks'
import { useScrollDirection } from "use-scroll-direction";
import { Twirl as Hamburger } from 'hamburger-react'

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
  const { scrollY } = typeof window !== 'undefined' ? useWindowScrollPosition() : {scrollY:0}
  const { scrollDirection, isScrolling, isScrollingUp, isScrollingDown} = useScrollDirection();

  const showSeparator = subMenu && menu.filter(({sub, type}) => type === subMenu?.type).length
  const menuStyles = cn(styles.container, (subMenu || showMobileMenu) && styles.open, (!showMenu && ! showMobileMenu) && styles.hide)

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
    if(!el || !menu) return
    const padding = getComputedStyle(menu, null).getPropertyValue('padding-left')
    setSubMenuMargin(el.offsetLeft-parseInt(padding));
  }, [subMenu])

  useEffect(()=>{
    if(scrollDirection === 'NONE') return
    setShowMenu(scrollY < 100 || scrollDirection === 'UP')
	},[scrollY, scrollDirection])
	
  return (
    <>
      <div className={cn(styles.top, !showMenu && styles.hide)}>
        <Link href="/">SASKIA NEUMAN GALLERY</Link>
        <div className={styles.hamburger}>
          <Hamburger
            toggled={showMobileMenu}
            duration={0.5}
            onToggle={(toggle) => setShowMobileMenu(toggle)}
            color={'#000'}
            label={'Menu'}
            size={20}
          />
        </div>
      </div>
      <div 
        id="menu" 
        className={menuStyles} 
        onMouseLeave={()=>setSubMenu()}
      >
        <div className={cn(styles.menu)}>
          <ul>
            {menu.map((m, idx) => 
              <li 
                id={`menu-${m.type}`} 
                key={idx} 
                className={cn(router.asPath === m.path && styles.selected)} 
                onMouseOver={()=> setSubMenu(m)
              }>
                {m.sub  ? 
                  <a onClick={()=> setSubMenu(m)}>{m.label}</a>
                : 
                  <Link href={m.path}><a>{m.label}</a></Link> 
                }
                {showMobileMenu && m.type === subMenu?.type &&
                  <ul 
                    key={idx}
                    id={`sub-${m.type}`} 
                    className={cn(subMenu?.type === m.type && styles.open)} 
                  >
                    {m.sub?.map((a, idx) => 
                      <Link href={`${m.path}/${a.slug}`}>
                        <li key={idx}>
                          <a>{a.name || a.title}</a>
                        </li>
                      </Link>
                    )}
                  </ul>
                }
              </li>
            )}
          </ul>
          <div className={cn(styles.subMenu)}>
            {menu.map(({type, path, label, sub}, idx) => sub && !showMobileMenu &&
              <ul 
                key={idx}
                id={`sub-${type}`} 
                className={cn(subMenu?.type === type && styles.open)} 
                style={{marginLeft: `${subMenuMargin}px`}}
              >
                {sub.map((a, idx) => 
                  <li key={idx}>
                    <Link href={`${path}/${a.slug}`}>
                      <a>{a.name || a.title}</a>
                    </Link>
                  </li>
                )}
              </ul>
            )}
          </div>
          <div 
            className={cn(styles.separator, showSeparator && styles.show)} 
            style={{marginLeft:`${subMenuMargin-0}px`}}
          ></div>
        </div>
      </div>
      
    </>
  )
}