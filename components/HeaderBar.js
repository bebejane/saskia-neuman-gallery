import styles from './HeaderBar.module.scss'
import cn from "classnames"

export function HeaderBar(props) {

	return (
		<header className={styles.bar}>
			{props.children}
		</header>
	);
}
