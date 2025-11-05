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

export type GalleryProps = {
	images: FileField[];
	index: number;
	backHref: string;
};

export default function Gallery({ images, index: _index = 0, backHref }: GalleryProps) {
	const router = useRouter();
	const pathname = usePathname();
	const swiperRef = useRef<SwiperType | null>(null);
	const [show, setShow] = useState(false);
	const [realIndex, setRealIndex] = useState(_index);
	const [caption, setCaption] = useState<{ title?: any; alt?: any } | null>(null);
	const [loaded, setLoaded] = useState<{ [key: string]: boolean }>({});

	useEffect(() => {
		//setShow(true);
	}, []);

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
		const url = `${pathname.split('/').slice(0, -1).join('/')}/${realIndex}`;
		window.history.replaceState({ ...window.history.state, as: url, url }, '', url);
	}, [realIndex]);

	if (!images) return null;

	return (
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
					virtual={typeof window !== 'undefined' ? false : true}
					onSlideChange={({ realIndex }) => setRealIndex(realIndex)}
					onSwiper={(swiper) => (swiperRef.current = swiper)}
				>
					{images.map((image, idx) => (
						<SwiperSlide key={idx} className={s.slide}>
							{image.responsiveImage && (
								<React.Fragment key={image.id}>
									<Image
										data={image.responsiveImage}
										className={s.image}
										placeholderClassName={s.placeholder}
										imgClassName={s.picture}
										fadeInDuration={0}
										usePlaceholder={idx === _index}
										priority={true}
										onLoad={() => setLoaded((l) => ({ ...l, [image.id]: true }))}
									/>
									{!loaded[image.id] && (
										<div className={s.loading}>
											<div className={s.loader}></div>
										</div>
									)}
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
			<Link className={s.close} href={backHref}>
				×
			</Link>
		</div>
	);
}
