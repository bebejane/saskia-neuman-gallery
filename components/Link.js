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
  style = {},
  isSelected,
  onMouseEnter,
  onMouseLeave
}) {

  const router = useRouter()
  const [hover, setHover] = useState(false)
  const linkRef = useRef() 
  const setBackgroundImage = useStore(state => state.setBackgroundImage)
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
    //image && setBackgroundImage(image)
    router.push(href)
  }
  
  useEffect(()=>{
    if(!image) return
    const img = new Image();
    img.src = `${image.url}?fmt=jpg&w=1400`; // Preload image
  }, [])

  return (
    <NextLink href={href} scroll={scroll !== undefined ? scroll : false} >
      <a
        id={id}
        ref={linkRef}
        //className={className}
        style={{ ...linkStyle, ...style}}
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