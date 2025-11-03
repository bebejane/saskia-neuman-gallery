import styles from './HeaderBar.module.scss'
import cn from "classnames";

export function HeaderBar({ children, mobileHide }) {

	return (
		<header className={cn(styles.bar, mobileHide && styles.mobileHide)}>
			{children}
		</header >
	);
}
