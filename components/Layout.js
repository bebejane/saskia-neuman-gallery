import styles from './Layout.module.scss'
import cn from 'classnames'

export function Layout({ children, noMargin }) {
	return (
		<main id="main" className={cn(styles.main, noMargin && styles.noMargin)}>
			{children}
		</main>
	);
}

export function Meta({ children, border }) {
	return (
		<aside className={cn(styles.meta, border && styles.border)}>
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