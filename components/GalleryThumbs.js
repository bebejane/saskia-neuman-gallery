import styles from './GalleryThumbs.module.scss'
import { Image } from "react-datocms"
import { useState } from 'react'
import Gallery from './Gallery'
import { splitArray } from '/lib/utils'

export default function GalleryThumbs({ artwork }) {
  
  const maxRows = 4
  const artworkRows = splitArray(artwork, maxRows)
  const [galleryIndex, setGalleryIndex] = useState()
  
  return (
    <>
      <div className={styles.galleryThumbs}>
        {artworkRows.map((artwork, ridx) =>
          <div className={styles.row} style={{flex: `0 0 ${100/artworkRows.length}%`} }>
            {artwork.map((image, idx) =>
              <figure onClick={() => setGalleryIndex(idx)}>
                <Image key={idx} data={image.responsiveImage} pictureClassName={styles.thumb}/>
              </figure>
            )}
          </div>
        )}
      </div>
      {galleryIndex !== undefined && 
				<Gallery images={artwork} index={galleryIndex} onClose={()=>setGalleryIndex(undefined)}/>
			}
    </>
  )
}