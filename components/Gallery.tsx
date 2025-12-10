'use client';

import 'swiper/css';
import cn from 'classnames';
import s from './Gallery.module.scss';
import { Image } from 'react-datocms';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { useState, useRef, useEffect, use } from 'react';
import Link from 'next/link';
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import GalleryLoading from '@/components/GalleryLoading';

export type GalleryProps = {
	images: FileField[];
	index: number;
	backHref: string;
};

export default function Gallery({ images, index: _index, backHref }: GalleryProps) {
	_index = isNaN(_index) ? 0 : _index;

	const router = useRouter();
	const pathname = usePathname();
	const swiperRef = useRef<SwiperType | null>(null);
	const [realIndex, setRealIndex] = useState(_index);
	const [caption, setCaption] = useState<{ title?: any; alt?: any } | null>(null);
	const [loaded, setLoaded] = useState<{ [key: string]: boolean }>({});

	useEffect(() => {
		if (!images || !images[realIndex]) return;
		const image = images[realIndex];
		if (!image) return;
		const { title, alt } = image;
		setCaption({ title, alt });
	}, [images, realIndex]);

	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			switch (e.key) {
				case 'ArrowLeft':
					swiperRef.current?.slidePrev();
					break;
				case 'ArrowRight':
					swiperRef.current?.slideNext();
				case 'Escape':
					router.back();
					break;
			}
		}

		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [images]);

	useEffect(() => {
		const base = pathname.split('/').slice(0, -1).join('/');
		const basePath = !base.includes('gallery') ? `${base}/gallery` : base;
		const url = `${basePath}${realIndex ? `/${realIndex}` : ''}`;
		window.history.replaceState({ ...window.history.state, as: url, url }, '', url);
	}, [realIndex]);

	if (!images) return null;

	return (
		<>
			{!loaded[images[realIndex]?.id] && <GalleryLoading />}

			<div className={cn(s.gallery)}>
				<div className={s.back} onClick={() => swiperRef.current?.slidePrev()}>
					❮
				</div>
				<div className={s.images} onClick={() => swiperRef?.current?.slideNext()}>
					<Swiper
						loop={true}
						spaceBetween={500}
						slidesPerView={1}
						initialSlide={_index}
						onSlideChange={({ realIndex }) => setRealIndex(realIndex)}
						onSwiper={(swiper) => (swiperRef.current = swiper)}
					>
						{images.map((image, idx) => (
							<SwiperSlide key={idx} className={s.slide}>
								{image.responsiveImage && (
									<React.Fragment key={image.id}>
										<Image
											data={image.responsiveImage}
											className={s.imageWrap}
											pictureClassName={s.picture}
											imgClassName={s.image}
											placeholderClassName={s.placeholder}
											fadeInDuration={0}
											usePlaceholder={idx === _index}
											priority={true}
											onLoad={() => setLoaded((l) => ({ ...l, [image.id]: true }))}
										/>
									</React.Fragment>
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
				<Link className={s.close} href={backHref} scroll={true} replace={true}>
					×
				</Link>
			</div>
		</>
	);
}
