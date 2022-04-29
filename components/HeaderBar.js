import styles from './HeaderBar.module.scss'
import cn from "classnames";

export function HeaderBar(props, mobile) {

	return (
		<header className={cn(styles.bar, mobile && styles.mobile)}>
			{props.children}
		</header >
	);
}
