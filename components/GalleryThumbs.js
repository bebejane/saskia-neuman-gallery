import styles from "./GalleryThumbs.module.scss";
import { Image } from "react-datocms";
import { useState } from "react";
import Gallery from "./Gallery";
import { splitArray } from "/lib/utils";

export default function GalleryThumbs({ artwork, artworkThumbnails }) {
	const maxRows = 4;
	const artworkRows = splitArray(artworkThumbnails, maxRows);
	const [galleryIndex, setGalleryIndex] = useState(-1);

	return (
		<>
			<div className={styles.thumbs}>
				{artworkRows.map((a, ridx) => (
					<div key={`thumb-${ridx}`} className={styles.row}>
						{a.map((image, idx) => (
							<figure
								key={`thumb-image-${idx}`}
								onClick={() =>
									setGalleryIndex(artworkThumbnails.findIndex((a) => a.id === image.id))
								}
							>
								<Image data={image.responsiveImage} objectFit="contain" />
							</figure>
						))}
					</div>
				))}
			</div>
			<Gallery
				show={galleryIndex > -1}
				images={artwork}
				index={galleryIndex}
				onClose={() => setGalleryIndex(-1)}
			/>
		</>
	);
}
