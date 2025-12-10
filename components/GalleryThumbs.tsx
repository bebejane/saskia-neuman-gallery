import s from './GalleryThumbs.module.scss';
import { Image } from 'react-datocms';
import { splitArray } from '@/lib/utils';
import Link from 'next/link';

export type GalleryThumbsProps = {
	thumbnails: FileField[];
	base: string;
};

export default function GalleryThumbs({ thumbnails, base }: GalleryThumbsProps) {
	const maxRows = 4;
	const columns = splitArray(thumbnails, maxRows) as FileField[][];
	let index = 0;

	return (
		<div className={s.thumbs}>
			{columns.map((a, cidx) => (
				<div key={`thumb-${cidx}`} className={s.row}>
					{a?.map((image, ridx) => (
						<Link
							href={`${base}/gallery/${getIndex(columns, index++)}`}
							key={`${cidx}-${ridx}`}
							scroll={false}
							prefetch={true}
						>
							<figure key={`thumb-image-${ridx}`}>
								{image.responsiveImage && (
									<Image
										data={image.responsiveImage}
										objectFit='contain'
										intersectionMargin='0px 0px 100% 0px'
									/>
								)}
							</figure>
						</Link>
					))}
				</div>
			))}
		</div>
	);
}

function getIndex(columns: FileField[][], currentIndex: number): number {
	const maxRows = columns[0]?.length || 0;
	const numColumns = columns.length;
	const colIndex = Math.floor(currentIndex / maxRows);
	const rowIndex = currentIndex % maxRows;
	return rowIndex * numColumns + colIndex;
}
