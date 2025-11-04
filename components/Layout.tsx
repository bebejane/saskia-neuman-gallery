import s from './Layout.module.scss';
import cn from 'classnames';

export type LayoutProps = {
	children: React.ReactNode | React.ReactNode[];
	noMargin?: boolean;
	hide?: boolean;
};

export function Layout({ children, noMargin, hide }: LayoutProps) {
	if (hide) return null;
	return (
		<main id='main' className={cn(s.main, noMargin && s.noMargin)}>
			{children}
		</main>
	);
}

export type MetaProps = {
	children: React.ReactNode | React.ReactNode[];
	border?: boolean;
};

export function Meta({ children, border }: MetaProps) {
	return <aside className={cn(s.meta, border && s.border)}>{children}</aside>;
}

export type ContentProps = {
	children: React.ReactNode | React.ReactNode[];
};

export function Content({ children }: ContentProps) {
	return <article className={s.content}>{children}</article>;
}
