import styles from './GalleryThumbs.module.scss'
import { Image } from "react-datocms"
import { useState } from 'react'
import Gallery from './Gallery'

export default function GalleryThumbs({ artwork }) {
  
  const [galleryIndex, setGalleryIndex] = useState()

  return (
    <>
      <div className={styles.galleryThumbs}>
        {artwork.map((image, idx) =>
          <figure onClick={() => setGalleryIndex(idx)}>
            <Image key={idx} data={image.responsiveImage} />
          </figure>
        )}
      </div>
      {galleryIndex !== undefined && 
				<Gallery images={artwork} index={galleryIndex} onClose={()=>setGalleryIndex(undefined)}/>
			}
    </>
  )
}