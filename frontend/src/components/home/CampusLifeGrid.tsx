'use client';

import React, { useMemo, useState } from 'react';
import styles from './CampusLifeGrid.module.css';
import { SectionHeader } from '../ui/SectionHeader';
import { ImageWithFallback } from '../ui/ImageWithFallback';
import { useFetch } from '@/hooks/useFetch';
import { Skeleton } from '@/components/ui';
import { X } from 'lucide-react';
import clsx from 'clsx';

interface GalleryItem {
  id: number;
  title: string;
  category: string;
  image_url: string;
  sort_order: number;
}

export function CampusLifeGrid() {
  const { data: galleryList, isLoading } = useFetch<GalleryItem[]>(
    '/gallery',
    ['gallery_public']
  );

  const { data: settings } = useFetch<Record<string, any>>(
    '/settings',
    ['settings_public']
  );

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeImage, setActiveImage] = useState<GalleryItem | null>(null);

  // Read editable content from settings
  const content = settings?.section_campus_life_content || {};
  const sectionTitle = content.title || 'Vibrant Campus Life';
  const sectionSubtitle = content.subtitle || 'ABS offers a holistic ecosystem that blends intense academics with active student engagement, sports, and cultural milestones.';

  // Sorted full list
  const sortedGallery = useMemo(() => {
    if (galleryList !== undefined) {
      return [...galleryList].sort((a, b) => {
        const diff = (a.sort_order ?? 0) - (b.sort_order ?? 0);
        if (diff !== 0) return diff;
        return a.id - b.id;
      });
    }
    return [];
  }, [galleryList]);

  // Categories list
  const categories = useMemo(() => {
    const list = sortedGallery.map((item) => item.category);
    return ['All', ...Array.from(new Set(list))];
  }, [sortedGallery]);

  // Filtered list
  const filteredGallery = useMemo(() => {
    if (selectedCategory === 'All') return sortedGallery;
    return sortedGallery.filter((item) => item.category === selectedCategory);
  }, [sortedGallery, selectedCategory]);

  if (!isLoading && sortedGallery.length === 0) {
    return null;
  }

  return (
    <section className={`${styles.section} sectionLight`} id="campus-life">
      <div className="container">
        <SectionHeader
          title={sectionTitle}
          subtitle={sectionSubtitle}
          theme="light"
        />

        {/* Category Filters */}
        <div className={styles.filterContainer}>
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCategory(cat)}
              className={clsx(
                styles.filterBtn,
                selectedCategory === cat && styles.activeFilter
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Symmetric Gallery Grid */}
        <div className={styles.grid}>
          {isLoading ? (
            Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className={styles.galleryCell}>
                <Skeleton height="100%" width="100%" />
              </div>
            ))
          ) : filteredGallery.length > 0 ? (
            filteredGallery.slice(0, 6).map((item) => {
              return (
                <div key={item.id} className={styles.galleryCell} onClick={() => setActiveImage(item)}>
                  <ImageWithFallback
                    src={item.image_url}
                    fallbackSrc="/images/placeholder-campus.jpg"
                    alt={item.title}
                    className={styles.image}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className={styles.overlay}>
                    <div className={styles.contentBox}>
                      <span className={styles.category}>{item.category}</span>
                      <h4 className={styles.title}>{item.title}</h4>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className={styles.emptyState}>
              No gallery items found in this category.
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeImage && (
        <div className={styles.lightboxOverlay} onClick={() => setActiveImage(null)}>
          <button className={styles.lightboxClose} onClick={() => setActiveImage(null)}>
            <X size={32} />
          </button>
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <img
              src={activeImage.image_url}
              alt={activeImage.title}
              className={styles.lightboxImage}
            />
            <div className={styles.lightboxCaption}>
              <span className={styles.lightboxCategory}>{activeImage.category}</span>
              <h3 className={styles.lightboxTitle}>{activeImage.title}</h3>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
