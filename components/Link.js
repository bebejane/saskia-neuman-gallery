import * as NextLink from 'next/link';
import {  useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';
import useStore from '/store';

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

  const handleTouch = (e) => {
    image && setBackgroundImage(image)
    router.push(href)
    e.preventDefault()
    e.stopPropagation()
  }

  useEffect(()=>{
    if(!image) return
    const img = new Image();
    img.src = `${image.url}?fmt=jpg&w=1400`;
    img.onload = () => console.log('preloaded', image.id);
      
  }, [])

  return (
    <NextLink href={href} scroll={scroll !== undefined ? scroll : false} >
      <a
        id={id}
        ref={linkRef}
        className={className}
        style={{ ...linkStyle, ...style }}
        onMouseEnter={handleMouse}
        onMouseLeave={handleMouse}
        onTouchEnd={handleTouch}
        suppressHydrationWarning={true}
      >
        {children}
      </a>
    </NextLink>
  );
}

export default Link