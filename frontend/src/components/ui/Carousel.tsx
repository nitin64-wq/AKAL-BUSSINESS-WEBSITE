'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface CarouselProps {
  children: React.ReactNode[];
  slidesPerView?: number;
  spaceBetween?: number;
  autoplay?: boolean;
  autoplayDelay?: number;
  navigation?: boolean;
  pagination?: boolean;
  loop?: boolean;
  breakpoints?: {
    [width: number]: {
      slidesPerView: number;
      spaceBetween?: number;
    };
  };
  className?: string;
}

export const Carousel: React.FC<CarouselProps> = ({
  children,
  slidesPerView = 1,
  spaceBetween = 24,
  autoplay = true,
  autoplayDelay = 3000,
  navigation = true,
  pagination = true,
  loop = true,
  breakpoints = {
    640: { slidesPerView: 1, spaceBetween: 16 },
    768: { slidesPerView: 2, spaceBetween: 20 },
    1024: { slidesPerView: 3, spaceBetween: 24 },
  },
  className = '',
}) => {
  const modules = [];
  if (navigation) modules.push(Navigation);
  if (pagination) modules.push(Pagination);
  if (autoplay) modules.push(Autoplay);

  return (
    <div className={`swiper-container-wrapper ${className}`} style={{ width: '100%' }}>
      <Swiper
        modules={modules}
        slidesPerView={slidesPerView}
        spaceBetween={spaceBetween}
        loop={loop}
        autoplay={
          autoplay
            ? {
                delay: autoplayDelay,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }
            : false
        }
        navigation={navigation}
        pagination={pagination ? { clickable: true } : false}
        breakpoints={breakpoints}
        className="mySwiper"
        style={
          {
            paddingBottom: pagination ? '40px' : '0px',
            '--swiper-navigation-color': 'var(--color-gold)',
            '--swiper-pagination-color': 'var(--color-gold)',
            '--swiper-pagination-bullet-inactive-color': 'var(--color-border)',
            '--swiper-pagination-bullet-inactive-opacity': '0.5',
            '--swiper-navigation-size': '24px',
          } as React.CSSProperties
        }
      >
        {React.Children.map(children, (child, idx) => (
          <SwiperSlide key={idx} style={{ height: 'auto', display: 'flex' }}>
            {child}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
export { SwiperSlide };
