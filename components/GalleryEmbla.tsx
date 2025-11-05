'use client';

import cn from 'classnames';
import s from './Gallery.module.scss';
import { Image } from 'react-datocms';
import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import useEmblaCarousel from 'embla-carousel-react';

export type GalleryProps = {
	images: FileField[];
	index: number;
	backHref: string;
};

export default function GalleryEmbla({ images, index: _index = 0, backHref }: GalleryProps) {
	const router = useRouter();
	const pathname = usePathname();
	const [emblaRef, emblaApi] = useEmblaCarousel({
		loop: true,
		startIndex: _index,
		duration: 20,
	});
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

	const onSelect = useCallback(() => {
		if (!emblaApi) return;
		setRealIndex(emblaApi.selectedScrollSnap());
	}, [emblaApi]);

	useEffect(() => {
		if (!emblaApi) return;

		onSelect();
		emblaApi.on('select', onSelect);
		emblaApi.on('reInit', onSelect);

		return () => {
			emblaApi.off('select', onSelect);
			emblaApi.off('reInit', onSelect);
		};
	}, [emblaApi, onSelect]);

	const scrollPrev = useCallback(() => {
		if (emblaApi) emblaApi.scrollPrev();
	}, [emblaApi]);

	const scrollNext = useCallback(() => {
		if (emblaApi) emblaApi.scrollNext();
	}, [emblaApi]);

	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			switch (e.key) {
				case 'ArrowLeft':
					scrollPrev();
					break;
				case 'ArrowRight':
					scrollNext();
					break;
				case 'Escape':
					router.back();
					break;
			}
		}

		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [scrollPrev, scrollNext, router]);

	useEffect(() => {
		const url = `${pathname.split('/').slice(0, -1).join('/')}/${realIndex}`;
		window.history.replaceState({ ...window.history.state, as: url, url }, '', url);
	}, [realIndex, pathname]);

	if (!images) return null;

	return (
		<div className={cn(s.gallery)}>
			<div className={s.back} onClick={scrollPrev}>
				❮
			</div>
			<div className={s.images} onClick={scrollNext}>
				<div className='embla' ref={emblaRef}>
					<div className='embla__container' style={{ display: 'flex' }}>
						{images.map((image, idx) => (
							<div key={idx} className={s.slide} style={{ flex: '0 0 100%', minWidth: 0 }}>
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
							</div>
						))}
					</div>
				</div>
			</div>
			<div className={s.forward} onClick={scrollNext}>
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
