import s from './Article.module.scss';
import Background from '@/components/Background';
import cn from 'classnames';

export type ArticleProps = {
	children: React.ReactNode | React.ReactNode[];
	noMargin?: boolean;
	hide?: boolean;
	image?: FileField;
	color: number[];
	isHome?: boolean;
	href?: string;
	fullHeight?: boolean;
};

export function Article({ children, noMargin, hide, image, color, href, fullHeight }: ArticleProps) {
	if (hide) return null;
	return (
		<>
			<Background href={href} image={image} color={color} fullHeight={fullHeight} />
			<main id='main' className={cn(s.main, noMargin && s.noMargin)}>
				{children}
			</main>
		</>
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
