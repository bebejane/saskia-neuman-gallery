import styles from './HeaderBar.module.scss'

export function HeaderBar(props) {

	return (
		<header className={styles.bar}>
			{props.children}
		</header>
	);
}
