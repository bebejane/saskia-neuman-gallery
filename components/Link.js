import * as NextLink from 'next/link';
import {  useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';
import useStore from '/store';
import Tappable from 'react-tapper';

export function Link({
  id,
  href,
  color,
  image,
  children,
  scroll,
  className,
  target,
  style = {},
  isSelected,
  onMouseEnter,
  onMouseLeave
}) {

  const router = useRouter()
  const [hover, setHover] = useState(false)
  const setBackgroundColor = useStore((state) => state.setBackgroundColor)
  const linkRef = useRef() 
  const linkStyle = color && (hover || isSelected) ? { color: `rgb(${color.join(',')})`, textShadow: '0 0 5px #fff05' } : {}

  const handleMouse = (e) => {
    if (e.type === 'mouseleave') {
      setHover(false)
      onMouseLeave && onMouseLeave(e)
    } else if (e.type === 'mouseenter') {
      setHover(true)
      onMouseEnter && onMouseEnter(e)
    }
  }

  const handleTouchEnd = (e) => {
    if(e.type === 'click') return 
    setBackgroundColor(color)
    router.push(href)
  }
  
  useEffect(()=>{
    if(!image) return
    const img = new Image();
    img.src = `${image.url}?fmt=jpg&w=1400`; // Preload image
  }, [])

  useEffect(()=>{ hover && setBackgroundColor(color)}, [hover, color])

  return (
    <NextLink href={href} scroll={scroll !== undefined ? scroll : false} >
      <a
        id={id}
        ref={linkRef}
        style={{ ...linkStyle, ...style}}
        target={target}
        onMouseEnter={handleMouse}
        onMouseLeave={handleMouse}
        suppressHydrationWarning={true}
      >
        <Tappable onTap={handleTouchEnd} className={className}>
          {children}
        </Tappable>
      </a>
    </NextLink>
  );
}

export default Link