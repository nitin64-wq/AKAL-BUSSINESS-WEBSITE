/* ============================================================
   ABS — News & Events Manager
   Allows administrators to publish, edit, and feature news articles,
   research breakthroughs, and placement announcements.
   ============================================================ */

'use client';

import React, { useState } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { usePermission } from '@/hooks/usePermission';
import { useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import styles from './News.module.css';
import { DataTable, Modal, FileUpload, RichEditor } from '@/components/admin';
import { Button } from '@/components/ui';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Star, ShieldAlert, Eye, EyeOff } from 'lucide-react';
import { useConfirm } from '@/context/ConfirmContext';

interface News {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string;
  cover_image: string | null;
  category: 'Industry Talk' | 'International Conference' | 'Placement Drive' | 'Scholarship' | 'Research' | 'Campus News';
  views: number;
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
}

const newsSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  excerpt: z.string().max(1000).optional().nullable(),
  body: z.string().min(10, 'Body content must be at least 10 characters').max(20000),
  category: z.enum(['Industry Talk', 'International Conference', 'Placement Drive', 'Scholarship', 'Research', 'Campus News']),
  is_featured: z.boolean().default(false),
  is_published: z.boolean().default(true),
  meta_title: z.string().max(255).optional().nullable(),
  meta_description: z.string().max(500).optional().nullable(),
});

type NewsFormValues = z.infer<typeof newsSchema>;

export default function AdminNewsPage() {
  const { can } = usePermission();
  const queryClient = useQueryClient();
  const confirm = useConfirm();

  // Fetch news listing
  const { data: newsItems, isLoading } = useFetch<News[]>(
    '/admin/news',
    ['admin_news'],
    { params: { per_page: 100 } }
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsFormValues>({
    resolver: zodResolver(newsSchema) as any,
    defaultValues: {
      title: '',
      excerpt: '',
      body: '',
      category: 'Campus News',
      is_featured: false,
      is_published: true,
      meta_title: '',
      meta_description: '',
    },
  });

  const handleOpenAddModal = () => {
    setEditingNews(null);
    setCoverImageFile(null);
    reset({
      title: '',
      excerpt: '',
      body: '',
      category: 'Campus News',
      is_featured: false,
      is_published: true,
      meta_title: '',
      meta_description: '',
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (article: News) => {
    setEditingNews(article);
    setCoverImageFile(null);
    reset({
      title: article.title,
      excerpt: article.excerpt || '',
      body: article.body,
      category: article.category,
      is_featured: !!article.is_featured,
      is_published: !!article.is_published,
      meta_title: '',
      meta_description: '',
    });
    setModalOpen(true);
  };

  const handleTogglePublish = async (article: News) => {
    if (!can('news.publish')) return;
    try {
      await api.patch(`/admin/news/${article.id}/publish`);
      toast.success('Publish state updated.');
      queryClient.invalidateQueries({ queryKey: ['admin_news'] });
    } catch {
      toast.error('Failed to update publish state.');
    }
  };

  const handleToggleFeature = async (article: News) => {
    if (!can('news.feature')) return;
    try {
      await api.patch(`/admin/news/${article.id}/feature`);
      toast.success('Feature state updated.');
      queryClient.invalidateQueries({ queryKey: ['admin_news'] });
    } catch {
      toast.error('Failed to update feature state.');
    }
  };

  const handleDelete = async (article: News) => {
    if (!can('news.delete')) {
      toast.error('Forbidden: Insufficient privileges.');
      return;
    }
    const isConfirmed = await confirm(`Are you sure you want to delete "${article.title}"?`, {
      title: 'Delete News Article',
      confirmText: 'Delete',
      variant: 'danger',
    });
    if (isConfirmed) {
      try {
        await api.delete(`/admin/news/${article.id}`);
        toast.success('Article deleted successfully.');
        queryClient.invalidateQueries({ queryKey: ['admin_news'] });
      } catch {
        toast.error('Failed to delete article.');
      }
    }
  };

  const onSubmit = async (values: NewsFormValues) => {
    try {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('body', values.body);
      formData.append('category', values.category);

      if (values.excerpt) formData.append('excerpt', values.excerpt);
      formData.append('is_featured', values.is_featured ? '1' : '0');
      formData.append('is_published', values.is_published ? '1' : '0');

      if (values.meta_title) formData.append('meta_title', values.meta_title);
      if (values.meta_description) formData.append('meta_description', values.meta_description);

      if (coverImageFile) {
        formData.append('cover_image_file', coverImageFile);
      }

      if (editingNews) {
        // Edit POST
        await api.post(`/admin/news/${editingNews.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Article updated.');
      } else {
        // Create POST
        await api.post('/admin/news', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Article published.');
      }

      setModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['admin_news'] });
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to publish article.';
      toast.error(errorMsg);
    }
  };

  const columns = [
    { key: 'title', label: 'Article Title', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    {
      key: 'views',
      label: 'Views',
      sortable: true,
      render: (row: News) => `${row.views ?? 0} views`,
    },
    {
      key: 'is_featured',
      label: 'Featured',
      sortable: true,
      render: (row: News) => (
        <button
          onClick={() => handleToggleFeature(row)}
          disabled={!can('news.feature')}
          style={{ display: 'inline-flex', alignItems: 'center' }}
        >
          {row.is_featured ? (
            <span style={{ color: 'var(--color-gold)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: 'var(--text-xs)' }}>
              <Star size={12} fill="var(--color-gold)" /> Yes
            </span>
          ) : <span style={{ color: 'var(--color-muted)' }}>No</span>}
        </button>
      ),
    },
    {
      key: 'is_published',
      label: 'Visibility',
      sortable: true,
      render: (row: News) => (
        <button
          onClick={() => handleTogglePublish(row)}
          disabled={!can('news.publish')}
          style={{ display: 'inline-flex', alignItems: 'center' }}
        >
          {row.is_published ? (
            <span style={{ color: 'var(--color-success)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: 'var(--text-xs)' }}>
              <Eye size={14} /> Published
            </span>
          ) : (
            <span style={{ color: 'var(--color-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: 'var(--text-xs)' }}>
              <EyeOff size={14} /> Draft
            </span>
          )}
        </button>
      ),
    },
    {
      key: 'created_at',
      label: 'Published Date',
      sortable: true,
      render: (row: News) => new Date(row.created_at).toLocaleDateString('en-IN'),
    },
  ];

  return (
    <div>
      {isLoading ? (
        <div style={{ color: 'var(--color-gold)' }}>Loading news items...</div>
      ) : (
        <DataTable
          title="News & Events Publications"
          subtitle="Publish international conferences, campus milestones, industry talks, and placement drives"
          columns={columns}
          data={newsItems || []}
          searchPlaceholder="Search news..."
          searchKeys={['title', 'category', 'excerpt']}
          onEdit={can('news.edit') ? handleOpenEditModal : undefined}
          onDelete={can('news.delete') ? handleDelete : undefined}
          addButton={can('news.create') ? { label: 'Publish Article', onClick: handleOpenAddModal } : undefined}
        />
      )}

      {/* Modal for news publications */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingNews ? 'Edit Published Article' : 'Publish Article'}
        maxWidth="800px"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formGrid}>
            
            {/* Title */}
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label} htmlFor="title">Article Title *</label>
              <input id="title" {...register('title')} className={styles.input} placeholder="e.g. KPMG launches campus placement drive for BBA & MBA students" />
              {errors.title && <span className={styles.errorText}>{errors.title.message}</span>}
            </div>

            {/* Category */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="category">Category *</label>
              <select id="category" {...register('category')} className={styles.select}>
                <option value="Campus News">Campus News</option>
                <option value="Placement Drive">Placement Drive</option>
                <option value="Industry Talk">Industry Talk</option>
                <option value="International Conference">International Conference</option>
                <option value="Scholarship">Scholarship & Waiver</option>
                <option value="Research">Research & Scopus</option>
              </select>
              {errors.category && <span className={styles.errorText}>{errors.category.message}</span>}
            </div>

            {/* Excerpt */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="excerpt">Summary Excerpt</label>
              <input id="excerpt" {...register('excerpt')} className={styles.input} placeholder="A short description of the news to show in index listings..." />
              {errors.excerpt && <span className={styles.errorText}>{errors.excerpt.message}</span>}
            </div>

            {/* Flags */}
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" {...register('is_featured')} className={styles.checkbox} />
                <span>Feature on homepage slideshow / banner</span>
              </label>

              <label className={styles.checkboxLabel}>
                <input type="checkbox" {...register('is_published')} className={styles.checkbox} />
                <span>Publish immediately (show publicly)</span>
              </label>
            </div>

            {/* Rich Editor body */}
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <Controller
                control={control}
                name="body"
                render={({ field: { value, onChange } }) => (
                  <RichEditor
                    value={value}
                    onChange={onChange}
                    label="Article Body (Markdown supported) *"
                    error={errors.body?.message}
                  />
                )}
              />
            </div>

            {/* Image Upload */}
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <FileUpload
                onChange={(file) => setCoverImageFile(file)}
                accept="image/*"
                label="Cover Image Banner"
                currentFileUrl={editingNews?.cover_image ? `${api.defaults.baseURL?.replace('/api', '')}/storage/${editingNews.cover_image}` : undefined}
              />
            </div>

          </div>

          <div className={styles.actions}>
            <Button type="button" variant="secondary" size="md" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" disabled={isSubmitting}>
              {isSubmitting ? 'Publishing...' : 'Save Article'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
