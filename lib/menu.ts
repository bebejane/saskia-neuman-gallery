import { MenuDocument } from '@/graphql';
import { datePeriod, imageColor } from '@/lib/utils';
import { apiQuery } from 'next-dato-utils/api';

export type MenuItemSub = {
	name: string;
	image?: any;
	slug?: string;
	color?: string;
	[key: string]: any;
};
export type MenuItem = {
	type: string;
	path: string;
	label: string;
	image?: any;
	sub?: MenuItemSub[];
	more?: boolean;
	current?: any;
	upcoming?: any;
	past?: any;
	all?: any;
	about?: any;
};

export async function buildMenu() {
	const path = '';
	const { start, allArtists, allExhibitions, allHappenings, about } = await apiQuery(MenuDocument);

	try {
		const menu = [
			{
				type: 'start',
				path: '/',
				label: 'SASKIA NEUMAN GALLERY',
				image: start?.links[0].image,
			},
			{
				type: 'artist',
				path: '/artists',
				label: 'Artists',
				sub: allArtists
					.map((a) => ({ ...a, slug: `artists/${a.slug}`, color: imageColor(a.image) }))
					.sort((a, b) => (a.lastName > b.lastName ? 1 : -1)),
			},
			{
				type: 'exhibition',
				path: '/exhibitions',
				label: 'Exhibitions',
				more: true,
				current: allExhibitions.find(({ startDate, endDate }) => datePeriod(startDate, endDate) === 'current'),
				upcoming: allExhibitions
					.filter(({ startDate, endDate }) => datePeriod(startDate, endDate) === 'upcoming')
					.sort((a, b) => (a.startDate > b.startDate ? -1 : 1))[0],
				past: allExhibitions.filter(({ startDate, endDate }) => datePeriod(startDate, endDate) === 'past')[0],
				sub: [
					allExhibitions.find(({ startDate, endDate }) => datePeriod(startDate, endDate) === 'current'),
					allExhibitions
						.filter(({ startDate, endDate }) => datePeriod(startDate, endDate) === 'upcoming')
						.sort((a, b) => (a.startDate > b.startDate ? 1 : -1))[0],
					allExhibitions.filter(({ startDate, endDate }) => datePeriod(startDate, endDate) === 'past')[0],
				]
					.filter((i) => i)
					.map((s) => ({ ...s, slug: `allExhibitions/${s?.slug}` })),
				all: allExhibitions.map((s) => ({
					...s,
					slug: `exhibitions/${s.slug}`,
					color: imageColor(s.image),
				})),
			},
			{
				type: 'happening',
				path: '/happenings',
				label: 'Happenings',
				past: allHappenings.filter(({ startDate, endDate }) => datePeriod(startDate, endDate) === 'past')[0],
				more: true,
				sub: [
					allHappenings.filter(({ startDate, endDate }) => datePeriod(startDate, endDate) === 'upcoming')[0],
					allHappenings.filter(({ startDate, endDate }) => datePeriod(startDate, endDate) === 'past')[0],
				]
					.filter((i) => i)
					.map((s) => ({ ...s, slug: `happenings/${s.slug}` })),
				all: allHappenings.map((e) => ({
					...e,
					slug: `happenings/${e.slug}`,
					color: imageColor(e.image),
				})),
			},
			{
				type: 'about',
				path: '/about',
				label: 'About',
				more: false,
				about: about,
				sub: [
					{
						name: 'The Gallery',
						image: about?.image,
						color: imageColor(about?.image),
						slug: 'about',
					},
				],
			},
		].map((m) => ({
			...m,
			image: m.sub ? m.sub[0]?.image : m.image,
			color: imageColor(m.sub ? m.sub[0]?.image : m.image),
			isSelected: !m.sub && m.path === path,
			sub: m.sub?.map((s) => ({
				...s,
				isSelected: `/${s.slug}` === path,
				color: imageColor(s.image),
			})),
		}));
		return menu as MenuItem[];
	} catch (err) {
		console.error(err);
		return [];
	}
}
