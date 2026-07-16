/* ============================================================
   ABS — Programs Management Panel
   Allows administrators to view, create, edit, delete, and toggle
   active state of academic programs.
   ============================================================ */

'use client';

import React, { useState } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { usePermission } from '@/hooks/usePermission';
import { useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import styles from './Programs.module.css';
import { DataTable, Modal, FileUpload } from '@/components/admin';
import { Button } from '@/components/ui';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useConfirm } from '@/context/ConfirmContext';

interface Program {
  id: number;
  title: string;
  slug: string;
  type: 'MBA' | 'BBA' | 'IMP' | 'Executive' | 'Doctoral' | 'Certificate';
  duration: string;
  description: string;
  highlights: string[];
  eligibility: string | null;
  fee_per_year: number | null;
  seats: number | null;
  cover_image: string | null;
  brochure_url: string | null;
  is_active: boolean;
  sort_order: number;
}

const programSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  type: z.enum(['MBA', 'BBA', 'IMP', 'Executive', 'Doctoral', 'Certificate']),
  duration: z.string().min(1, 'Duration is required').max(100),
  description: z.string().min(1, 'Description is required').max(5000),
  highlights: z.array(z.string().min(1, 'Highlight item cannot be empty')),
  eligibility: z.string().max(1000).optional().nullable(),
  fee_per_year: z.coerce.number().min(0).optional().nullable(),
  seats: z.coerce.number().min(1).optional().nullable(),
  is_active: z.boolean().default(true),
  sort_order: z.coerce.number().min(0).default(0),
  meta_title: z.string().max(255).optional().nullable(),
  meta_description: z.string().max(500).optional().nullable(),
});

type ProgramFormValues = z.infer<typeof programSchema>;

export default function AdminProgramsPage() {
  const { can } = usePermission();
  const queryClient = useQueryClient();
  const confirm = useConfirm();

  // Fetch list of programs (fetch with large limit to display in client-side table)
  const { data: programs, isLoading } = useFetch<Program[]>(
    '/admin/programs',
    ['admin_programs'],
    { params: { per_page: 100 } }
  );

  // Modals & form state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);

  // File Upload states
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [brochureFile, setBrochureFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProgramFormValues>({
    resolver: zodResolver(programSchema) as any,
    defaultValues: {
      title: '',
      type: 'MBA',
      duration: '',
      description: '',
      highlights: [''],
      eligibility: '',
      fee_per_year: null,
      seats: null,
      is_active: true,
      sort_order: 0,
      meta_title: '',
      meta_description: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'highlights' as never,
  });

  const handleOpenAddModal = () => {
    setEditingProgram(null);
    setCoverImageFile(null);
    setBrochureFile(null);
    reset({
      title: '',
      type: 'MBA',
      duration: '',
      description: '',
      highlights: ['Curriculum analytics focus', 'USA University MoUs'],
      eligibility: '',
      fee_per_year: null,
      seats: null,
      is_active: true,
      sort_order: 0,
      meta_title: '',
      meta_description: '',
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (program: Program) => {
    setEditingProgram(program);
    setCoverImageFile(null);
    setBrochureFile(null);
    reset({
      title: program.title,
      type: program.type,
      duration: program.duration,
      description: program.description,
      highlights: program.highlights || [''],
      eligibility: program.eligibility || '',
      fee_per_year: program.fee_per_year ? Number(program.fee_per_year) : null,
      seats: program.seats ? Number(program.seats) : null,
      is_active: !!program.is_active,
      sort_order: program.sort_order || 0,
      meta_title: '', // Fetch/load if available
      meta_description: '',
    });
    setModalOpen(true);
  };

  const handleToggleActive = async (program: Program) => {
    if (!can('programs.edit')) return;
    try {
      await api.patch(`/admin/programs/${program.id}/toggle-active`);
      toast.success('Program status updated successfully.');
      queryClient.invalidateQueries({ queryKey: ['admin_programs'] });
      queryClient.invalidateQueries({ queryKey: ['programs_all'] });
      queryClient.invalidateQueries({ queryKey: [`program_${program.slug}`] });
    } catch {
      toast.error('Failed to update status.');
    }
  };

  const handleDelete = async (program: Program) => {
    if (!can('programs.delete')) {
      toast.error('Forbidden: Insufficient privileges.');
      return;
    }
    const isConfirmed = await confirm(`Are you sure you want to delete ${program.title}? This cannot be undone.`, {
      title: 'Delete Academic Program',
      confirmText: 'Delete',
      variant: 'danger',
    });
    if (isConfirmed) {
      try {
        await api.delete(`/admin/programs/${program.id}`);
        toast.success('Program deleted successfully.');
        queryClient.invalidateQueries({ queryKey: ['admin_programs'] });
        queryClient.invalidateQueries({ queryKey: ['programs_all'] });
        queryClient.invalidateQueries({ queryKey: [`program_${program.slug}`] });
      } catch {
        toast.error('Failed to delete program.');
      }
    }
  };

  const onSubmit = async (values: ProgramFormValues) => {
    try {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('type', values.type);
      formData.append('duration', values.duration);
      formData.append('description', values.description);
      
      values.highlights.forEach((hl, i) => {
        formData.append(`highlights[${i}]`, hl);
      });

      if (values.eligibility) formData.append('eligibility', values.eligibility);
      if (values.fee_per_year !== null && values.fee_per_year !== undefined) {
        formData.append('fee_per_year', String(values.fee_per_year));
      }
      if (values.seats !== null && values.seats !== undefined) {
        formData.append('seats', String(values.seats));
      }
      formData.append('is_active', values.is_active ? '1' : '0');
      formData.append('sort_order', String(values.sort_order));

      if (values.meta_title) formData.append('meta_title', values.meta_title);
      if (values.meta_description) formData.append('meta_description', values.meta_description);

      if (coverImageFile) {
        formData.append('cover_image_file', coverImageFile);
      }
      if (brochureFile) {
        formData.append('brochure_file', brochureFile);
      }

      if (editingProgram) {
        // Edit program POST
        await api.post(`/admin/programs/${editingProgram.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Program updated successfully.');
      } else {
        // Create program POST
        await api.post('/admin/programs', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Program created successfully.');
      }

      setModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['admin_programs'] });
      queryClient.invalidateQueries({ queryKey: ['programs_all'] });
      if (editingProgram) {
        queryClient.invalidateQueries({ queryKey: [`program_${editingProgram.slug}`] });
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to submit form.';
      toast.error(errorMsg);
    }
  };

  // Define table columns
  const columns = [
    { key: 'title', label: 'Program Name', sortable: true },
    { key: 'sort_order', label: 'Sort Order', sortable: true },
    { key: 'type', label: 'Degree type', sortable: true },
    { key: 'duration', label: 'Duration', sortable: true },
    {
      key: 'fee_per_year',
      label: 'Fee (Per Year)',
      sortable: true,
      render: (row: Program) => row.fee_per_year ? `₹${Number(row.fee_per_year).toLocaleString('en-IN')}` : 'N/A',
    },
    {
      key: 'is_active',
      label: 'Status',
      sortable: true,
      render: (row: Program) => (
        <button
          onClick={() => handleToggleActive(row)}
          disabled={!can('programs.edit')}
          style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
        >
          {row.is_active ? (
            <span style={{ color: 'var(--color-success)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: 'var(--text-xs)' }}>
              <Eye size={14} /> Active
            </span>
          ) : (
            <span style={{ color: 'var(--color-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: 'var(--text-xs)' }}>
              <EyeOff size={14} /> Inactive
            </span>
          )}
        </button>
      ),
    },
  ];

  return (
    <div>
      {isLoading ? (
        <div style={{ color: 'var(--color-gold)' }}>Loading programs data...</div>
      ) : (
        <DataTable
          title="Academic Programs"
          subtitle="Add and update curriculum detail lists for undergraduate, MBA, and doctoral courses"
          columns={columns}
          data={programs || []}
          searchPlaceholder="Search programs..."
          searchKeys={['title', 'type', 'duration']}
          onEdit={can('programs.edit') ? handleOpenEditModal : undefined}
          onDelete={can('programs.delete') ? handleDelete : undefined}
          addButton={can('programs.create') ? { label: 'Add Program', onClick: handleOpenAddModal } : undefined}
        />
      )}

      {/* Add / Edit Program Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingProgram ? 'Edit Academic Program' : 'Create Academic Program'}
        maxWidth="800px"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className={styles.formGrid}>
            
            {/* Title */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="title">Program Title *</label>
              <input id="title" {...register('title')} className={styles.input} placeholder="e.g. MBA in AI & Business Analytics" />
              {errors.title && <span className={styles.errorText}>{errors.title.message}</span>}
            </div>

            {/* Type */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="type">Degree Type *</label>
              <select id="type" {...register('type')} className={styles.select}>
                <option value="MBA">MBA (Postgraduate)</option>
                <option value="BBA">BBA (Undergraduate)</option>
                <option value="IMP">IMP (Integrated Program)</option>
                <option value="Executive">Executive Education</option>
                <option value="Doctoral">Doctoral (PhD)</option>
                <option value="Certificate">Certificate Program</option>
              </select>
              {errors.type && <span className={styles.errorText}>{errors.type.message}</span>}
            </div>

            {/* Duration */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="duration">Duration *</label>
              <input id="duration" {...register('duration')} className={styles.input} placeholder="e.g. 2 Years (4 Semesters)" />
              {errors.duration && <span className={styles.errorText}>{errors.duration.message}</span>}
            </div>

            {/* Seats */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="seats">Total Seats Intake</label>
              <input id="seats" type="number" {...register('seats')} className={styles.input} placeholder="e.g. 60" />
              {errors.seats && <span className={styles.errorText}>{errors.seats.message}</span>}
            </div>

            {/* Fee Per Year */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="fee_per_year">Annual Tuition Fee (₹)</label>
              <input id="fee_per_year" type="number" {...register('fee_per_year')} className={styles.input} placeholder="e.g. 100000" />
              {errors.fee_per_year && <span className={styles.errorText}>{errors.fee_per_year.message}</span>}
            </div>

            {/* Sort Order */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="sort_order">Display Sort Order</label>
              <input id="sort_order" type="number" {...register('sort_order')} className={styles.input} placeholder="e.g. 0 (First)" />
              {errors.sort_order && <span className={styles.errorText}>{errors.sort_order.message}</span>}
            </div>

            {/* Description */}
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label} htmlFor="description">Program Description *</label>
              <textarea id="description" {...register('description')} className={styles.textarea} placeholder="Describe curriculum parameters, opportunities, and corporate targets..." />
              {errors.description && <span className={styles.errorText}>{errors.description.message}</span>}
            </div>

            {/* Highlights List */}
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>Core Curriculum Highlights *</label>
              {fields.map((field, idx) => (
                <div key={field.id} className={styles.highlightRow}>
                  <input
                    {...register(`highlights.${idx}` as const)}
                    className={styles.input}
                    style={{ flex: 1 }}
                    placeholder="e.g. 100% placement track with KPMG/PwC"
                  />
                  {fields.length > 1 && (
                    <button type="button" onClick={() => remove(idx)} className={styles.btnRemove}>
                      <Trash size={14} />
                    </button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => append('')}
                style={{ width: 'fit-content', marginTop: 'var(--space-2)' }}
              >
                <Plus size={14} style={{ marginRight: '4px' }} /> Add Highlight line
              </Button>
              {errors.highlights && <span className={styles.errorText}>Highlights list cannot contain empty fields</span>}
            </div>

            {/* Cover Image Upload */}
            <div className={styles.formGroup}>
              <FileUpload
                onChange={(file) => setCoverImageFile(file)}
                accept="image/*"
                label="Cover Image Banner"
                currentFileUrl={editingProgram?.cover_image ? `${api.defaults.baseURL?.replace('/api', '')}/storage/${editingProgram.cover_image}` : undefined}
              />
            </div>

            {/* Brochure File Upload */}
            <div className={styles.formGroup}>
              <FileUpload
                onChange={(file) => setBrochureFile(file)}
                accept="application/pdf"
                label="Program Brochure (PDF)"
                currentFileUrl={editingProgram?.brochure_url ? `${api.defaults.baseURL?.replace('/api', '')}/storage/${editingProgram.brochure_url}` : undefined}
              />
            </div>

            {/* Active Switch */}
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" {...register('is_active')} className={styles.checkbox} />
                <span>Show publicly in Academics directory listing</span>
              </label>
            </div>

          </div>

          <div className={styles.actions}>
            <Button type="button" variant="secondary" size="md" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" disabled={isSubmitting}>
              {isSubmitting ? 'Saving changes...' : 'Save Program'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
