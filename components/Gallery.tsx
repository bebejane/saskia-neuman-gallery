import 'swiper/css';
import cn from 'classnames';
import s from './Gallery.module.scss';
import { Image } from 'react-datocms';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useState, useRef, useEffect } from 'react';

export default function Gallery({ show, images, onClose, index = 0 }) {
	const swiperRef = useRef();
	const [realIndex, setRealIndex] = useState(0);
	const [caption, setCaption] = useState({});

	useEffect(() => {
		if (!images || !images[realIndex]) return;
		const { title, alt } = images[realIndex];
		setCaption({ title, alt });
	}, [images, realIndex]);

	useEffect(() => {
		swiperRef.current.slideTo(index + 1);
	}, [index]);

	if (!images) return null;

	return (
		<div className={cn(s.gallery, !show && s.hide)}>
			<div className={s.back} onClick={() => swiperRef.current.slidePrev()}>
				❮
			</div>
			<div className={s.images} onClick={() => swiperRef?.current?.slideNext()} key={index}>
				<Swiper
					loop={true}
					spaceBetween={500}
					slidesPerView={1}
					initialSlide={index}
					onSlideChange={({ realIndex }) => setRealIndex(realIndex)}
					onSwiper={(swiper) => (swiperRef.current = swiper)}
				>
					{images.map((image, idx) => (
						<SwiperSlide key={idx} className={s.slide}>
							{
								<Image
									className={s.image}
									placeholderClassName={s.placeholder}
									pictureClassName={s.picture}
									data={image.responsiveImage}
									fadeInDuration={100}
									lazyLoad={index === idx}
								/>
							}
						</SwiperSlide>
					))}
				</Swiper>
			</div>
			<div className={s.forward} onClick={() => swiperRef.current.slideNext()}>
				❯
			</div>
			<div className={s.caption}>
				<span>{caption.title}</span>
				{caption.alt && <span className={s.subTitle}>{caption.alt}</span>}
			</div>
			<div className={s.close} onClick={onClose}>
				×
			</div>
		</div>
	);
}
