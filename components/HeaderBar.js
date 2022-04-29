import styles from './HeaderBar.module.scss'
import cn from "classnames";

export function HeaderBar({ children, mobile }) {

	return (
		<header className={cn(styles.bar, mobile && styles.mobile)}>
			{children}
		</header >
	);
}
