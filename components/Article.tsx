import s from './Article.module.scss';
import Background from '@/components/Background';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import { imageColor } from '@/lib/utils';
import cn from 'classnames';

export type ArticleProps = {
	children: React.ReactNode | React.ReactNode[];
	noMargin?: boolean;
	topMargin?: boolean;
	hide?: boolean;
	image?: FileField;
	color?: number[];
	isHome?: boolean;
	href?: string;
	fullHeight?: boolean;
	footer?: {
		current?:
			| ArtistQuery['artist']
			| ExhibitionQuery['exhibition']
			| HappeningQuery['happening']
			| FairQuery['fair'];
		items?:
			| AllArtistsQuery['allArtists']
			| AllExhibitionsQuery['allExhibitions']
			| AllHappeningsQuery['allHappenings']
			| AllFairsQuery['allFairs'];
	};
};

export function Article({
	children,
	noMargin,
	hide,
	image,
	color,
	href,
	fullHeight,
	footer,
	isHome,
}: ArticleProps) {
	if (hide) return null;

	return (
		<>
			<PageTransition defaultColor={color} defaultImage={image} isHome={isHome ?? false} />
			<Background
				href={href}
				image={image}
				color={color ? color : imageColor(image)}
				fullHeight={fullHeight}
			/>
			<main id='main' className={cn(s.main, noMargin && s.noMargin)}>
				{children}
			</main>
			{footer && <Footer current={footer.current} items={footer.items} />}
		</>
	);
}

export type MetaProps = {
	children: React.ReactNode | React.ReactNode[];
	border?: boolean;
	sticky?: boolean;
};

export function Meta({ children, border, sticky = true }: MetaProps) {
	return <aside className={cn(s.meta, border && s.border, sticky && s.sticky)}>{children}</aside>;
}

export type ContentProps = {
	children: React.ReactNode | React.ReactNode[];
};

export function Content({ children }: ContentProps) {
	return <article className={s.content}>{children}</article>;
}
