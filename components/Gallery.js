import styles from './Gallery.module.scss'
import { Image } from "react-datocms"
import { Swiper, SwiperSlide } from 'swiper/react';
import { useState, useRef, useEffect } from 'react';

export default function Gallery({ images, onClose, index = 0 }) {

  const swiperRef = useRef()
  const [realIndex, setRealIndex] = useState(index)
  const [title, setTitle] = useState()
  
  useEffect(()=>setTitle(images[realIndex].title), [realIndex])

  if(!images) return null

  return (
    <div className={styles.gallery}>
      <div className={styles.back} onClick={()=>swiperRef.current.slidePrev()}>❮</div>
      <div className={styles.images} onClick={() => swiperRef?.current?.slideNext()}>
        <Swiper
          loop={true}
          centerSlides={true}
          spaceBetween={50}
          slidesPerView={1}
          initialSlide={index}
          onSlideChange={({realIndex})=>setRealIndex(realIndex)}
          onSwiper={(swiper) => swiperRef.current = swiper}
        >
          {images.map((image, idx) =>
            <SwiperSlide key={idx} className={styles.slide}>
              <Image 
                data={image.responsiveImage} 
                className={styles.image} 
                pictureClassName={styles.picture}
              />
            </SwiperSlide>
          )}
        </Swiper>
      </div>
      <div className={styles.forward} onClick={()=>swiperRef.current.slideNext()}>❯</div>
      <div className={styles.caption}>{title}</div>
      <div className={styles.close} onClick={onClose}>CLOSE</div>
    </div>
  )
}