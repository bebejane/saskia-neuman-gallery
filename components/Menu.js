import styles from "./Menu.module.scss"
import Link from "next/link"
import cn from 'classnames'
import { useState, useEffect } from "react";
import { useRouter } from "next/router"
import { useWindowScrollPosition } from 'rooks'
import { useScrollDirection } from "use-scroll-direction";
import { Twirl as Hamburger } from 'hamburger-react'

export default function Menu({menu, artists, shows, events, color, brightness, onColorChange, onHover}){
  
  const router = useRouter()
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [subMenu, setSubMenu] = useState();
  const [showMenu, setShowMenu] = useState(true);
  const [subMenuMargin, setSubMenuMargin] = useState(0);
  const [separatorMargin, setSeparatorMargin] = useState(0);
  const { scrollY } = typeof window !== 'undefined' ? useWindowScrollPosition() : {scrollY:0}
  const { scrollDirection } = useScrollDirection();
  
  const isDarkTheme = brightness < 0.5;
  const showSeparator = subMenu && menu.filter(({sub, type}) => type === subMenu?.type).length
  const menuStyles = cn(styles.menuWrapper, isDarkTheme ? styles.dark : styles.light, (subMenu || showMobileMenu) && styles.open, (!showMenu && ! showMobileMenu) && styles.hide)
  const navbarStyles = cn(styles.navbar, !showMenu && !showMobileMenu && styles.hide, isDarkTheme && styles.dark)
  

  useEffect(()=>{
    const handleRouteChange = (url, { shallow }) => {
      const subs = []
      menu.filter(({sub}) => sub).forEach(({sub}) => subs.push.apply(subs, sub))
      const next = subs.filter(({slug}) => `/${slug}` === url)[0] || menu.filter(({path}) => path === url)[0] || menu.filter(({path}) => path === url)[0]
      
      if(next) {
        onColorChange(next.color)
        onHover(next, true)
      }
      setShowMobileMenu(false)
      setSubMenu(undefined)
    }
    router.events.on('routeChangeStart', handleRouteChange)
    return () => router.events.off('routeChangeStart', handleRouteChange)
  }, [router.asPath])
  
  useEffect(()=>{
    const el = document.getElementById(`menu-${subMenu?.type}`)
    const menuWrapper = document.getElementById('menu-wrapper')
    if(!el || !menu) return
    const padding = getComputedStyle(menuWrapper, null).getPropertyValue('padding-left')
    setSeparatorMargin(el.offsetParent.offsetLeft+el.offsetLeft-parseInt(padding));
    setSubMenuMargin(el.offsetLeft)
  }, [subMenu])

  useEffect(()=> scrollDirection !== 'NONE' && setShowMenu(scrollY < 100 || scrollDirection === 'UP'),[scrollY, scrollDirection])
  
  return (
    <>
      <div className={navbarStyles}>
        <Link href="/">SASKIA NEUMAN GALLERY</Link>
        <div className={styles.hamburger}>
          <Hamburger
            toggled={showMobileMenu}
            duration={0.5}
            onToggle={(toggle) => setShowMobileMenu(toggle)}
            color={isDarkTheme ? '#fff' : '#000'}
            label={'Menu'}
            size={20}
          />
        </div>
      </div>
      <div id="menu-wrapper" className={menuStyles}>
        <div className={cn(styles.menu, showMobileMenu && styles.show)} onMouseLeave={()=>setSubMenu()}>
          <ul>
            {menu.map((m, idx) => 
              <li 
                id={`menu-${m.type}`} 
                key={idx} 
                className={cn(router.asPath === m.path && styles.selected)} 
                onMouseOver={()=> setSubMenu(m)}
              >
                {m.sub  ? 
                  <a onClick={()=> setSubMenu(m)}>{m.label}</a>
                : 
                  <Link href={m.path}>
                    <a onMouseEnter={()=>onHover(m, true)} onMouseLeave={()=>onHover(m, false)}>{m.label}</a>
                  </Link> 
                }
                {showMobileMenu && m.type === subMenu?.type &&
                  <ul 
                    key={idx}
                    id={`sub-${m.type}`} 
                    className={cn(subMenu?.type === m.type && styles.open)} 
                  >
                    {m.sub?.map((a, idx) => 
                      <Link key={idx} href={`/${a.slug}`}>
                        <li>
                          <a>{a.name || a.title}</a>
                        </li>
                      </Link>
                    )}
                  </ul>
                }
              </li>
            )}
          </ul>
          <div className={styles.subMenu}>
            {menu.map(({type, path, label, sub}, idx) => sub && !showMobileMenu &&
              <ul 
                key={idx}
                id={`sub-${type}`} 
                className={cn(subMenu?.type === type && styles.open)} 
                style={{marginLeft: `${subMenuMargin}px`}}
              >
                {sub.map((a, idx) => 
                  <li key={idx} onMouseEnter={()=>onHover(a, true)} onMouseLeave={()=>onHover(a, false)}>
                    <Link href={`/${a.slug}`}>
                      <a>{a.name || a.title}</a>
                    </Link>
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>
        
            <div 
              id="menu-separator"
              className={cn(styles.separator, showSeparator && showMenu && styles.show)} 
              style={{marginLeft:`${separatorMargin}px`}}
            ></div>
        
      </div>
    </>
  )
}
