import styles from './Gallery.module.scss'
import { Image } from "react-datocms"
import { Swiper, SwiperSlide } from 'swiper/react';
import { useState, useRef } from 'react';

export default function Gallery({ images, onClose, index = 0 }) {
  if (!images) return null;
  const swiperRef = useRef()

  return (
    <div className={styles.gallery}>
      <div className={styles.images} onClick={() => swiperRef?.current?.slideNext()}>
        <Swiper
          loop={true}
          centerSlided={true}
          spaceBetween={50}
          slidesPerView={1}
          effect={'cube'}
          initialSlide={index}
          onSwiper={(swiper) => swiperRef.current = swiper}
        >
          {images.map((image, idx) =>
            <SwiperSlide key={idx} className={styles.slide}>
              <Image data={image.responsiveImage} />
              <div className={styles.label}>{image.title}</div>
            </SwiperSlide>
          )}
        </Swiper>
      </div>
      <div className={styles.close} onClick={onClose}>CLOSE</div>
      <div className={styles.caption}>Här kommer bildtext</div>
    </div>
  )
}