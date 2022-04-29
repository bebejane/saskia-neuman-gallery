import * as NextLink from 'next/link';
import { useState, useEffect } from 'react';

export function Link({href, color, children, scroll, className, idx}) {
  
  const [hover, setHover] = useState(false)
  const linkStyle = hover && color ? {color: Array.isArray(color) ? `rgb(${color.join(',')})` : color} : {}

	return (
		<NextLink href={href} scroll={scroll !== undefined ? scroll : false} >
      <a 
        className={className}
        style={linkStyle}
        onMouseEnter={()=>setHover(true)} 
        onMouseLeave={()=>setHover(false)}
        suppressHydrationWarning={true}
      >
        {children}
      </a>
    </NextLink>
	);
}

export default Link