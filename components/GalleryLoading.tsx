import s from './Gallery.module.scss';
export default function GalleryLoading() {
	return (
		<div className={s.loading}>
			<div className={s.loader}></div>
		</div>
	);
}
