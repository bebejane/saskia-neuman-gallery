import styles from './GalleryThumbs.module.scss'
import { Image } from "react-datocms"

export default function GalleryThumbs({ artwork }) {
  return (
    <div className={styles.galleryThumbs}>
      {artwork.map((image, idx) =>
        <figure><Image key={idx} onClick={() => setGalleryIndex(idx)} data={image.responsiveImage} /></figure>
      )}
    </div>
  )
}