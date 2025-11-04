'use client';

import s from './template.module.scss';
import { usePathname } from 'next/navigation';

export default function Template({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	/*
	useEffect(() => {
		const originalColor = document.body.style.backgroundColor;
		document.body.style.backgroundColor = color;
		return () => (document.body.style.backgroundColor = originalColor);
	}, []);
*/
	return <>{children}</>;
}
