/* ============================================================
   ABS — Student Achievements Manager
   Allows administrators (restricted to editor+) to add, edit,
   and manage student academic and career milestones.
   ============================================================ */

'use client';

import React, { useState } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { usePermission } from '@/hooks/usePermission';
import { useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import styles from '../news/News.module.css'; // Reuse form styles
import { DataTable, Modal } from '@/components/admin';
import { Button } from '@/components/ui';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';

interface StudentAchievement {
  id: number;
  title: string;
  description: string;
  badge: string | null;
  highlight: string | null;
  icon: string;
  sort_order: number;
  is_active: boolean;
}

const achievementSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().min(1, 'Description is required'),
  badge: z.string().max(100).optional().nullable(),
  highlight: z.string().max(100).optional().nullable(),
  icon: z.string().max(50).default('Trophy'),
  sort_order: z.coerce.number().min(0).default(0),
  is_active: z.boolean().default(true),
});

type AchievementFormValues = z.infer<typeof achievementSchema>;

export default function AdminStudentAchievementsPage() {
  const { role } = usePermission();
  const queryClient = useQueryClient();

  // Fetch achievements
  const { data: responseData, isLoading } = useFetch<{ data: StudentAchievement[] } | StudentAchievement[]>(
    '/admin/student-achievements',
    ['admin_student_achievements_all'],
    { params: { per_page: 100 } }
  );

  const achievements = React.useMemo(() => {
    if (!responseData) return [];
    if (Array.isArray(responseData)) return responseData;
    if (Array.isArray((responseData as any).data)) return (responseData as any).data;
    return [];
  }, [responseData]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<StudentAchievement | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AchievementFormValues>({
    resolver: zodResolver(achievementSchema) as any,
    defaultValues: {
      title: '',
      description: '',
      badge: '',
      highlight: '',
      icon: 'Trophy',
      sort_order: 0,
      is_active: true,
    },
  });

  const handleOpenAddModal = () => {
    setEditingAchievement(null);
    reset({
      title: '',
      description: '',
      badge: '',
      highlight: '',
      icon: 'Trophy',
      sort_order: 0,
      is_active: true,
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (ach: StudentAchievement) => {
    setEditingAchievement(ach);
    reset({
      title: ach.title,
      description: ach.description,
      badge: ach.badge || '',
      highlight: ach.highlight || '',
      icon: ach.icon || 'Trophy',
      sort_order: ach.sort_order || 0,
      is_active: !!ach.is_active,
    });
    setModalOpen(true);
  };

  const handleDelete = async (ach: StudentAchievement) => {
    if (role !== 'admin') {
      toast.error('Forbidden: Insufficient privileges.');
      return;
    }
    if (confirm(`Are you sure you want to delete this achievement?`)) {
      try {
        await api.delete(`/admin/student-achievements/${ach.id}`);
        toast.success('Achievement deleted.');
        queryClient.invalidateQueries({ queryKey: ['admin_student_achievements_all'] });
        queryClient.invalidateQueries({ queryKey: ['student_achievements_public'] });
      } catch {
        toast.error('Failed to delete achievement.');
      }
    }
  };

  const onSubmit = async (values: AchievementFormValues) => {
    try {
      if (editingAchievement) {
        await api.post(`/admin/student-achievements/${editingAchievement.id}`, values);
        toast.success('Achievement updated.');
      } else {
        await api.post('/admin/student-achievements', values);
        toast.success('Achievement created.');
      }

      setModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['admin_student_achievements_all'] });
      queryClient.invalidateQueries({ queryKey: ['student_achievements_public'] });
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to save student achievement.';
      toast.error(errorMsg);
    }
  };

  const columns = [
    { key: 'title', label: 'Achievement Title', sortable: true },
    { key: 'badge', label: 'Category Badge', sortable: true, render: (row: StudentAchievement) => row.badge || 'N/A' },
    { key: 'highlight', label: 'Highlight Tag', sortable: false, render: (row: StudentAchievement) => row.highlight || 'N/A' },
    { key: 'icon', label: 'Icon Type', sortable: false },
    {
      key: 'is_active',
      label: 'Status',
      sortable: true,
      render: (row: StudentAchievement) => (
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
      render: (row: StudentAchievement) => (
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: '#6B7280' }}>
          #{row.sort_order || 0}
        </span>
      ),
    },
  ];

  return (
    <div>
      {isLoading ? (
        <div style={{ color: 'var(--color-gold)' }}>Loading student milestones...</div>
      ) : (
        <DataTable
          title="Student Milestones Ledger"
          subtitle="Publish student awards, incubation triumphs, exam qualifications, and academic conference features"
          columns={columns}
          data={achievements}
          searchPlaceholder="Search milestones..."
          searchKeys={['title', 'description', 'badge', 'highlight']}
          onEdit={role === 'admin' || role === 'editor' ? handleOpenEditModal : undefined}
          onDelete={role === 'admin' ? handleDelete : undefined}
          addButton={role === 'admin' || role === 'editor' ? { label: 'Add Achievement', onClick: handleOpenAddModal } : undefined}
        />
      )}

      {/* Modal for achievement form */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingAchievement ? 'Edit Student Milestone' : 'Add Student Milestone'}
        maxWidth="600px"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formGrid} style={{ gridTemplateColumns: '1fr' }}>
            
            {/* Title */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="title">Milestone Title *</label>
              <input id="title" {...register('title')} className={styles.input} placeholder="e.g. GMAT Qualification" />
              {errors.title && <span className={styles.errorText}>{errors.title.message}</span>}
            </div>

            {/* Description */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="description">Detailed Description *</label>
              <textarea id="description" {...register('description')} className={styles.textarea} rows={4} placeholder="Describe the achievement in detail..." />
              {errors.description && <span className={styles.errorText}>{errors.description.message}</span>}
            </div>

            {/* Badge */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="badge">Category Badge</label>
              <input id="badge" {...register('badge')} className={styles.input} placeholder="e.g. Exam Excellence" />
            </div>

            {/* Highlight */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="highlight">Highlight Text Footer</label>
              <input id="highlight" {...register('highlight')} className={styles.input} placeholder="e.g. GMAT Qualified" />
            </div>

            {/* Icon Select */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="icon">Display Icon Type *</label>
              <select id="icon" {...register('icon')} className={styles.select}>
                <option value="Trophy">🏆 Trophy (Award/Exam)</option>
                <option value="GraduationCap">🎓 Graduation Cap (PhD/Alumni)</option>
                <option value="Lightbulb">💡 Lightbulb (Startup/Incubation)</option>
                <option value="BookOpen">📖 Open Book (Research Paper)</option>
                <option value="Award">🏅 Ribbon Award (Award Recipient)</option>
              </select>
            </div>

            {/* Sort Order */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="sort_order">Sequence Sort Order</label>
              <input id="sort_order" type="number" {...register('sort_order')} className={styles.input} />
            </div>

            {/* Active Status */}
            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" {...register('is_active')} className={styles.checkbox} />
                <span>Publish milestone on homepage immediately</span>
              </label>
            </div>

          </div>

          <div className={styles.actions}>
            <Button type="button" variant="secondary" size="md" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" disabled={isSubmitting}>
              {isSubmitting ? 'Saving Milestone...' : 'Save Milestone'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
