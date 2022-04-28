import styles from './Layout.module.scss'

export function Layout(props) {
	console.log('render')
	return (
		<main className={styles.main}>
			{props.children}
		</main>
	);
}

export function Meta(props) {

	return (
		<aside className={styles.meta}>
			{props.children}
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