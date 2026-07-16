'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { Button, Badge, ImageWithFallback } from '@/components/ui';
import { Award, Target, ArrowRight } from 'lucide-react';
import { useFetch } from '@/hooks/useFetch';
import { getImageUrl } from '@/lib/utils';
import styles from './HeroSection.module.css';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

interface SlideData {
  image: string;
  badge: string;
  title: string;
  titleHighlight: string;
  description: string;
  primaryBtn: { text: string; link: string };
  secondaryBtn: { text: string; link: string };
  floatCard: { num: string; label: string; icon: 'Award' | 'Target' };
}

interface HeroSlideFromApi {
  id: number;
  title: string;
  title_highlight: string;
  description: string;
  badge: string | null;
  image: string | null;
  primary_btn_text: string;
  primary_btn_link: string;
  secondary_btn_text: string;
  secondary_btn_link: string;
  float_card_num: string | null;
  float_card_label: string | null;
  float_card_icon: 'Award' | 'Target';
  sort_order: number;
  is_active: boolean;
}

export const HeroSection: React.FC = () => {
  const { data: responseData } = useFetch<HeroSlideFromApi[] | { data: HeroSlideFromApi[] }>(
    '/hero-slides',
    ['hero_slides_public']
  );

  const activeSlides = useMemo(() => {
    let apiSlides: HeroSlideFromApi[] = [];
    if (responseData) {
      if (Array.isArray(responseData)) {
        apiSlides = responseData;
      } else if (Array.isArray((responseData as any).data)) {
        apiSlides = (responseData as any).data;
      }
    }

    if (apiSlides.length > 0) {
      return apiSlides.map((slide) => ({
        image: getImageUrl(slide.image),
        badge: slide.badge || '',
        title: slide.title,
        titleHighlight: slide.title_highlight,
        description: slide.description,
        primaryBtn: {
          text: slide.primary_btn_text || 'Apply Now',
          link: slide.primary_btn_link || '/admissions/apply',
        },
        secondaryBtn: {
          text: slide.secondary_btn_text || 'Explore Programs',
          link: slide.secondary_btn_link || '/academics',
        },
        floatCard: {
          num: slide.float_card_num || '',
          label: slide.float_card_label || '',
          icon: slide.float_card_icon || 'Award',
        },
      }));
    }

    return [];
  }, [responseData]);

  if (activeSlides.length === 0) {
    return null;
  }

  return (
    <section className={styles.hero}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        effect="fade"
        slidesPerView={1}
        spaceBetween={0}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        navigation={true}
        pagination={{ clickable: true }}
        className={styles.swiperContainer}
      >
        {activeSlides.map((slide, idx) => {
          const FloatIcon = slide.floatCard.icon === 'Award' ? Award : Target;
          
          return (
            <SwiperSlide key={idx} className={styles.swiperSlide}>
              {/* Background Image with Fallback */}
              <div className={styles.slideBg}>
                <ImageWithFallback
                  src={slide.image}
                  fallbackSrc="/images/placeholder-campus.jpg"
                  alt={slide.title}
                  fill
                  sizes="100vw"
                  priority={idx === 0}
                  style={{ objectFit: 'cover' }}
                />
              </div>

              {/* Dark Gradient Overlay */}
              <div className={styles.slideOverlay} />

              {/* Slide Content */}
              <div className={`container ${styles.container}`}>
                {/* Left Column - Typography and Actions */}
                <div className={styles.content}>
                  <div className={styles.badgeWrapper}>
                    <Badge variant="gold">{slide.badge}</Badge>
                  </div>
                  
                  <h1 className={styles.title}>
                    {slide.title}
                    <span className={styles.titleHighlight}>{slide.titleHighlight}</span>
                  </h1>

                  <p className={styles.description}>
                    {slide.description}
                  </p>

                  <div className={styles.actions}>
                    <Link href={slide.primaryBtn.link}>
                      <Button variant="primary" size="lg" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {slide.primaryBtn.text} <ArrowRight size={18} />
                      </Button>
                    </Link>
                    <Link href={slide.secondaryBtn.link}>
                      <Button 
                        variant="secondary" 
                        size="lg"
                        style={{
                          borderColor: '#FFFFFF',
                          color: '#FFFFFF',
                          backgroundColor: 'transparent'
                        }}
                      >
                        {slide.secondaryBtn.text}
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Right Column - Visual & Floating Stats Card */}
                <div className={styles.visualWrapper}>
                  {/* Floating Stat Card with Slide Specific Stats */}
                  <div className={styles.floatingCard}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FloatIcon size={22} style={{ color: 'var(--color-gold)' }} />
                      <span className={styles.cardNum}>{slide.floatCard.num}</span>
                    </div>
                    <span className={styles.cardLabel}>{slide.floatCard.label}</span>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
};
