import React from 'react';

export function usePrevious<T>(value: T) {
	const [current, setCurrent] = React.useState<T | null>(value);
	const [previous, setPrevious] = React.useState<T | null>(null);

	if (value !== current) {
		setPrevious(current as T);
		setCurrent(value);
	}

	return previous;
}
