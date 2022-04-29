import * as NextLink from 'next/link';
import { useState, useEffect } from 'react';

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
  
  const [hover, setHover] = useState(false)
  const linkStyle = hover && color ? {color: Array.isArray(color) ? `rgb(${color.join(',')})` : color} : {}

  const handleMouse = (e) => {
    if(e.type === 'mouseleave'){
      setHover(false)
      onMouseLeave && onMouseLeave(e)
    } else if(e.type === 'mouseenter'){
      setHover(true)
      onMouseEnter && onMouseEnter(e)
    }
  }

	return (
		<NextLink href={href} scroll={scroll !== undefined ? scroll : false} >
      <a 
        id={id}
        className={className}
        style={{...linkStyle, ...style}}
        onMouseEnter={handleMouse} 
        onMouseLeave={handleMouse}
        suppressHydrationWarning={true}
      >
        {children}
      </a>
    </NextLink>
	);
}

export default Link