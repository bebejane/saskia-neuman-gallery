import styles from './Layout.module.scss'
import cn from 'classnames'

export function Layout(props) {
	return (
		<main id="main" className={styles.main}>
			{props.children}
		</main>
	);
}

export function Meta({ children, sticky }) {
	return (
		<aside className={cn(styles.meta, sticky && styles.sticky)}>
			{children}
		</aside>
	);
}

export function Content(props) {

	return (
		<article className={styles.content}>
			{props.children}
		</article>
	);
}