import { format, isAfter, isBefore, isEqual } from 'date-fns';

export const imageColor = (image: FileField | null | undefined): number[] => {
	let color = [255, 255, 255];
	if (image?.customData?.color) color = image.customData?.color.split(',');
	else if (image?.colors) color = [image.colors[0].red, image.colors[0].green, image.colors[0].blue];

	return color;
};

export const splitArray = (items: any[], max: number): any[][] => {
	const arr = new Array(max);
	const itemsPerRow = Math.ceil(items.length / max);
	for (let i = 0, a = 0; i < items.length; i++, a++) {
		arr[a] = arr[a] ? arr[a] : [];
		arr[a].push(items[i]);
		if (a + 1 >= max) a = -1;
	}
	return arr;
};

export type Period = 'current' | 'upcoming' | 'past';
export const datePeriod = (sDate: string, eDate: string): Period => {
	const startDate = new Date(sDate);
	const endDate = new Date(eDate);

	const now = new Date();
	let type: Period;

	if (isAfter(now, startDate) && isBefore(now, endDate)) type = 'current';
	else if (isBefore(endDate, now)) type = 'past';
	else type = 'upcoming';

	return type;
};

export const formatDatePeriod = (start: string, end: string): string => {
	return `${format(new Date(start), 'dd.MM')}—${format(new Date(end), 'dd.MM.yyyy')}`;
};
