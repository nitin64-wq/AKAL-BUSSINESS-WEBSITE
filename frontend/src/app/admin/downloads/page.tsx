/* ============================================================
   ABS — Downloads & Resources Manager
   Allows administrators (restricted to editor+) to add, edit, 
   and toggle active downloads on the downloads page.
   ============================================================ */

'use client';

import React, { useState } from 'react';
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
import { FileText, Download } from 'lucide-react';

interface DownloadItem {
  id: number;
  title: string;
  file_path: string;
  file_size: string | null;
  type: string;
  sort_order: number;
  is_active: boolean;
}

const downloadSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  type: z.string().max(50).optional().nullable(),
  sort_order: z.coerce.number().min(0).default(0),
  is_active: z.boolean().default(true),
});

type DownloadFormValues = z.infer<typeof downloadSchema>;

export default function AdminDownloadsPage() {
  const { can, role } = usePermission();
  const queryClient = useQueryClient();
  const confirm = useConfirm();

  // Fetch downloads list
  const { data: downloadsResponse, isLoading } = useFetch<{ data: DownloadItem[] } | DownloadItem[]>(
    '/admin/downloads',
    ['admin_downloads_all'],
    { params: { per_page: 100 } }
  );

  // Normalize data depending on pagination structure
  const downloads = React.useMemo(() => {
    if (!downloadsResponse) return [];
    if (Array.isArray(downloadsResponse)) return downloadsResponse;
    if (Array.isArray((downloadsResponse as any).data)) return (downloadsResponse as any).data;
    return [];
  }, [downloadsResponse]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingDownload, setEditingDownload] = useState<DownloadItem | null>(null);
  const [resourceFile, setResourceFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DownloadFormValues>({
    resolver: zodResolver(downloadSchema) as any,
    defaultValues: {
      title: '',
      type: '',
      sort_order: 0,
      is_active: true,
    },
  });

  const handleOpenAddModal = () => {
    setEditingDownload(null);
    setResourceFile(null);
    reset({
      title: '',
      type: 'PDF',
      sort_order: downloads.length + 1,
      is_active: true,
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (item: DownloadItem) => {
    setEditingDownload(item);
    setResourceFile(null);
    reset({
      title: item.title,
      type: item.type,
      sort_order: item.sort_order || 0,
      is_active: !!item.is_active,
    });
    setModalOpen(true);
  };

  const handleDelete = async (item: DownloadItem) => {
    if (role !== 'admin') {
      toast.error('Forbidden: Insufficient privileges.');
      return;
    }
    const isConfirmed = await confirm(`Are you sure you want to delete this resource: "${item.title}"?`, {
      title: 'Delete Download Resource',
      confirmText: 'Delete',
      variant: 'danger',
    });
    if (isConfirmed) {
      try {
        await api.delete(`/admin/downloads/${item.id}`);
        toast.success('Download resource deleted.');
        queryClient.invalidateQueries({ queryKey: ['admin_downloads_all'] });
        queryClient.invalidateQueries({ queryKey: ['public_downloads_list'] });
      } catch {
        toast.error('Failed to delete download resource.');
      }
    }
  };

  const onSubmit = async (values: DownloadFormValues) => {
    if (!editingDownload && !resourceFile) {
      toast.error('Please upload a file to publish.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', values.title);
      if (values.type) formData.append('type', values.type);
      formData.append('sort_order', String(values.sort_order));
      formData.append('is_active', values.is_active ? '1' : '0');

      if (resourceFile) {
        formData.append('file', resourceFile);
      }

      if (editingDownload) {
        await api.post(`/admin/downloads/${editingDownload.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Download resource updated.');
      } else {
        await api.post('/admin/downloads', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Download resource uploaded.');
      }

      setModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['admin_downloads_all'] });
      queryClient.invalidateQueries({ queryKey: ['public_downloads_list'] });
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to save resource.';
      toast.error(errorMsg);
    }
  };

  const getFullDownloadUrl = (path: string) => {
    if (!path) return '#';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${api.defaults.baseURL?.replace('/api', '')}/${cleanPath}`;
  };

  const columns = [
    {
      key: 'type',
      label: 'Format',
      sortable: true,
      render: (row: DownloadItem) => (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '2px 8px',
          borderRadius: 'var(--radius-md)',
          fontSize: '11px',
          fontWeight: 600,
          background: 'rgba(251,191,36,0.08)',
          color: 'var(--color-gold-light)',
          border: '1px solid rgba(251,191,36,0.15)'
        }}>
          <FileText size={12} />
          {row.type || 'PDF'}
        </span>
      ),
    },
    { key: 'title', label: 'Resource Title', sortable: true, render: (row: DownloadItem) => (
      <div>
        <span style={{ fontWeight: 600, color: '#FFFFFF' }}>{row.title}</span>
        {row.file_path && (
          <div style={{ marginTop: '4px' }}>
            <a
              href={getFullDownloadUrl(row.file_path)}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: 'var(--text-xxs)', color: 'var(--color-gold)', textDecoration: 'underline' }}
            >
              <Download size={10} /> View File Path ({row.file_size || 'Unknown size'})
            </a>
          </div>
        )}
      </div>
    )},
    { key: 'file_size', label: 'Size', sortable: true, render: (row: DownloadItem) => row.file_size || 'N/A' },
    {
      key: 'is_active',
      label: 'Status',
      sortable: true,
      render: (row: DownloadItem) => (
        <span style={{
          display: 'inline-block',
          padding: '2px 10px',
          borderRadius: 'var(--radius-pill)',
          fontSize: 'var(--text-xs)',
          fontWeight: 600,
          background: row.is_active ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
          color: row.is_active ? '#16A34A' : '#DC2626',
        }}>
          {row.is_active ? 'Active' : 'Hidden'}
        </span>
      ),
    },
    {
      key: 'sort_order',
      label: 'Display Order',
      sortable: true,
      render: (row: DownloadItem) => (
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: '#94A3B8' }}>
          #{row.sort_order || 0}
        </span>
      ),
    },
  ];

  return (
    <div>
      {isLoading ? (
        <div style={{ color: 'var(--color-gold)' }}>Loading download resources...</div>
      ) : (
        <DataTable
          title="Downloads & Study Resources"
          subtitle="Upload competitive syllabus papers, admission flyers, test guides, and academic documents"
          columns={columns}
          data={downloads}
          searchPlaceholder="Search downloads..."
          searchKeys={['title', 'type']}
          onEdit={role === 'admin' || role === 'editor' ? handleOpenEditModal : undefined}
          onDelete={role === 'admin' ? handleDelete : undefined}
          addButton={role === 'admin' || role === 'editor' ? { label: 'Upload Resource', onClick: handleOpenAddModal } : undefined}
        />
      )}

      {/* Modal for Download form */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingDownload ? 'Edit Download Resource' : 'Upload Download Resource'}
        maxWidth="600px"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formGrid}>
            
            {/* Title */}
            <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
              <label className={styles.label} htmlFor="title">Resource Name *</label>
              <input id="title" {...register('title')} className={styles.input} placeholder="e.g. MBA Program Syllabus (2026-28)" />
              {errors.title && <span className={styles.errorText}>{errors.title.message}</span>}
            </div>

            {/* Type/Extension */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="type">Format Override (Optional)</label>
              <input id="type" {...register('type')} className={styles.input} placeholder="Auto-detected if left blank (e.g. PDF)" />
            </div>

            {/* Sort Order */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="sort_order">Display Sort Order</label>
              <input id="sort_order" type="number" {...register('sort_order')} className={styles.input} />
            </div>

            {/* File Upload */}
            <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
              <FileUpload
                onChange={(file) => setResourceFile(file)}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.txt"
                label={editingDownload ? "Replace Document File (Optional)" : "Document File *"}
                maxSizeMB={10}
                currentFileUrl={editingDownload?.file_path ? getFullDownloadUrl(editingDownload.file_path) : undefined}
              />
            </div>

            {/* Active Status */}
            <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" {...register('is_active')} className={styles.checkbox} />
                <span>Show in academic resources list publicly</span>
              </label>
            </div>

          </div>

          <div className={styles.actions}>
            <Button type="button" variant="secondary" size="md" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" disabled={isSubmitting}>
              {isSubmitting ? 'Uploading...' : 'Save Resource'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
