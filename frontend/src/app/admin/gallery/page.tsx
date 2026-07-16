/* ============================================================
   ABS — Campus Life Gallery Manager
   Allows administrators to manage campus life grid items and categories.
   ============================================================ */

'use client';

import React, { useState } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { usePermission } from '@/hooks/usePermission';
import { useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import styles from '../news/News.module.css';
import { DataTable, Modal, FileUpload } from '@/components/admin';
import { Button } from '@/components/ui';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Star } from 'lucide-react';

interface GalleryItem {
  id: number;
  title: string;
  image_url: string;
  thumbnail_url: string | null;
  category: string;
  alt_text: string | null;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
}

const gallerySchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  category: z.string().min(1, 'Category is required').max(255),
  alt_text: z.string().max(255).optional().nullable(),
  is_featured: z.boolean().default(true),
  sort_order: z.coerce.number().min(0).default(0),
});

type GalleryFormValues = z.infer<typeof gallerySchema>;

export default function AdminGalleryPage() {
  const { can } = usePermission();
  const queryClient = useQueryClient();

  // Fetch gallery list
  const { data: galleryItems, isLoading } = useFetch<{ data: GalleryItem[] }>(
    '/admin/gallery',
    ['admin_gallery'],
    { params: { per_page: 100 } }
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GalleryFormValues>({
    resolver: zodResolver(gallerySchema) as any,
    defaultValues: {
      title: '',
      category: 'Infrastructure',
      alt_text: '',
      is_featured: true,
      sort_order: 0,
    },
  });

  const handleOpenAddModal = () => {
    setPhotoFile(null);
    reset({
      title: '',
      category: 'Infrastructure',
      alt_text: '',
      is_featured: true,
      sort_order: 0,
    });
    setModalOpen(true);
  };

  const handleDelete = async (item: GalleryItem) => {
    if (!can('gallery.delete')) {
      toast.error('Forbidden: Insufficient privileges.');
      return;
    }
    if (confirm(`Are you sure you want to delete "${item.title}" from the gallery?`)) {
      try {
        await api.delete(`/admin/gallery/${item.id}`);
        toast.success('Gallery image removed successfully.');
        // Invalidate both admin and public queries
        queryClient.invalidateQueries({ queryKey: ['admin_gallery'] });
        queryClient.invalidateQueries({ queryKey: ['gallery_public'] });
      } catch {
        toast.error('Failed to remove gallery image.');
      }
    }
  };

  const onSubmit = async (values: GalleryFormValues) => {
    if (!photoFile) {
      toast.error('Please upload an image file.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('category', values.category);
      formData.append('is_featured', values.is_featured ? '1' : '0');
      formData.append('sort_order', String(values.sort_order));
      formData.append('image_file', photoFile);

      if (values.alt_text) {
        formData.append('alt_text', values.alt_text);
      }

      await api.post('/admin/gallery', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Gallery image uploaded successfully.');
      setModalOpen(false);
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['admin_gallery'] });
      queryClient.invalidateQueries({ queryKey: ['gallery_public'] });
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to upload gallery image.';
      toast.error(errorMsg);
    }
  };

  const columns = [
    { key: 'title', label: 'Title', sortable: true },
    { key: 'sort_order', label: 'Sort Order', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    {
      key: 'is_featured',
      label: 'Featured',
      sortable: true,
      render: (row: GalleryItem) => row.is_featured ? (
        <span style={{ color: 'var(--color-gold)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: 'var(--text-xs)' }}>
          <Star size={12} fill="var(--color-gold)" /> Yes
        </span>
      ) : <span style={{ color: 'var(--color-muted)' }}>No</span>,
    },
  ];

  // Helper to extract nested paginated data safely
  const rawList = galleryItems as any;
  const tableData = rawList?.data || rawList || [];

  return (
    <div>
      {isLoading ? (
        <div style={{ color: 'var(--color-gold)' }}>Loading gallery items...</div>
      ) : (
        <DataTable
          title="Campus Life Gallery"
          subtitle="Manage the photos, category tags, and display ordering of the Vibrant Campus Life grid"
          columns={columns}
          data={tableData}
          searchPlaceholder="Search by title or category..."
          searchKeys={['title', 'category']}
          onDelete={can('gallery.delete') ? handleDelete : undefined}
          addButton={can('gallery.create') ? { label: 'Upload Image', onClick: handleOpenAddModal } : undefined}
        />
      )}

      {/* Upload Gallery Item Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Upload Gallery Image"
        maxWidth="600px"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formGrid} style={{ gridTemplateColumns: '1fr' }}>
            
            {/* Title */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="title">Image Title *</label>
              <input id="title" {...register('title')} className={styles.input} placeholder="e.g. Innovation & Analytics Lab" />
              {errors.title && <span className={styles.errorText}>{errors.title.message}</span>}
            </div>

            {/* Category */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="category">Category Tag *</label>
              <select id="category" {...register('category')} className={styles.select}>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Research">Research</option>
                <option value="Vibrant Life">Vibrant Life</option>
                <option value="Fitness & Sports">Fitness & Sports</option>
                <option value="Academic Events">Academic Events</option>
                <option value="Engagement">Engagement</option>
                <option value="Campus">Campus</option>
                <option value="Events">Events</option>
              </select>
              {errors.category && <span className={styles.errorText}>{errors.category.message}</span>}
            </div>

            {/* Alt Text */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="alt_text">Alt Text (For accessibility)</label>
              <input id="alt_text" {...register('alt_text')} className={styles.input} placeholder="e.g. Students working in a computer analytics laboratory" />
              {errors.alt_text && <span className={styles.errorText}>{errors.alt_text.message}</span>}
            </div>

            {/* Sort Order */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="sort_order">Display Sort Order</label>
              <input id="sort_order" type="number" {...register('sort_order')} className={styles.input} placeholder="e.g. 0" />
            </div>

            {/* Options */}
            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" {...register('is_featured')} className={styles.checkbox} />
                <span>Feature in gallery grid</span>
              </label>
            </div>

            {/* Image File Upload */}
            <div className={styles.formGroup}>
              <FileUpload
                onChange={(file) => setPhotoFile(file)}
                accept="image/*"
                label="Select Gallery Image (Max 3MB)"
              />
            </div>

          </div>

          <div className={styles.actions}>
            <Button type="button" variant="secondary" size="md" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" disabled={isSubmitting}>
              {isSubmitting ? 'Uploading image...' : 'Upload Image'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
