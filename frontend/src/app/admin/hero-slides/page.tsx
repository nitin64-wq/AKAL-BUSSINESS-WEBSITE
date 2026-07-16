/* ============================================================
   ABS — Hero Section Slides Manager
   Allows administrators (restricted to editor+) to add, edit, 
   and toggle active slides on the homepage carousel.
   ============================================================ */

'use client';

import React, { useState, useCallback } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { usePermission } from '@/hooks/usePermission';
import { useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { getImageUrl } from '@/lib/utils';
import styles from '../news/News.module.css'; // Reuse form styles
import { DataTable, Modal, FileUpload } from '@/components/admin';
import { Button } from '@/components/ui';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useConfirm } from '@/context/ConfirmContext';

interface HeroSlide {
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

const slideSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  title_highlight: z.string().min(1, 'Highlighted Title is required').max(255),
  description: z.string().min(1, 'Description is required'),
  badge: z.string().max(255).optional().nullable(),
  primary_btn_text: z.string().max(100).default('Apply Now'),
  primary_btn_link: z.string().max(500).default('/admissions/apply'),
  secondary_btn_text: z.string().max(100).default('Explore Programs'),
  secondary_btn_link: z.string().max(500).default('/academics'),
  float_card_num: z.string().max(50).optional().nullable(),
  float_card_label: z.string().max(100).optional().nullable(),
  float_card_icon: z.enum(['Award', 'Target']).default('Award'),
  sort_order: z.coerce.number().min(0).default(0),
  is_active: z.boolean().default(true),
});

type SlideFormValues = z.infer<typeof slideSchema>;

/** Inline slide thumbnail helper */
function SlideThumb({ title, image }: { title: string; image: string | null }) {
  const [failed, setFailed] = useState(false);
  const onErr = useCallback(() => setFailed(true), []);
  const showImg = image && !failed;

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 36, overflow: 'hidden', borderRadius: 4, background: '#E8ECF4' }}>
      {showImg ? (
        <img
          src={getImageUrl(image)}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={onErr}
        />
      ) : (
        <span style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600 }}>No Image</span>
      )}
    </div>
  );
}

export default function AdminHeroSlidesPage() {
  const { can, role } = usePermission();
  const queryClient = useQueryClient();
  const confirm = useConfirm();

  // Fetch hero slides
  const { data: slidesResponse, isLoading } = useFetch<{ data: HeroSlide[] } | HeroSlide[]>(
    '/admin/hero-slides',
    ['admin_hero_slides_all'],
    { params: { per_page: 100 } }
  );

  // Normalize data depending on pagination structure
  const slides = React.useMemo(() => {
    if (!slidesResponse) return [];
    if (Array.isArray(slidesResponse)) return slidesResponse;
    if (Array.isArray((slidesResponse as any).data)) return (slidesResponse as any).data;
    return [];
  }, [slidesResponse]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [slideImageFile, setSlideImageFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SlideFormValues>({
    resolver: zodResolver(slideSchema) as any,
    defaultValues: {
      title: '',
      title_highlight: '',
      description: '',
      badge: '',
      primary_btn_text: 'Apply Now',
      primary_btn_link: '/admissions/apply',
      secondary_btn_text: 'Explore Programs',
      secondary_btn_link: '/academics',
      float_card_num: '',
      float_card_label: '',
      float_card_icon: 'Award',
      sort_order: 0,
      is_active: true,
    },
  });

  const handleOpenAddModal = () => {
    setEditingSlide(null);
    setSlideImageFile(null);
    reset({
      title: '',
      title_highlight: '',
      description: '',
      badge: '',
      primary_btn_text: 'Apply Now',
      primary_btn_link: '/admissions/apply',
      secondary_btn_text: 'Explore Programs',
      secondary_btn_link: '/academics',
      float_card_num: '',
      float_card_label: '',
      float_card_icon: 'Award',
      sort_order: 0,
      is_active: true,
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setSlideImageFile(null);
    reset({
      title: slide.title,
      title_highlight: slide.title_highlight,
      description: slide.description,
      badge: slide.badge || '',
      primary_btn_text: slide.primary_btn_text,
      primary_btn_link: slide.primary_btn_link,
      secondary_btn_text: slide.secondary_btn_text,
      secondary_btn_link: slide.secondary_btn_link,
      float_card_num: slide.float_card_num || '',
      float_card_label: slide.float_card_label || '',
      float_card_icon: slide.float_card_icon || 'Award',
      sort_order: slide.sort_order || 0,
      is_active: !!slide.is_active,
    });
    setModalOpen(true);
  };

  const handleDelete = async (slide: HeroSlide) => {
    if (role !== 'admin') {
      toast.error('Forbidden: Insufficient privileges.');
      return;
    }
    const isConfirmed = await confirm(`Are you sure you want to delete this hero slide?`, {
      title: 'Delete Hero Slide',
      confirmText: 'Delete',
      variant: 'danger',
    });
    if (isConfirmed) {
      try {
        await api.delete(`/admin/hero-slides/${slide.id}`);
        toast.success('Slide deleted.');
        queryClient.invalidateQueries({ queryKey: ['admin_hero_slides_all'] });
        queryClient.invalidateQueries({ queryKey: ['hero_slides_public'] });
      } catch {
        toast.error('Failed to delete slide.');
      }
    }
  };

  const onSubmit = async (values: SlideFormValues) => {
    try {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('title_highlight', values.title_highlight);
      formData.append('description', values.description);
      
      if (values.badge) formData.append('badge', values.badge);
      formData.append('primary_btn_text', values.primary_btn_text);
      formData.append('primary_btn_link', values.primary_btn_link);
      formData.append('secondary_btn_text', values.secondary_btn_text);
      formData.append('secondary_btn_link', values.secondary_btn_link);
      
      if (values.float_card_num) formData.append('float_card_num', values.float_card_num);
      if (values.float_card_label) formData.append('float_card_label', values.float_card_label);
      formData.append('float_card_icon', values.float_card_icon);
      formData.append('sort_order', String(values.sort_order));
      formData.append('is_active', values.is_active ? '1' : '0');

      if (slideImageFile) {
        formData.append('slide_image', slideImageFile);
      }

      if (editingSlide) {
        await api.post(`/admin/hero-slides/${editingSlide.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Hero slide updated.');
      } else {
        await api.post('/admin/hero-slides', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Hero slide created.');
      }

      setModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['admin_hero_slides_all'] });
      queryClient.invalidateQueries({ queryKey: ['hero_slides_public'] });
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to save hero slide.';
      toast.error(errorMsg);
    }
  };

  const columns = [
    {
      key: 'image',
      label: 'Slide Preview',
      sortable: false,
      render: (row: HeroSlide) => <SlideThumb title={row.title} image={row.image} />,
    },
    { key: 'title', label: 'Title Title Highlight', sortable: true, render: (row: HeroSlide) => (
      <div>
        <span style={{ fontWeight: 600 }}>{row.title}</span>{' '}
        <span style={{ color: 'var(--color-gold)', fontWeight: 600 }}>{row.title_highlight}</span>
      </div>
    )},
    { key: 'badge', label: 'Badge Banner', sortable: true, render: (row: HeroSlide) => row.badge || 'N/A' },
    { key: 'float_card_num', label: 'Stat Badge', sortable: false, render: (row: HeroSlide) => row.float_card_num ? `${row.float_card_num} (${row.float_card_label})` : 'N/A' },
    {
      key: 'is_active',
      label: 'Status',
      sortable: true,
      render: (row: HeroSlide) => (
        <span style={{
          display: 'inline-block',
          padding: '2px 10px',
          borderRadius: 'var(--radius-pill)',
          fontSize: 'var(--text-xs)',
          fontWeight: 600,
          background: row.is_active ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
          color: row.is_active ? '#16A34A' : '#DC2626',
        }}>
          {row.is_active ? 'Active' : 'Draft'}
        </span>
      ),
    },
    {
      key: 'sort_order',
      label: 'Order',
      sortable: true,
      render: (row: HeroSlide) => (
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: '#6B7280' }}>
          #{row.sort_order || 0}
        </span>
      ),
    },
  ];

  return (
    <div>
      {isLoading ? (
        <div style={{ color: 'var(--color-gold)' }}>Loading homepage slides...</div>
      ) : (
        <DataTable
          title="Hero Carousel Management"
          subtitle="Publish slides, edit hero banner texts, background images, CTAs, and overlay metrics"
          columns={columns}
          data={slides}
          searchPlaceholder="Search slides..."
          searchKeys={['title', 'title_highlight', 'description', 'badge']}
          onEdit={role === 'admin' || role === 'editor' ? handleOpenEditModal : undefined}
          onDelete={role === 'admin' ? handleDelete : undefined}
          addButton={role === 'admin' || role === 'editor' ? { label: 'Add Hero Slide', onClick: handleOpenAddModal } : undefined}
        />
      )}

      {/* Modal for Hero Slide form */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingSlide ? 'Edit Hero Slide' : 'Add Hero Slide'}
        maxWidth="700px"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formGrid}>
            
            {/* Title */}
            <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
              <label className={styles.label} htmlFor="title">Hero Title Text *</label>
              <input id="title" {...register('title')} className={styles.input} placeholder="e.g. Transforming Future Leaders Through" />
              {errors.title && <span className={styles.errorText}>{errors.title.message}</span>}
            </div>

            {/* Title Highlight */}
            <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
              <label className={styles.label} htmlFor="title_highlight">Title Highlight (Gold text) *</label>
              <input id="title_highlight" {...register('title_highlight')} className={styles.input} placeholder="e.g. Innovation & Analytics" />
              {errors.title_highlight && <span className={styles.errorText}>{errors.title_highlight.message}</span>}
            </div>

            {/* Description */}
            <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
              <label className={styles.label} htmlFor="description">Slide Description Text *</label>
              <textarea id="description" {...register('description')} className={styles.textarea} rows={3} placeholder="Provide slide details..." />
              {errors.description && <span className={styles.errorText}>{errors.description.message}</span>}
            </div>

            {/* Badge */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="badge">Badge/Promo Ticker</label>
              <input id="badge" {...register('badge')} className={styles.input} placeholder="e.g. 🎓 Admissions Open 2026-2028" />
            </div>

            {/* Image Upload */}
            <div className={styles.formGroup}>
              <FileUpload
                onChange={(file) => setSlideImageFile(file)}
                accept="image/*"
                label="Slide Background Image"
                currentFileUrl={editingSlide?.image ? getImageUrl(editingSlide.image) : undefined}
              />
            </div>

            {/* Primary Button Text */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="primary_btn_text">Primary Button Text</label>
              <input id="primary_btn_text" {...register('primary_btn_text')} className={styles.input} />
            </div>

            {/* Primary Button Link */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="primary_btn_link">Primary Button Path/URL</label>
              <input id="primary_btn_link" {...register('primary_btn_link')} className={styles.input} />
            </div>

            {/* Secondary Button Text */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="secondary_btn_text">Secondary Button Text</label>
              <input id="secondary_btn_text" {...register('secondary_btn_text')} className={styles.input} />
            </div>

            {/* Secondary Button Link */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="secondary_btn_link">Secondary Button Path/URL</label>
              <input id="secondary_btn_link" {...register('secondary_btn_link')} className={styles.input} />
            </div>

            {/* Float Metric Card Number */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="float_card_num">Float Metric Value</label>
              <input id="float_card_num" {...register('float_card_num')} className={styles.input} placeholder="e.g. 95% or ₹12 LPA" />
            </div>

            {/* Float Metric Card Label */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="float_card_label">Float Metric Label</label>
              <input id="float_card_label" {...register('float_card_label')} className={styles.input} placeholder="e.g. Placement Rate" />
            </div>

            {/* Float Card Icon */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="float_card_icon">Float Card Icon</label>
              <select id="float_card_icon" {...register('float_card_icon')} className={styles.select}>
                <option value="Award">Award Badge (Ribbon)</option>
                <option value="Target">Target Goal (Bullseye)</option>
              </select>
            </div>

            {/* Sort Order */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="sort_order">Sequence Sort Order</label>
              <input id="sort_order" type="number" {...register('sort_order')} className={styles.input} />
            </div>

            {/* Active Status */}
            <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" {...register('is_active')} className={styles.checkbox} />
                <span>Publish slide on homepage banner carousel immediately</span>
              </label>
            </div>

          </div>

          <div className={styles.actions}>
            <Button type="button" variant="secondary" size="md" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" disabled={isSubmitting}>
              {isSubmitting ? 'Saving Slide...' : 'Save Slide'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
