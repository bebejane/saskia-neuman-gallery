import { Loader } from '@/components/Loader';
import s from './Gallery.module.scss';

export default function GalleryLoading() {
	return (
		<div className={s.loading}>
			<Loader />
		</div>
	);
}
