import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const usePreviousRoute = () => {
	const storage = globalThis.sessionStorage;
	const pathname = usePathname();
	const [prevRoute, setPrevRoute] = useState(typeof storage !== 'undefined' ? storage.getItem('previousRoute') : null);

	useEffect(() => {
		const prevRoute = storage.getItem('currentRoute');
		if (prevRoute === pathname) return;
		prevRoute && storage.setItem('previousRoute', prevRoute);
		storage.setItem('currentRoute', pathname);
		setPrevRoute(prevRoute);
	}, [pathname, storage]);

	useEffect(() => {
		const handleWindowReload = () => {
			storage.removeItem('previousRoute');
			storage.removeItem('currentRoute');
		};
		window.addEventListener('beforeunload', handleWindowReload);
		return () => window.removeEventListener('beforeunload', handleWindowReload);
	});

	return prevRoute;
};

export default usePreviousRoute;
