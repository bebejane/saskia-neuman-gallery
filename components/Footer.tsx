'use client';

import s from './Footer.module.scss';
import { useStore, useShallow } from '@/lib/store';
import Link from '@/components/Link';
import { HeaderBar } from '@/components/HeaderBar';
import { imageColor } from '@/lib/utils';

type FooterProps = {
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

export default function Footer({ current, items }: FooterProps) {
	if (!current || !items) return null;
	const setBackgroundImage = useStore((state) => state.setBackgroundImage);
	const t = current?.__typename;
	const index = items?.findIndex(({ slug }) => slug === current?.slug) ?? 0;
	const next = items?.[index + 1] ?? items?.[index - 1];
	const label =
		next?.__typename === 'ArtistRecord' ? `${next.firstName} ${next.lastName}` : next?.title;
	const href =
		next?.__typename === 'ArtistRecord'
			? `/artists/${next.slug}`
			: next?.__typename === 'HappeningRecord'
				? `/happenings/${next?.slug}`
				: next?.__typename === 'FairRecord'
					? `/fairs/${next?.slug}`
					: `/exhibitions/${next?.slug}`;

	const type =
		t === 'ArtistRecord'
			? 'artist'
			: t === 'ExhibitionRecord'
				? 'exhibition'
				: t === 'FairRecord'
					? 'fair'
					: 'happening';

	const image = (next?.image as FileField) ?? null;

	return (
		<footer className={s.footer}>
			<div className={s.wrapper}>
				<div className={s.next}>
					<HeaderBar>
						<Link href={href} color={imageColor(image)} image={image}>
							<h3
								onMouseEnter={() => setBackgroundImage(image)}
								onMouseLeave={() => setBackgroundImage(null)}
							>
								Next {type}
							</h3>
						</Link>
					</HeaderBar>
				</div>
				<div className={s.label}>
					<HeaderBar>
						<b>
							<Link href={href} color={imageColor(image)} image={image}>
								<span
									onMouseEnter={() => setBackgroundImage(image)}
									onMouseLeave={() => setBackgroundImage(null)}
								>
									{label}
								</span>
							</Link>
						</b>
					</HeaderBar>
				</div>
			</div>
		</footer>
	);
}
