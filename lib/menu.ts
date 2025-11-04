import { MenuDocument } from '@/graphql';
import { datePeriod, imageColor, Period } from '@/lib/utils';
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
	more?: MenuItemMore[];
	selected: boolean;
};

export type MenuItemSub = {
	__typename: 'ArtistRecord' | 'ExhibitionRecord' | 'HappeningRecord' | 'AboutRecord';
	title: string;
	period?: Period;
	text?: string;
	date?: string;
	image?: any;
	href: string;
	color?: number[];
	selected: boolean;
};

export type MenuItemMore = Omit<MenuItemSub, '__typename'> & {
	__typename: 'ExhibitionRecord' | 'HappeningRecord';
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
					.sort((a, b) => (a.lastName > b.lastName ? 1 : -1))
					.filter((i) => i)
					.map((item) => ({
						__typname: item.__typename,
						href: `/artists/${item.slug}`,
						title: `${item.firstName} ${item.lastName}`,
						image: item.image,
						color: imageColor(item.image as FileField),
					})),
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
					.filter((i) => i !== undefined)
					.map((item) => ({
						__typename: item.__typename,
						href: `/exhibitions/${item?.slug}`,
						title: item.title,
						period: datePeriod(item.startDate, item.endDate),
						text: item.artists?.map((a) => `${a.firstName} ${a.lastName}`).join(', '),
						image: item.image,
						color: imageColor(item.image as FileField),
						date: `${format(new Date(item.startDate), 'dd.MM')}}—${format(new Date(item.endDate), 'dd.MM.yyyy')}`,
					})),
				current: allExhibitions.find(({ startDate, endDate }) => datePeriod(startDate, endDate) === 'current'),
				upcoming: allExhibitions
					.filter(({ startDate, endDate }) => datePeriod(startDate, endDate) === 'upcoming')
					.sort((a, b) => (a.startDate > b.startDate ? -1 : 1))[0],
				past: pastExhibition,
				more: allExhibitions
					?.filter(
						({ startDate, endDate, id }) => datePeriod(startDate, endDate) === 'past' && pastExhibition?.id !== id
					)
					.map((item, idx) => ({
						__typeName: 'ExhibitionRecord',
						href: `/${item.slug}`,
						title: item.title,
						period: datePeriod(item.startDate, item.endDate),
						text: item.artists?.map((a) => `${a.firstName} ${a.lastName}`).join(', '),
						color: imageColor(item.image as FileField),
						selected: false,
						image: item.image,
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
					.map((item) => ({
						__typename: item.__typename,
						title: item.title,
						image: item.image,
						color: imageColor(item.image as FileField),
						selected: false,
						href: `/happenings/${item.slug}`,
						date: `${format(new Date(item.startDate), 'dd.MM')}}—${format(new Date(item.endDate), 'dd.MM.yyyy')}`,
					})),
				past: pastHappening,
				more: allHappenings
					?.filter(
						({ startDate, endDate, id }) => datePeriod(startDate, endDate) === 'past' && pastHappening?.id !== id
					)
					.map((item, idx) => ({
						__typeName: 'HappeningRecord',
						href: `/${item.slug}`,
						color: imageColor(item.image as FileField),
						selected: false,
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
						__typename: 'AboutRecord',
						title: 'The Gallery',
						href: '/about',
						image: about?.image,
						color: imageColor(about?.image as FileField),
					},
				],
			},
		].map((m) => ({
			...m,
			image: m.sub ? m.sub[0]?.image : m.image,
			color: imageColor((m.sub ? m.sub[0]?.image : m.image) as FileField),
			selected: !m.sub && m.path === path,
			sub: m.sub?.map((item) => ({
				...item,
				selected: item.href === path,
				color: imageColor(item.image as FileField),
			})),
		}));
		console.log(menu);
		return menu as MenuItem[];
	} catch (err) {
		console.error(err);
		return [];
	}
}
