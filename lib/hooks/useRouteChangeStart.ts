import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export const useRouteChangeStart = (fn: () => void): void => {
	const pathname = usePathname();
	useEffect(() => {
		return fn();
	}, [pathname]);
};

export const useRouteChangeEnd = (fn: () => void): void => {
	const pathname = usePathname();
	useEffect(() => {
		fn();
	}, [pathname]);
};
