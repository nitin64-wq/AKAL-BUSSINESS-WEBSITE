/* ============================================================
   ABS — Testimonials Manager
   Allows administrators to publish, edit, and moderate student testimonials.
   ============================================================ */

'use client';

import React, { useState, useMemo } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { usePermission } from '@/hooks/usePermission';
import { useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import styles from '../news/News.module.css';
import { DataTable, Modal } from '@/components/admin';
import { Button } from '@/components/ui';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useConfirm } from '@/context/ConfirmContext';

interface Testimonial {
  id: number;
  name: string;
  designation: string;
  company: string | null;
  quote: string;
  rating: number;
  batch_year: number | null;
  photo: string | null;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
}

const testimonialSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  designation: z.string().min(1, 'Designation is required').max(255),
  company: z.string().max(255).optional().nullable(),
  quote: z.string().min(1, 'Quote is required').max(1000),
  rating: z.coerce.number().min(1, 'Minimum rating is 1').max(5, 'Maximum rating is 5'),
  batch_year: z.coerce.number().min(2000).max(2099).optional().nullable(),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
  sort_order: z.coerce.number().default(0),
});

type TestimonialFormValues = z.infer<typeof testimonialSchema>;

export default function AdminTestimonialsPage() {
  const { role, can } = usePermission();
  const queryClient = useQueryClient();
  const confirm = useConfirm();

  // Fetch testimonials
  const { data: testimonialsList, isLoading } = useFetch<Testimonial[]>(
    '/admin/testimonials',
    ['admin_testimonials_all'],
    { params: { per_page: 100 } }
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialSchema) as any,
    defaultValues: {
      name: '',
      designation: 'MBA - Business Analytics',
      company: '',
      quote: '',
      rating: 5,
      batch_year: 2024,
      is_featured: true,
      is_active: true,
      sort_order: 1,
    },
  });

  const handleOpenAddModal = () => {
    setEditingTestimonial(null);
    setPhotoFile(null);
    reset({
      name: '',
      designation: 'MBA - Business Analytics',
      company: '',
      quote: '',
      rating: 5,
      batch_year: 2024,
      is_featured: true,
      is_active: true,
      sort_order: 1,
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setPhotoFile(null);
    reset({
      name: testimonial.name,
      designation: testimonial.designation,
      company: testimonial.company || '',
      quote: testimonial.quote,
      rating: testimonial.rating,
      batch_year: testimonial.batch_year || 2024,
      is_featured: !!testimonial.is_featured,
      is_active: !!testimonial.is_active,
      sort_order: testimonial.sort_order || 1,
    });
    setModalOpen(true);
  };

  const handleDelete = async (testimonial: Testimonial) => {
    if (!can('testimonials.delete')) {
      toast.error('Forbidden: Insufficient privileges.');
      return;
    }
    const isConfirmed = await confirm(`Are you sure you want to delete testimonial by "${testimonial.name}"?`, {
      title: 'Delete Testimonial',
      confirmText: 'Delete',
      variant: 'danger',
    });
    if (isConfirmed) {
      try {
        await api.delete(`/admin/testimonials/${testimonial.id}`);
        toast.success('Testimonial deleted successfully.');
        queryClient.invalidateQueries({ queryKey: ['admin_testimonials_all'] });
      } catch {
        toast.error('Failed to delete testimonial.');
      }
    }
  };

  const onSubmit = async (values: TestimonialFormValues) => {
    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('designation', values.designation);
      if (values.company) formData.append('company', values.company);
      formData.append('quote', values.quote);
      formData.append('rating', String(values.rating));
      if (values.batch_year) formData.append('batch_year', String(values.batch_year));
      formData.append('is_featured', values.is_featured ? '1' : '0');
      formData.append('is_active', values.is_active ? '1' : '0');
      formData.append('sort_order', String(values.sort_order));

      if (photoFile) {
        formData.append('photo_file', photoFile);
      }

      if (editingTestimonial) {
        await api.post(`/admin/testimonials/${editingTestimonial.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Testimonial updated successfully.');
      } else {
        await api.post('/admin/testimonials', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Testimonial created successfully.');
      }

      setModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['admin_testimonials_all'] });
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Failed to save testimonial.';
      toast.error(errMsg);
    }
  };

  const isEditorOrAdmin = role === 'admin' || role === 'editor';

  const columns = [
    { key: 'name', label: 'Student Name', sortable: true },
    { key: 'designation', label: 'Designation / Program', sortable: true },
    { key: 'company', label: 'Placement / Company', sortable: true },
    {
      key: 'rating',
      label: 'Rating',
      render: (row: Testimonial) => '★'.repeat(row.rating) + '☆'.repeat(5 - row.rating),
    },
    {
      key: 'is_active',
      label: 'Status',
      sortable: true,
      render: (row: Testimonial) => (
        <span style={{ color: row.is_active ? 'var(--color-success)' : 'var(--color-muted)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)' }}>
          {row.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ];

  return (
    <div>
      {isLoading ? (
        <div style={{ color: 'var(--color-gold)', padding: 'var(--space-8) 0' }}>Loading testimonials...</div>
      ) : (
        <DataTable
          title="Testimonials Manager"
          subtitle="Publish and manage student success stories and testimonies"
          columns={columns}
          data={testimonialsList || []}
          searchPlaceholder="Search testimonials..."
          searchKeys={['name', 'designation', 'company', 'quote']}
          onEdit={isEditorOrAdmin ? handleOpenEditModal : undefined}
          onDelete={role === 'admin' ? handleDelete : undefined}
          addButton={isEditorOrAdmin ? { label: 'Add Testimonial', onClick: handleOpenAddModal } : undefined}
        />
      )}

      {/* Testimonial Form Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="name">Student Name *</label>
              <input id="name" {...register('name')} className={styles.input} placeholder="e.g. Manjinder Kaur" />
              {errors.name && <span className={styles.errorText}>{errors.name.message}</span>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="batch_year">Batch Year</label>
              <input id="batch_year" type="number" {...register('batch_year')} className={styles.input} placeholder="e.g. 2024" />
              {errors.batch_year && <span className={styles.errorText}>{errors.batch_year.message}</span>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="designation">Designation / Program *</label>
              <input id="designation" {...register('designation')} className={styles.input} placeholder="e.g. MBA - Business Analytics" />
              {errors.designation && <span className={styles.errorText}>{errors.designation.message}</span>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="company">Placement info / Company</label>
              <input id="company" {...register('company')} className={styles.input} placeholder="e.g. Placed at KPMG" />
              {errors.company && <span className={styles.errorText}>{errors.company.message}</span>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="rating">Rating (1 - 5) *</label>
              <input id="rating" type="number" {...register('rating')} className={styles.input} placeholder="e.g. 5" />
              {errors.rating && <span className={styles.errorText}>{errors.rating.message}</span>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="sort_order">Sort Order</label>
              <input id="sort_order" type="number" {...register('sort_order')} className={styles.input} />
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label} htmlFor="quote">Testimonial Quote *</label>
              <textarea id="quote" {...register('quote')} className={styles.textarea} rows={4} placeholder="Write the student quote..." />
              {errors.quote && <span className={styles.errorText}>{errors.quote.message}</span>}
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label} htmlFor="photo_file">Photo File (Optional)</label>
              <input
                id="photo_file"
                type="file"
                accept="image/*"
                onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                className={styles.input}
              />
              {editingTestimonial?.photo && (
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>
                  Current photo exists: {editingTestimonial.photo}
                </span>
              )}
            </div>

            <div className={`${styles.checkboxGroup} ${styles.fullWidth}`} style={{ display: 'flex', gap: 'var(--space-6)', margin: 'var(--space-2) 0' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-sm)', color: 'var(--color-off-white)', cursor: 'pointer' }}>
                <input type="checkbox" {...register('is_featured')} style={{ accentColor: 'var(--color-gold)' }} />
                Featured Testimonial
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-sm)', color: 'var(--color-off-white)', cursor: 'pointer' }}>
                <input type="checkbox" {...register('is_active')} style={{ accentColor: 'var(--color-gold)' }} />
                Active Status
              </label>
            </div>
          </div>

          <div className={styles.actions}>
            <Button type="submit" variant="primary" size="md" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : editingTestimonial ? 'Update Testimonial' : 'Save Testimonial'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
