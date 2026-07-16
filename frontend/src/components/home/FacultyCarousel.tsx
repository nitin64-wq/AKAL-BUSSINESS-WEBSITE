'use client';

import React, { useMemo } from 'react';
import styles from './FacultyCarousel.module.css';
import { SectionHeader } from '../ui/SectionHeader';
import { Carousel } from '../ui/Carousel';
import { ImageWithFallback } from '../ui/ImageWithFallback';
import { SocialIcons } from '../ui/SocialIcons';
import { useFetch } from '@/hooks/useFetch';
import type { Faculty } from '@/types';
import Link from 'next/link';

export function FacultyCarousel() {
  const { data: facultyList } = useFetch<Faculty[]>(
    '/faculty',
    ['faculty_public']
  );

  const displayFaculty = useMemo(() => {
    if (facultyList !== undefined) {
      return [...facultyList].sort((a, b) => {
        const diff = (a.sort_order ?? 0) - (b.sort_order ?? 0);
        if (diff !== 0) return diff;
        return a.id - b.id;
      });
    }
    return [];
  }, [facultyList]);

  if (displayFaculty.length === 0) {
    return null;
  }

  return (
    <section className={`${styles.section} sectionLight`} id="faculty">
      <div className="container">
        <SectionHeader
          title="Learn From Distinguished Faculty"
          subtitle="Our world-class faculty combine academic excellence with deep industry experience to prepare you for global leadership."
          theme="light"
        />

        <div className={styles.carouselContainer}>
          <Carousel
            slidesPerView={1}
            spaceBetween={24}
            autoplay={true}
            navigation={true}
            pagination={true}
            breakpoints={{
              640: { slidesPerView: 1, spaceBetween: 16 },
              768: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 24 }
            }}
          >
            {displayFaculty.map((member) => (
              <div key={member.id} className={styles.facultyCard}>
                <div className={styles.imageWrapper}>
                  <ImageWithFallback
                    src={member.photo || ''}
                    fallbackSrc="/images/placeholder-faculty.jpg"
                    alt={member.name}
                    className={styles.facultyImage}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className={styles.infoArea}>
                  <h4 className={styles.name}>{member.name}</h4>
                  <p className={styles.designation}>{member.designation}</p>
                  <p className={styles.department}>{member.department}</p>

                  <div className={styles.footer}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {member.linkedin_url && (
                        <a
                          href={member.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.linkedin}
                        >
                          <span className={styles.linkedinIcon}>
                            <SocialIcons platform="linkedin" size={16} />
                          </span>
                          LinkedIn
                        </a>
                      )}
                      {member.google_scholar && (
                        <a
                          href={member.google_scholar}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.linkedin}
                          style={{ color: '#C9A227' }}
                        >
                          <span className={styles.linkedinIcon} style={{ background: 'rgba(201, 162, 39, 0.1)' }}>
                            🎓
                          </span>
                          Scholar
                        </a>
                      )}
                    </div>
                    <Link href={`/faculty/${member.slug}`} className="text-xs gold-gradient-text font-semibold">
                      Profile →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  );
}
