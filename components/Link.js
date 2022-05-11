import * as NextLink from 'next/link';
import { Router, useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

export function Link({
  id,
  href,
  color,
  children,
  scroll,
  className,
  style = {},
  onMouseEnter,
  onMouseLeave
}) {
  const router = useRouter()
  const [hover, setHover] = useState(false)
  const linkRef = useRef()
  const linkStyle = hover && color ? { color: `rgb(${color.join(',')})`, textShadow: '0 0 5px #fff05' } : {}

  const handleMouse = (e) => {
    if (e.type === 'mouseleave') {
      setHover(false)
      onMouseLeave && onMouseLeave(e)
    } else if (e.type === 'mouseenter') {
      setHover(true)
      onMouseEnter && onMouseEnter(e)
    }
  }

  return (
    <NextLink href={href} scroll={scroll !== undefined ? scroll : false} >
      <a
        id={id}
        ref={linkRef}
        className={className}
        style={{ ...linkStyle, ...style }}
        onMouseEnter={handleMouse}
        onMouseLeave={handleMouse}
        onTouchStart={(e) => router.push(href)}
        suppressHydrationWarning={true}
      >
        {children}
      </a>
    </NextLink>
  );
}

export default Link