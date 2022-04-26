import styles from './GalleryThumbs.module.scss'
import { Image } from "react-datocms"
import { useState } from 'react'
import Gallery from './Gallery'
import { splitArray } from '/lib/utils'

export default function GalleryThumbs({ artwork }) {
  
  const maxRows = 4
  const artworkRows = splitArray(artwork, maxRows)
  const [galleryIndex, setGalleryIndex] = useState(-1)
  
  return (
    <>
      <div className={styles.galleryThumbs}>
        {artworkRows.map((artworks, ridx) =>
          <div key={ridx} className={styles.row} style={{flex: `0 0 ${100/artworkRows.length}%`}}>
            {artworks.map((image, idx) =>
              <figure key={idx} onClick={() => setGalleryIndex(artwork.findIndex(a => a.id === image.id))}>
                <Image key={idx} data={image.responsiveImage} pictureClassName={styles.thumb}/>
              </figure>
            )}
          </div>
        )}
      </div>
      {galleryIndex > -1 && <Gallery images={artwork} index={galleryIndex} onClose={()=>setGalleryIndex(-1)}/>}
			
    </>
  )
}