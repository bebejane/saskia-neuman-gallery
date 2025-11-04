import { MenuDocument } from '@/graphql';
import { datePeriod, imageColor } from '@/lib/utils';
import { format } from 'date-fns';
import { apiQuery } from 'next-dato-utils/api';

export type MenuItem = {
	__typename: 'StartRecord' | 'ArtistRecord' | 'ExhibitionRecord' | 'HappeningRecord' | 'AboutRecord';
	path: string;
	label: string;
	image?: any;
	sub?: MenuItemSub[];
	current?: any;
	upcoming?: any;
	past?: any;
	all?: any;
	more?: MoreItem[];
	about?: any;
};

export type MenuItemSub = {
	__typename: 'StartRecord' | 'ArtistRecord' | 'ExhibitionRecord' | 'HappeningRecord' | 'AboutRecord';
	name: string;
	image?: any;
	slug?: string;
	color?: number[];
	[key: string]: any;
};

export type MoreItem = {
	__typename: 'ExhibitionRecord' | 'HappeningRecord';
	href: string;
	color: number[];
	isSelected: boolean;
	image: FileField | null;
	title: string;
	date: string;
};

export async function buildMenu() {
	const path = '';
	const { start, allArtists, allExhibitions, allHappenings, about } = await apiQuery(MenuDocument);

	const pastHappening = allHappenings.filter(({ startDate, endDate }) => datePeriod(startDate, endDate) === 'past')[0];
	const pastExhibition = allExhibitions.filter(
		({ startDate, endDate }) => datePeriod(startDate, endDate) === 'past'
	)[0];

	try {
		const menu = [
			{
				__typename: 'StartRecord',
				path: '/',
				label: 'SASKIA NEUMAN GALLERY',
				image: start?.links[0].image,
			},
			{
				__typename: 'ArtistRecord',
				path: '/artists',
				label: 'Artists',
				sub: allArtists
					.map((a) => ({ ...a, slug: `artists/${a.slug}`, color: imageColor(a.image as FileField) }))
					.sort((a, b) => (a.lastName > b.lastName ? 1 : -1)),
			},
			{
				__typename: 'ExhibitionRecord',
				path: '/exhibitions',
				label: 'Exhibitions',
				sub: [
					allExhibitions.find(({ startDate, endDate }) => datePeriod(startDate, endDate) === 'current'),
					allExhibitions
						.filter(({ startDate, endDate }) => datePeriod(startDate, endDate) === 'upcoming')
						.sort((a, b) => (a.startDate > b.startDate ? 1 : -1))[0],
					pastExhibition,
				]
					.filter((i) => i)
					.map((s) => ({ ...s, slug: `exhibitions/${s?.slug}` })),
				current: allExhibitions.find(({ startDate, endDate }) => datePeriod(startDate, endDate) === 'current'),
				upcoming: allExhibitions
					.filter(({ startDate, endDate }) => datePeriod(startDate, endDate) === 'upcoming')
					.sort((a, b) => (a.startDate > b.startDate ? -1 : 1))[0],
				past: pastExhibition,
				all: allExhibitions.map((s) => ({
					...s,
					slug: `exhibitions/${s.slug}`,
					color: imageColor(s.image as FileField),
				})),
				more: allExhibitions
					?.filter(
						({ startDate, endDate, id }) => datePeriod(startDate, endDate) === 'past' && pastExhibition?.id !== id
					)
					.map((item, idx) => ({
						__typeName: 'ExhibitionRecord',
						href: `/${item.slug}`,
						color: imageColor(item.image as FileField),
						isSelected: false,
						image: item.image,
						title: item.title,
						date: `${format(new Date(item.startDate), 'dd.MM')}}—${format(new Date(item.endDate), 'dd.MM.yyyy')}`,
					})),
			},
			{
				__typename: 'HappeningRecord',
				path: '/happenings',
				label: 'Happenings',
				sub: [
					allHappenings.filter(({ startDate, endDate }) => datePeriod(startDate, endDate) === 'upcoming')[0],
					allHappenings.filter(({ startDate, endDate }) => datePeriod(startDate, endDate) === 'past')[0],
				]
					.filter((i) => i)
					.map((s) => ({ ...s, slug: `happenings/${s.slug}` })),
				past: pastHappening,
				all: allHappenings.map((e) => ({
					...e,
					slug: `happenings/${e.slug}`,
					color: imageColor(e.image as FileField),
				})),
				more: allHappenings
					?.filter(
						({ startDate, endDate, id }) => datePeriod(startDate, endDate) === 'past' && pastHappening?.id !== id
					)
					.map((item, idx) => ({
						__typeName: 'HappeningRecord',
						href: `/${item.slug}`,
						color: imageColor(item.image as FileField),
						isSelected: false,
						image: item.image,
						title: item.title,
						date: `${format(new Date(item.startDate), 'dd.MM')}}—${format(new Date(item.endDate), 'dd.MM.yyyy')}`,
					})),
			},
			{
				__typename: 'AboutRecord',
				path: '/about',
				label: 'About',
				about: about,
				sub: [
					{
						name: 'The Gallery',
						image: about?.image,
						color: imageColor(about?.image as FileField),
						slug: 'about',
					},
				],
			},
		].map((m) => ({
			...m,
			image: m.sub ? m.sub[0]?.image : m.image,
			color: imageColor((m.sub ? m.sub[0]?.image : m.image) as FileField),
			isSelected: !m.sub && m.path === path,
			sub: m.sub?.map((s) => ({
				...s,
				isSelected: `/${s.slug}` === path,
				color: imageColor(s.image as FileField),
			})),
		}));
		console.log(menu);
		return menu as MenuItem[];
	} catch (err) {
		console.error(err);
		return [];
	}
}
