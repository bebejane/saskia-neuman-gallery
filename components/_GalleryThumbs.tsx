'use client';

import s from './_GalleryThumbs.module.scss';
import { Image } from 'react-datocms';
import { useState } from 'react';
import Gallery from './Gallery';
import { splitArray } from '@/lib/utils';

export type GalleryThumbsProps = {
	artwork: FileField[];
	artworkThumbnails: FileField[];
};

export default function GalleryThumbs({ artwork, artworkThumbnails }: GalleryThumbsProps) {
	const maxRows = 4;
	const artworkRows = splitArray(artworkThumbnails, maxRows) as FileField[][];
	const [galleryIndex, setGalleryIndex] = useState(-1);

	return (
		<>
			<div className={s.thumbs}>
				{artworkRows.map((a, ridx) => (
					<div key={`thumb-${ridx}`} className={s.row}>
						{a?.map((image, idx) => (
							<figure
								key={`thumb-image-${idx}`}
								onClick={() => setGalleryIndex(artworkThumbnails.findIndex((a) => a.id === image.id))}
							>
								{image.responsiveImage && (
									<Image data={image.responsiveImage} objectFit='contain' intersectionMargin='0px 0px 100% 0px' />
								)}
							</figure>
						))}
					</div>
				))}
			</div>

			{/*<Gallery
				images={artwork}
				index={galleryIndex}
				//onClose={() => setGalleryIndex(-1)}
				//
			/>*/}
		</>
	);
}
