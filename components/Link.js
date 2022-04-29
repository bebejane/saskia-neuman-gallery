import styles from './HeaderBar.module.scss'
import cn from "classnames";
import * as NextLink from 'next/link';
import { useState } from 'react';

export function Link({href, color, children}) {
  const [hover, setHover] = useState(false)
	return (
		<NextLink href={href} scroll={false}>
      {children}
    </NextLink>
	);
}
