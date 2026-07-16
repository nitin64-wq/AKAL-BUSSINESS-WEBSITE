/* ============================================================
   ABS — Scholarships & Waivers Manager
   Allows editors to publish and manage merit waivers and sports aids.
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

interface Scholarship {
  id: number;
  title: string;
  amount_percent: number;
  criteria: string;
  description: string | null;
  application_deadline: string | null;
}

const scholarshipSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  amount_percent: z.coerce.number().min(1, 'Minimum amount is 1%').max(100, 'Maximum amount is 100%'),
  criteria: z.string().min(1, 'Eligibility criteria is required').max(500),
  description: z.string().max(2000).optional().nullable(),
  application_deadline: z.string().optional().nullable().or(z.literal('')),
});

type ScholarshipFormValues = z.infer<typeof scholarshipSchema>;

export default function AdminScholarshipsPage() {
  const { can } = usePermission();
  const queryClient = useQueryClient();

  // Fetch scholarships
  const { data: scholarships, isLoading } = useFetch<Scholarship[]>(
    '/admin/scholarships',
    ['admin_scholarships_all'],
    { params: { per_page: 100 } }
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [editingScholarship, setEditingScholarship] = useState<Scholarship | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ScholarshipFormValues>({
    resolver: zodResolver(scholarshipSchema) as any,
    defaultValues: {
      title: '',
      amount_percent: 50,
      criteria: '',
      description: '',
      application_deadline: '',
    },
  });

  const handleOpenAddModal = () => {
    setEditingScholarship(null);
    reset({
      title: '',
      amount_percent: 50,
      criteria: '90% or above in qualifying examination',
      description: '',
      application_deadline: '',
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (scholarship: Scholarship) => {
    setEditingScholarship(scholarship);
    reset({
      title: scholarship.title,
      amount_percent: scholarship.amount_percent,
      criteria: scholarship.criteria,
      description: scholarship.description || '',
      application_deadline: scholarship.application_deadline || '',
    });
    setModalOpen(true);
  };

  const handleDelete = async (scholarship: Scholarship) => {
    if (!can('scholarships.delete')) {
      toast.error('Forbidden: Insufficient privileges.');
      return;
    }
    if (confirm(`Are you sure you want to delete scholarship "${scholarship.title}"?`)) {
      try {
        await api.delete(`/admin/scholarships/${scholarship.id}`);
        toast.success('Scholarship deleted.');
        queryClient.invalidateQueries({ queryKey: ['admin_scholarships_all'] });
      } catch {
        toast.error('Failed to delete scholarship.');
      }
    }
  };

  const onSubmit = async (values: ScholarshipFormValues) => {
    try {
      const payload = {
        ...values,
        application_deadline: values.application_deadline || null,
      };

      if (editingScholarship) {
        // PUT update
        await api.put(`/admin/scholarships/${editingScholarship.id}`, payload);
        toast.success('Scholarship updated.');
      } else {
        // POST store
        await api.post('/admin/scholarships', payload);
        toast.success('Scholarship created.');
      }

      setModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['admin_scholarships_all'] });
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to save scholarship.';
      toast.error(errorMsg);
    }
  };

  const columns = [
    { key: 'title', label: 'Scholarship Scheme', sortable: true },
    {
      key: 'amount_percent',
      label: 'Waiver Amount',
      sortable: true,
      render: (row: Scholarship) => `${row.amount_percent}% Tuition Waiver`,
    },
    { key: 'criteria', label: 'Qualifying Criteria', sortable: true },
    {
      key: 'application_deadline',
      label: 'Deadline',
      sortable: true,
      render: (row: Scholarship) => row.application_deadline ? new Date(row.application_deadline).toLocaleDateString('en-IN') : 'Open Roster',
    },
  ];

  return (
    <div>
      {isLoading ? (
        <div style={{ color: 'var(--color-gold)' }}>Loading scholarships catalog...</div>
      ) : (
        <DataTable
          title="Scholarships & Tuition Waivers"
          subtitle="Publish merit concessions, sports assistantships, and doctoral stipends"
          columns={columns}
          data={scholarships || []}
          searchPlaceholder="Search scholarships..."
          searchKeys={['title', 'criteria', 'description']}
          onEdit={can('scholarships.manage') ? handleOpenEditModal : undefined}
          onDelete={can('scholarships.delete') ? handleDelete : undefined}
          addButton={can('scholarships.manage') ? { label: 'Add Scholarship', onClick: handleOpenAddModal } : undefined}
        />
      )}

      {/* Add / Edit Scholarship Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingScholarship ? 'Edit Scholarship Details' : 'Create Scholarship Scheme'}
        maxWidth="600px"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formGrid} style={{ gridTemplateColumns: '1fr' }}>
            
            {/* Title */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="title">Scholarship Title *</label>
              <input id="title" {...register('title')} className={styles.input} placeholder="e.g. Merit Scholarship for Academic Excellence" />
              {errors.title && <span className={styles.errorText}>{errors.title.message}</span>}
            </div>

            {/* Waiver Percent */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="amount_percent">Tuition Fee Waiver (%) *</label>
              <input id="amount_percent" type="number" {...register('amount_percent')} className={styles.input} placeholder="e.g. 50" />
              {errors.amount_percent && <span className={styles.errorText}>{errors.amount_percent.message}</span>}
            </div>

            {/* Criteria */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="criteria">Eligibility Criteria *</label>
              <input id="criteria" {...register('criteria')} className={styles.input} placeholder="e.g. 90% and above in graduation metrics" />
              {errors.criteria && <span className={styles.errorText}>{errors.criteria.message}</span>}
            </div>

            {/* Deadline */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="application_deadline">Application Deadline</label>
              <input id="application_deadline" type="date" {...register('application_deadline')} className={styles.input} />
            </div>

            {/* Description */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="description">Scholarship Details</label>
              <textarea id="description" {...register('description')} className={styles.textarea} placeholder="Describe rules, limitations, renewal guidelines, and application documents needed..." />
            </div>

          </div>

          <div className={styles.actions}>
            <Button type="button" variant="secondary" size="md" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Scheme'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
