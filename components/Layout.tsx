import s from './Layout.module.scss';
import cn from 'classnames';

export function Layout({ children, noMargin, hide }) {
	if (hide) return null;
	return (
		<main id='main' className={cn(s.main, noMargin && s.noMargin)}>
			{children}
		</main>
	);
}

export function Meta({ children, border }) {
	return <aside className={cn(s.meta, border && s.border)}>{children}</aside>;
}

export function Content(props) {
	return <article className={s.content}>{props.children}</article>;
}
