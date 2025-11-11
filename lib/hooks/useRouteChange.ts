import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useRouteChangeStart = (fn: () => void): void => {
	const pathname = usePathname();
	useEffect(() => {
		return () => fn();
	}, [pathname]);
};

export const useRouteChangeEnd = (fn: () => void): void => {
	const pathname = usePathname();
	useEffect(() => {
		fn();
		return undefined;
	}, [pathname]);
};
