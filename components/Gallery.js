import styles from './Gallery.module.scss'
import { Image } from "react-datocms"
import { Swiper, SwiperSlide } from 'swiper/react';

export default function Gallery({images, onClose}){
  if(!images) return null;
  
	return (
		<div className={styles.gallery}>
      <div className={styles.images}>
        <Swiper
          spaceBetween={50}
          slidesPerView={1}
          onSlideChange={() => console.log('slide change')}
          onSwiper={(swiper) => console.log(swiper)}
        >
        {images.map((image, idx) => 
          <SwiperSlide className={styles.slide}>
            <Image data={image.responsiveImage}/>
            <div className={styles.label}>{image.title}</div>
          </SwiperSlide>
        )}
        </Swiper>
      </div>
      <div className={styles.close} onClick={onClose}>CLOSE</div>
		</div>
	)
}