/* ============================================================
   ABS — Events Planning Panel
   Allows administrators to publish and manage campus events & schedules.
   ============================================================ */

'use client';

import React, { useState } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { usePermission } from '@/hooks/usePermission';
import { useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import styles from '../news/News.module.css'; // Reuse form grid styles
import { DataTable, Modal } from '@/components/admin';
import { Button } from '@/components/ui';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';

interface EventRecord {
  id: number;
  title: string;
  slug: string;
  event_date: string;
  event_time: string | null;
  venue: string;
  description: string;
  registration_url: string | null;
  is_upcoming: boolean;
  is_published: boolean;
}

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  event_date: z.string().min(1, 'Date is required'),
  event_time: z.string().max(100).optional().nullable(),
  venue: z.string().min(1, 'Venue is required').max(255),
  description: z.string().min(1, 'Description is required').max(2000),
  registration_url: z.string().url('Invalid URL').max(255).optional().nullable().or(z.literal('')),
  is_upcoming: z.boolean().default(true),
});

type EventFormValues = z.infer<typeof eventSchema>;

export default function AdminEventsPage() {
  const { can } = usePermission();
  const queryClient = useQueryClient();

  // Fetch events
  const { data: events, isLoading } = useFetch<EventRecord[]>(
    '/admin/events',
    ['admin_events_all'],
    { params: { per_page: 100 } }
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventRecord | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema) as any,
    defaultValues: {
      title: '',
      event_date: '',
      event_time: '',
      venue: '',
      description: '',
      registration_url: '',
      is_upcoming: true,
    },
  });

  const handleOpenAddModal = () => {
    setEditingEvent(null);
    reset({
      title: '',
      event_date: new Date().toISOString().slice(0, 10),
      event_time: '10:00 AM',
      venue: 'ABS Seminar Hall',
      description: '',
      registration_url: '',
      is_upcoming: true,
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (event: EventRecord) => {
    setEditingEvent(event);
    reset({
      title: event.title,
      event_date: event.event_date ? event.event_date.substring(0, 10) : '',
      event_time: event.event_time || '',
      venue: event.venue,
      description: event.description || '',
      registration_url: event.registration_url || '',
      is_upcoming: !!event.is_upcoming,
    });
    setModalOpen(true);
  };

  const handleDelete = async (event: EventRecord) => {
    if (!can('events.delete')) {
      toast.error('Forbidden: Insufficient privileges.');
      return;
    }
    if (confirm(`Are you sure you want to cancel event "${event.title}"?`)) {
      try {
        await api.delete(`/admin/events/${event.id}`);
        toast.success('Event deleted.');
        queryClient.invalidateQueries({ queryKey: ['admin_events_all'] });
      } catch {
        toast.error('Failed to delete event.');
      }
    }
  };

  const onSubmit = async (values: EventFormValues) => {
    try {
      const payload = {
        ...values,
        is_upcoming: values.is_upcoming ? 1 : 0,
        is_published: 1, // Default to published when created/updated from admin panel
      };

      if (editingEvent) {
        await api.post(`/admin/events/${editingEvent.id}`, { ...payload, _method: 'PUT' });
        toast.success('Event updated.');
      } else {
        await api.post('/admin/events', payload);
        toast.success('Event published.');
      }

      setModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['admin_events_all'] });
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to save event.';
      toast.error(errorMsg);
    }
  };

  const columns = [
    { key: 'title', label: 'Event Title', sortable: true },
    {
      key: 'event_date',
      label: 'Date',
      sortable: true,
      render: (row: EventRecord) => {
        if (!row.event_date) return 'N/A';
        const dateObj = new Date(row.event_date);
        return isNaN(dateObj.getTime()) ? row.event_date : dateObj.toLocaleDateString('en-IN');
      }
    },
    { key: 'event_time', label: 'Time' },
    { key: 'venue', label: 'Venue', sortable: true },
    {
      key: 'is_upcoming',
      label: 'Status',
      sortable: true,
      render: (row: EventRecord) => row.is_upcoming ? (
        <span style={{ color: 'var(--color-gold-light)', fontSize: 'var(--text-xs)', fontWeight: 'bold' }}>Upcoming</span>
      ) : <span style={{ color: 'var(--color-muted)', fontSize: 'var(--text-xs)' }}>Concluded</span>,
    },
  ];

  return (
    <div>
      {isLoading ? (
        <div style={{ color: 'var(--color-gold)' }}>Loading campus calendar...</div>
      ) : (
        <DataTable
          title="Campus Events Schedule"
          subtitle="Publish seminars, guest talks, sports events, and cultural milestones"
          columns={columns}
          data={events || []}
          searchPlaceholder="Search events..."
          searchKeys={['title', 'venue', 'description']}
          onEdit={can('events.edit') ? handleOpenEditModal : undefined}
          onDelete={can('events.delete') ? handleDelete : undefined}
          addButton={can('events.create') ? { label: 'Publish Event', onClick: handleOpenAddModal } : undefined}
        />
      )}

      {/* Add / Edit Event Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingEvent ? 'Edit Event Details' : 'Publish New Event'}
        maxWidth="600px"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formGrid} style={{ gridTemplateColumns: '1fr' }}>
            
            {/* Title */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="title">Event Title *</label>
              <input id="title" {...register('title')} className={styles.input} placeholder="e.g. Industry Conclave on Business Analytics" />
              {errors.title && <span className={styles.errorText}>{errors.title.message}</span>}
            </div>

            {/* Date */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="event_date">Scheduled Date *</label>
              <input id="event_date" type="date" {...register('event_date')} className={styles.input} />
              {errors.event_date && <span className={styles.errorText}>{errors.event_date.message}</span>}
            </div>

            {/* Time */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="event_time">Scheduled Time</label>
              <input id="event_time" {...register('event_time')} className={styles.input} placeholder="e.g. 10:00 AM to 1:00 PM" />
              {errors.event_time && <span className={styles.errorText}>{errors.event_time.message}</span>}
            </div>

            {/* Venue */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="venue">Venue *</label>
              <input id="venue" {...register('venue')} className={styles.input} placeholder="e.g. ABS Seminar Hall, Baru Sahib" />
              {errors.venue && <span className={styles.errorText}>{errors.venue.message}</span>}
            </div>

            {/* Registration Link */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="registration_url">Registration Link (URL)</label>
              <input id="registration_url" {...register('registration_url')} className={styles.input} placeholder="https://forms.gle/..." />
              {errors.registration_url && <span className={styles.errorText}>{errors.registration_url.message}</span>}
            </div>

            {/* Upcoming status */}
            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" {...register('is_upcoming')} className={styles.checkbox} />
                <span>Mark as active upcoming event</span>
              </label>
            </div>

            {/* Description */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="description">Event Summary *</label>
              <textarea id="description" {...register('description')} className={styles.textarea} placeholder="Describe schedule details, speakers profile, and registration guidelines..." />
              {errors.description && <span className={styles.errorText}>{errors.description.message}</span>}
            </div>

          </div>

          <div className={styles.actions}>
            <Button type="button" variant="secondary" size="md" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Event'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
