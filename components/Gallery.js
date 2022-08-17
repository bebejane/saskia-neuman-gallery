import "swiper/css";
import styles from './Gallery.module.scss'
import { Image } from "react-datocms"
import { Swiper, SwiperSlide } from 'swiper/react';
import { useState, useRef, useEffect } from 'react';

export default function Gallery({ images, onClose, index = 0 }) {

  const swiperRef = useRef()
  const [realIndex, setRealIndex] = useState(index)
  const [caption, setCaption] = useState({})

  useEffect(() => {
    const { title, alt} = images[realIndex]
    setCaption({title, alt})
  }, [realIndex])
  
  if (!images) return null

  return (
    <div className={styles.gallery}>
      <div className={styles.back} onClick={() => swiperRef.current.slidePrev()}>❮</div>
      <div className={styles.images} onClick={() => swiperRef?.current?.slideNext()}>
        <Swiper
          loop={true}
          spaceBetween={500}
          slidesPerView={1}
          initialSlide={index}
          onSlideChange={({ realIndex }) => setRealIndex(realIndex)}
          onSwiper={(swiper) => swiperRef.current = swiper}
        >
          {images.map((image, idx) =>
            <SwiperSlide key={idx} className={styles.slide}>
              {<Image
                className={styles.image}
                pictureClassName={styles.picture}
                data={image.responsiveImage}
                lazyLoad={false}
                usePlaceholder={false}
              />}
            </SwiperSlide>
          )}
        </Swiper>
      </div>
      <div className={styles.forward} onClick={() => swiperRef.current.slideNext()}>❯</div>
      <div className={styles.caption}>
        <span>{caption.title}</span>
        {caption.alt && <span>{caption.alt}</span>}
      </div>
      <div className={styles.close} onClick={onClose}>×</div>
    </div>
  )
}