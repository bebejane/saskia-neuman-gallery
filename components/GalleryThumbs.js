import styles from './GalleryThumbs.module.scss'
import { Image } from "react-datocms"
import { useState } from 'react'
import Gallery from './Gallery'
import { splitArray } from '/utils'

export default function GalleryThumbs({ artwork }) {
  
  const maxRows = 4
  const artworkRows = splitArray(artwork, maxRows)
  const [galleryIndex, setGalleryIndex] = useState(-1)
  
  return (
    <>
      <div className={styles.thumbs}>
        {artworkRows.map((artworks, ridx) =>
          <div key={`thumb-${ridx}`} style={{flex: `0 0 ${100/artworkRows.length}%`}} className={styles.row}>
            {artworks.map((image, idx) =>
              <figure key={idx} onClick={() => setGalleryIndex(artwork.findIndex(a => a.id === image.id))}>
                <Image data={image.responsiveImage} pictureClassName={styles.thumb}/>
              </figure>
            )}
          </div>
        )}
      </div>
      {galleryIndex > -1 && <Gallery images={artwork} index={galleryIndex} onClose={()=>setGalleryIndex(-1)}/>}
    </>
  )
}