'use client';

import 'swiper/css';
import cn from 'classnames';
import s from './Gallery.module.scss';
import { Image } from 'react-datocms';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import SwiperCore from 'swiper';
import { useState, useRef, useEffect } from 'react';

export type GalleryProps = {
	show: boolean;
	images: FileField[];
	index: number;
};

export default function Gallery({ show, images, index = 0 }: GalleryProps) {
	const swiperRef = useRef<SwiperType | null>(null);
	const [realIndex, setRealIndex] = useState(0);
	const [caption, setCaption] = useState<{ title: string; alt: string } | null>(null);

	useEffect(() => {
		if (!images || !images[realIndex]) return;
		const image = images[realIndex];
		if (!image) return;
		const { title, alt } = image;
		if (!title || !alt) return;
		setCaption({ title, alt });
	}, [images, realIndex]);

	useEffect(() => {
		swiperRef.current?.slideTo(index + 1);
	}, [index]);

	if (!images) return null;

	return (
		<div className={cn(s.gallery, !show && s.hide)}>
			<div className={s.back} onClick={() => swiperRef.current?.slidePrev()}>
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
							{image.responsiveImage && (
								<Image
									data={image.responsiveImage}
									className={s.image}
									placeholderClassName={s.placeholder}
									pictureClassName={s.picture}
									fadeInDuration={100}
									//lazyLoad={index === idx}
								/>
							)}
						</SwiperSlide>
					))}
				</Swiper>
			</div>
			<div className={s.forward} onClick={() => swiperRef.current?.slideNext()}>
				❯
			</div>
			<div className={s.caption}>
				<span>{caption?.title}</span>
				{caption?.alt && <span className={s.subTitle}>{caption.alt}</span>}
			</div>
			<div
				className={s.close}
				//onClick={onClose}
			>
				×
			</div>
		</div>
	);
}
