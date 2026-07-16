/* ============================================================
   ABS — Announcements Manager
   Allows administrators to publish, edit, and moderate scrolling announcements.
   ============================================================ */

'use client';

import React, { useState } from 'react';
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
import { Megaphone, Plus } from 'lucide-react';
import { useConfirm } from '@/context/ConfirmContext';

interface Announcement {
  id: number;
  text: string;
  type: string;
  link: string | null;
  is_active: boolean;
  show_as_card: boolean;
  sort_order: number;
  created_at: string;
}

const announcementSchema = z.object({
  text: z.string().min(1, 'Announcement text is required').max(255),
  type: z.enum(['General', 'Admission', 'Event', 'Placement', 'News']).default('General'),
  link: z.string().max(255).optional().nullable().or(z.literal('')),
  is_active: z.boolean().default(true),
  show_as_card: z.boolean().default(false),
  sort_order: z.coerce.number().default(0),
});

type AnnouncementFormValues = z.infer<typeof announcementSchema>;

export default function AdminAnnouncementsPage() {
  const { can } = usePermission();
  const queryClient = useQueryClient();
  const confirm = useConfirm();

  // Fetch announcements
  const { data: announcementsList, isLoading } = useFetch<Announcement[]>(
    '/admin/announcements',
    ['admin_announcements_all']
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementSchema) as any,
    defaultValues: {
      text: '',
      type: 'General',
      link: '',
      is_active: true,
      show_as_card: false,
      sort_order: 1,
    },
  });

  const handleOpenAddModal = () => {
    setEditingAnnouncement(null);
    reset({
      text: '',
      type: 'General',
      link: '',
      is_active: true,
      show_as_card: false,
      sort_order: announcementsList ? announcementsList.length + 1 : 1,
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    reset({
      text: announcement.text,
      type: (announcement.type as any) || 'General',
      link: announcement.link || '',
      is_active: !!announcement.is_active,
      show_as_card: !!announcement.show_as_card,
      sort_order: announcement.sort_order || 0,
    });
    setModalOpen(true);
  };

  const handleDelete = async (announcement: Announcement) => {
    const isConfirmed = await confirm(`Are you sure you want to delete this announcement: "${announcement.text}"?`, {
      title: 'Delete Announcement',
      confirmText: 'Delete',
      variant: 'danger',
    });
    if (isConfirmed) {
      try {
        await api.delete(`/admin/announcements/${announcement.id}`);
        toast.success('Announcement deleted successfully.');
        queryClient.invalidateQueries({ queryKey: ['admin_announcements_all'] });
        queryClient.invalidateQueries({ queryKey: ['public_announcements'] });
      } catch {
        toast.error('Failed to delete announcement.');
      }
    }
  };

  const onSubmit = async (values: AnnouncementFormValues) => {
    try {
      const payload = {
        text: values.text,
        type: values.type,
        link: values.link || null,
        is_active: values.is_active,
        show_as_card: values.show_as_card,
        sort_order: values.sort_order,
      };

      if (editingAnnouncement) {
        await api.post(`/admin/announcements/${editingAnnouncement.id}`, payload);
        toast.success('Announcement updated successfully.');
      } else {
        await api.post('/admin/announcements', payload);
        toast.success('Announcement created successfully.');
      }

      setModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['admin_announcements_all'] });
      queryClient.invalidateQueries({ queryKey: ['public_announcements'] });
    } catch {
      toast.error('Failed to save announcement. Please try again.');
    }
  };

  const getTypeBadgeStyle = (type: string) => {
    switch (type) {
      case 'Admission': return { backgroundColor: '#FEF3C7', color: '#D97706' }; // Amber
      case 'Event': return { backgroundColor: '#F3E8FF', color: '#7C3AED' }; // Purple
      case 'Placement': return { backgroundColor: '#D1FAE5', color: '#059669' }; // Emerald
      case 'News': return { backgroundColor: '#E0F2FE', color: '#0284C7' }; // Sky
      default: return { backgroundColor: '#F3F4F6', color: '#4B5563' }; // Gray
    }
  };

  // DataTable Columns definition
  const columns = [
    {
      key: 'sort_order',
      label: 'Sort Order',
      render: (row: Announcement) => <span style={{ fontWeight: 'bold', color: 'var(--color-gold)' }}>{row.sort_order}</span>,
    },
    {
      key: 'type',
      label: 'Type',
      render: (row: Announcement) => {
        const style = getTypeBadgeStyle(row.type || 'General');
        return (
          <span 
            style={{ 
              display: 'inline-block', 
              padding: '2px 8px', 
              borderRadius: '9999px', 
              fontSize: '11px', 
              fontWeight: '600',
              ...style 
            }}
          >
            {row.type || 'General'}
          </span>
        );
      }
    },
    {
      key: 'text',
      label: 'Announcement Text',
      render: (row: Announcement) => <span style={{ fontWeight: '500' }}>{row.text}</span>,
    },
    {
      key: 'link',
      label: 'Target Link',
      render: (row: Announcement) => row.link ? (
        <a 
          href={row.link} 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{ color: 'var(--color-gold)', textDecoration: 'underline', fontSize: 'var(--text-xs)' }}
        >
          {row.link}
        </a>
      ) : (
        <span style={{ color: 'var(--color-muted)', fontSize: 'var(--text-xs)' }}>None</span>
      ),
    },
    {
      key: 'is_active',
      label: 'Marquee',
      render: (row: Announcement) => (
        <span className={`${styles.badge} ${row.is_active ? styles.badgeActive : styles.badgeDraft}`}>
          {row.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'show_as_card',
      label: 'Homepage Card',
      render: (row: Announcement) => (
        <span className={`${styles.badge} ${row.show_as_card ? styles.badgeActive : styles.badgeDraft}`} style={row.show_as_card ? { backgroundColor: '#D1FAE5', color: '#059669' } : undefined}>
          {row.show_as_card ? 'Yes' : 'No'}
        </span>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Scrolling Announcements</h1>
          <p className={styles.subtitle}>
            Manage multiple announcements scrolling in the top marquee ticker.
          </p>
        </div>
        <Button onClick={handleOpenAddModal} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={16} /> Add Announcement
        </Button>
      </div>

      {isLoading ? (
        <div style={{ color: 'var(--color-gold)', padding: 'var(--space-8) 0' }}>
          Loading announcements...
        </div>
      ) : (
        <DataTable
          title="Top Marquee Announcements"
          subtitle="List of all announcements. Active ones will scroll at the very top of the website."
          columns={columns}
          data={announcementsList || []}
          searchPlaceholder="Search announcements..."
          onEdit={handleOpenEditModal}
          onDelete={handleDelete}
          actionsColumnWidth="100px"
        />
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingAnnouncement ? 'Edit Announcement' : 'Add Announcement'}
        maxWidth="600px"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Announcement Text */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Announcement Text *</label>
            <input
              type="text"
              {...register('text')}
              className={styles.input}
              placeholder="e.g. Registration open for MBA Business Analytics 2026-2028 batch"
            />
            {errors.text && (
              <span style={{ color: 'var(--color-error)', fontSize: 'var(--text-xs)' }}>
                {errors.text.message as string}
              </span>
            )}
          </div>

          {/* Announcement Type */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Announcement Type *</label>
            <select
              {...register('type')}
              className={styles.input}
            >
              <option value="General">General</option>
              <option value="Admission">Admission</option>
              <option value="Event">Event</option>
              <option value="Placement">Placement</option>
              <option value="News">News</option>
            </select>
            {errors.type && (
              <span style={{ color: 'var(--color-error)', fontSize: 'var(--text-xs)' }}>
                {errors.type.message as string}
              </span>
            )}
          </div>

          {/* Target Link */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Target Link / URL (Optional)</label>
            <input
              type="text"
              {...register('link')}
              className={styles.input}
              placeholder="e.g. https://forms.gle/... or /admissions/apply"
            />
            {errors.link && (
              <span style={{ color: 'var(--color-error)', fontSize: 'var(--text-xs)' }}>
                {errors.link.message as string}
              </span>
            )}
            <span style={{ color: 'var(--color-muted)', fontSize: 'var(--text-xxs)' }}>
              Leave blank to use the default Admissions Google Form link.
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            {/* Sort Order */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Sort Order</label>
              <input
                type="number"
                {...register('sort_order')}
                className={styles.input}
                placeholder="e.g. 1"
              />
              {errors.sort_order && (
                <span style={{ color: 'var(--color-error)', fontSize: 'var(--text-xs)' }}>
                  {errors.sort_order.message as string}
                </span>
              )}
            </div>

            {/* Toggles */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  {...register('is_active')}
                  className={styles.checkbox}
                />
                <span>Active (Show in marquee)</span>
              </label>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  {...register('show_as_card')}
                  className={styles.checkbox}
                />
                <span>Show as Card on Homepage</span>
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Announcement'}
            </Button>
          </div>

        </form>
      </Modal>
    </div>
  );
}
