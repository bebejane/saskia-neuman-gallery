import { MenuDocument } from '@/graphql';
import { datePeriod, formatDatePeriod, imageColor, Period } from '@/lib/utils';
import { apiQuery } from 'next-dato-utils/api';

export type MenuItem = {
	__typename:
		| 'StartRecord'
		| 'ArtistRecord'
		| 'ExhibitionRecord'
		| 'HappeningRecord'
		| 'FairRecord'
		| 'AboutRecord';
	id: string;
	path: string;
	label: string;
	image?: any;
	sub?: MenuItemSub[];
	color?: number[];
	current?: any;
	upcoming?: any;
	past?: any;
	more?: MenuItemMore[];
	selected?: boolean;
	data?: any;
};

export type MenuItemSub = {
	__typename:
		| 'ArtistRecord'
		| 'ExhibitionRecord'
		| 'HappeningRecord'
		| 'AboutRecord'
		| 'FairRecord';
	id: string;
	title: string;
	period?: Period;
	text?: string;
	date?: string;
	image?: any;
	href: string;
	color?: number[];
	selected?: boolean;
	data?: any;
};

export type MenuItemMore = Omit<MenuItemSub, '__typename'> & {
	__typename: 'ExhibitionRecord' | 'HappeningRecord';
};

export async function buildMenu() {
	const { start, allArtists, allExhibitions, allHappenings, allFairs, about } =
		await apiQuery(MenuDocument);

	const pastHappening = allHappenings.filter(
		({ startDate, endDate }) => datePeriod(startDate, endDate) === 'past'
	)[0];

	const moreHappenings = allHappenings?.filter(
		({ startDate, endDate, id }) =>
			datePeriod(startDate, endDate) === 'past' && pastHappening?.id !== id
	);

	const pastExhibition = allExhibitions.filter(
		({ startDate, endDate }) => datePeriod(startDate, endDate) === 'past'
	)[0];

	const moreExhibitions = allExhibitions?.filter(
		({ startDate, endDate, id }) =>
			datePeriod(startDate, endDate) === 'past' && pastExhibition?.id !== id
	);

	const pastFairs = allFairs.filter(
		({ startDate, endDate }) => datePeriod(startDate, endDate) === 'past'
	)[0];

	const moreFairs = allFairs?.filter(
		({ startDate, endDate, id }) =>
			datePeriod(startDate, endDate) === 'past' && pastExhibition?.id !== id && pastFairs?.id !== id
	);

	const currentExhibition = allExhibitions.find(
		({ startDate, endDate }) => datePeriod(startDate, endDate) === 'current'
	);
	const upcomingExhibition = allExhibitions
		.filter(({ startDate, endDate }) => datePeriod(startDate, endDate) === 'upcoming')
		.sort((a, b) => (a.startDate > b.startDate ? -1 : 1))[0];

	try {
		const menu = [
			{
				__typename: 'StartRecord',
				id: 'start',
				path: '/',
				label: 'SASKIA NEUMAN GALLERY',
				image: start?.links[0].image,
				color: start?.links[0].image?.customData?.color?.split(','),
			},
			{
				__typename: 'ArtistRecord',
				id: 'artists',
				path: '/artists',
				label: 'Artists',
				columns: 2,
				sub: allArtists
					.sort((a, b) => (a.lastName > b.lastName ? 1 : -1))
					.filter((i) => i)
					.map((item) => ({
						__typname: item.__typename,
						id: item.id,
						href: `/artists/${item.slug}`,
						title: `${item.firstName} ${item.lastName}`,
						image: item.image,
						color: imageColor(item.image as FileField),
						data: {
							exhibiting: item.exhibiting ? true : false,
						},
					})),
			},
			{
				__typename: 'ExhibitionRecord',
				id: 'exhibitions',
				path: '/exhibitions',
				label: 'Exhibitions',
				sub: [
					allExhibitions.find(
						({ startDate, endDate }) => datePeriod(startDate, endDate) === 'current'
					),
					allExhibitions
						.filter(({ startDate, endDate }) => datePeriod(startDate, endDate) === 'upcoming')
						.sort((a, b) => (a.startDate > b.startDate ? 1 : -1))[0],
					pastExhibition,
				]
					.filter((i) => i !== undefined)
					.map((item) => ({
						__typename: item.__typename,
						id: item.id,
						href: `/exhibitions/${item?.slug}`,
						title: item.title,
						period: datePeriod(item.startDate, item.endDate),
						text: item.artists?.map((a) => `${a.firstName} ${a.lastName}`).join(', '),
						image: item.image,
						color: imageColor(item.image as FileField),
						date: formatDatePeriod(item.startDate, item.endDate),
					})),
				current: currentExhibition,
				upcoming: upcomingExhibition,
				past: pastExhibition,
				more: moreExhibitions.map((item, idx) => ({
					__typeName: 'ExhibitionRecord',
					id: item.id,
					href: `/exhibitions/${item.slug}`,
					title: item.title,
					period: datePeriod(item.startDate, item.endDate),
					text: item.artists?.map((a) => `${a.firstName} ${a.lastName}`).join(', '),
					color: imageColor(item.image as FileField),
					selected: false,
					image: item.image,
					date: formatDatePeriod(item.startDate, item.endDate),
				})),
			},
			{
				__typename: 'FairRecord',
				id: 'fairs',
				path: '/fairs',
				label: 'Fairs',
				sub: [
					allFairs.filter(
						({ startDate, endDate }) => datePeriod(startDate, endDate) === 'upcoming'
					)[0],
					allFairs.filter(({ startDate, endDate }) => datePeriod(startDate, endDate) === 'past')[0],
				]
					.filter((i) => i)
					.map((item) => ({
						__typename: item.__typename,
						id: item.id,
						period: datePeriod(item.startDate, item.endDate),
						title: item.title,
						image: item.image,
						color: imageColor(item.image as FileField),
						selected: false,
						href: `/fairs/${item.slug}`,
						date: formatDatePeriod(item.startDate, item.endDate),
					})),
				past: pastFairs,
				more: moreFairs.map((item, idx) => ({
					__typeName: 'FairsRecord',
					id: item.id,
					href: `/fairs/${item.slug}`,
					color: imageColor(item.image as FileField),
					selected: false,
					image: item.image,
					title: item.title,
					date: formatDatePeriod(item.startDate, item.endDate),
				})),
			},
			{
				__typename: 'AboutRecord',
				id: 'about',
				path: '/about',
				label: 'Information',
				data: about,
				color: imageColor(about?.image as FileField),
				image: about?.image,
				sub: [
					allHappenings.filter(
						({ startDate, endDate }) => datePeriod(startDate, endDate) === 'upcoming'
					)[0],
					allHappenings.filter(
						({ startDate, endDate }) => datePeriod(startDate, endDate) === 'past'
					)[0],
				]
					.filter((i) => i)
					.map((item) => ({
						__typename: item.__typename,
						id: item.id,
						period: datePeriod(item.startDate, item.endDate),
						title: item.title,
						image: item.image,
						color: imageColor(item.image as FileField),
						selected: false,
						href: `/happenings/${item.slug}`,
						date: formatDatePeriod(item.startDate, item.endDate),
					})),
				past: pastHappening,
				more: moreHappenings.map((item, idx) => ({
					__typeName: 'HappeningRecord',
					id: item.id,
					href: `/happenings/${item.slug}`,
					color: imageColor(item.image as FileField),
					selected: false,
					image: item.image,
					title: item.title,
					date: formatDatePeriod(item.startDate, item.endDate),
				})),
			},
		].map((m) => ({
			...m,
			image: m.image ?? m.sub?.[0]?.image,
			color: imageColor((m.sub ? m.sub[0]?.image : m.image) as FileField),
			sub: m.sub?.map((item) => ({
				...item,
				color: imageColor(item.image as FileField),
			})),
		}));

		return menu as MenuItem[];
	} catch (err) {
		console.error(err);
		return [];
	}
}

export function findtMenuItem(menu: MenuItem[], pathname: string): MenuItem | null {
	return (
		menu
			.map((item) => [item, ...(item?.sub || []), ...(item?.more || []), item.past])
			.flat()
			.filter((item) => item)
			.find((item) => [item.path, item.href].includes(pathname)) ?? null
	);
}
