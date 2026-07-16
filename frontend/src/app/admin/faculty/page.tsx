/* ============================================================
   ABS — Faculty Directory Manager
   Allows administrators to manage faculty profiles, research counts,
   designations, and sort order.
   ============================================================ */

'use client';

import React, { useState } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { usePermission } from '@/hooks/usePermission';
import { useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import styles from './Faculty.module.css';
import { DataTable, Modal, FileUpload } from '@/components/admin';
import { Button } from '@/components/ui';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Star, ShieldAlert } from 'lucide-react';
import { useConfirm } from '@/context/ConfirmContext';

interface Faculty {
  id: number;
  name: string;
  slug: string;
  designation: string;
  department: string;
  photo: string | null;
  linkedin_url: string | null;
  specialization: string | null;
  qualification: string | null;
  experience_years: number | null;
  bio: string | null;
  email: string | null;
  google_scholar: string | null;
  publications: number | null;
  is_distinguished: boolean;
  sort_order: number;
  is_active: boolean;
}

const facultySchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  designation: z.string().min(1, 'Designation is required').max(255),
  department: z.string().min(1, 'Department is required').max(255),
  specialization: z.string().max(255).optional().nullable(),
  qualification: z.string().max(255).optional().nullable(),
  experience_years: z.coerce.number().min(0).optional().nullable(),
  bio: z.string().max(2000).optional().nullable(),
  email: z.string().email('Invalid email address').max(255).optional().nullable().or(z.literal('')),
  linkedin_url: z.string().url('Invalid URL').max(255).optional().nullable().or(z.literal('')),
  google_scholar: z.string().url('Invalid URL').max(255).optional().nullable().or(z.literal('')),
  publications: z.coerce.number().min(0).optional().nullable(),
  is_distinguished: z.boolean().default(false),
  sort_order: z.coerce.number().min(0).default(0),
  is_active: z.boolean().default(true),
});

type FacultyFormValues = z.infer<typeof facultySchema>;

export default function AdminFacultyPage() {
  const { can } = usePermission();
  const queryClient = useQueryClient();
  const confirm = useConfirm();

  // Fetch faculty list
  const { data: facultyMembers, isLoading } = useFetch<Faculty[]>(
    '/admin/faculty',
    ['admin_faculty'],
    { params: { per_page: 100 } }
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FacultyFormValues>({
    resolver: zodResolver(facultySchema) as any,
    defaultValues: {
      name: '',
      designation: '',
      department: '',
      specialization: '',
      qualification: '',
      experience_years: 0,
      bio: '',
      email: '',
      linkedin_url: '',
      google_scholar: '',
      publications: 0,
      is_distinguished: false,
      sort_order: 0,
      is_active: true,
    },
  });

  const handleOpenAddModal = () => {
    setEditingFaculty(null);
    setPhotoFile(null);
    reset({
      name: '',
      designation: '',
      department: 'Business Analytics',
      specialization: '',
      qualification: '',
      experience_years: 5,
      bio: '',
      email: '',
      linkedin_url: '',
      google_scholar: '',
      publications: 0,
      is_distinguished: false,
      sort_order: 0,
      is_active: true,
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (member: Faculty) => {
    setEditingFaculty(member);
    setPhotoFile(null);
    reset({
      name: member.name,
      designation: member.designation,
      department: member.department,
      specialization: member.specialization || '',
      qualification: member.qualification || '',
      experience_years: member.experience_years ? Number(member.experience_years) : 0,
      bio: member.bio || '',
      email: member.email || '',
      linkedin_url: member.linkedin_url || '',
      google_scholar: member.google_scholar || '',
      publications: member.publications ? Number(member.publications) : 0,
      is_distinguished: !!member.is_distinguished,
      sort_order: member.sort_order || 0,
      is_active: !!member.is_active,
    });
    setModalOpen(true);
  };

  const handleDelete = async (member: Faculty) => {
    if (!can('faculty.delete')) {
      toast.error('Forbidden: Insufficient privileges.');
      return;
    }
    const isConfirmed = await confirm(`Are you sure you want to remove ${member.name} from the directory?`, {
      title: 'Remove Faculty Member',
      confirmText: 'Remove',
      variant: 'danger',
    });
    if (isConfirmed) {
      try {
        await api.delete(`/admin/faculty/${member.id}`);
        toast.success('Faculty member removed successfully.');
        queryClient.invalidateQueries({ queryKey: ['admin_faculty'] });
        queryClient.invalidateQueries({ queryKey: ['faculty_all'] });
        queryClient.invalidateQueries({ queryKey: ['faculty_public'] });
        queryClient.invalidateQueries({ queryKey: [`faculty_${member.slug}`] });
      } catch {
        toast.error('Failed to remove faculty member.');
      }
    }
  };

  const onSubmit = async (values: FacultyFormValues) => {
    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('designation', values.designation);
      formData.append('department', values.department);

      if (values.specialization) formData.append('specialization', values.specialization);
      if (values.qualification) formData.append('qualification', values.qualification);
      if (values.experience_years !== null && values.experience_years !== undefined) {
        formData.append('experience_years', String(values.experience_years));
      }
      if (values.bio) formData.append('bio', values.bio);
      if (values.email) formData.append('email', values.email);
      if (values.linkedin_url) formData.append('linkedin_url', values.linkedin_url);
      if (values.google_scholar) formData.append('google_scholar', values.google_scholar);
      if (values.publications !== null && values.publications !== undefined) {
        formData.append('publications', String(values.publications));
      }
      
      formData.append('is_distinguished', values.is_distinguished ? '1' : '0');
      formData.append('is_active', values.is_active ? '1' : '0');
      formData.append('sort_order', String(values.sort_order));

      if (photoFile) {
        formData.append('photo_file', photoFile);
      }

      if (editingFaculty) {
        // Update POST
        await api.post(`/admin/faculty/${editingFaculty.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Faculty details updated.');
      } else {
        // Create POST
        await api.post('/admin/faculty', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Faculty profile created.');
      }

      setModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['admin_faculty'] });
      queryClient.invalidateQueries({ queryKey: ['faculty_all'] });
      queryClient.invalidateQueries({ queryKey: ['faculty_public'] });
      if (editingFaculty) {
        queryClient.invalidateQueries({ queryKey: [`faculty_${editingFaculty.slug}`] });
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to save faculty profile.';
      toast.error(errorMsg);
    }
  };

  const columns = [
    { key: 'name', label: 'Faculty Name', sortable: true },
    { key: 'sort_order', label: 'Sort Order', sortable: true },
    { key: 'designation', label: 'Designation', sortable: true },
    { key: 'department', label: 'Department', sortable: true },
    {
      key: 'publications',
      label: 'Publications',
      sortable: true,
      render: (row: Faculty) => `${row.publications ?? 0} papers`,
    },
    {
      key: 'is_distinguished',
      label: 'Distinguished',
      sortable: true,
      render: (row: Faculty) => row.is_distinguished ? (
        <span style={{ color: 'var(--color-gold)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: 'var(--text-xs)' }}>
          <Star size={12} fill="var(--color-gold)" /> Yes
        </span>
      ) : <span style={{ color: 'var(--color-muted)' }}>No</span>,
    },
    {
      key: 'is_active',
      label: 'Status',
      sortable: true,
      render: (row: Faculty) => row.is_active ? (
        <span style={{ color: 'var(--color-success)', fontSize: 'var(--text-xs)' }}>Active</span>
      ) : <span style={{ color: 'var(--color-muted)', fontSize: 'var(--text-xs)' }}>Inactive</span>,
    },
  ];

  return (
    <div>
      {isLoading ? (
        <div style={{ color: 'var(--color-gold)' }}>Loading faculty roster...</div>
      ) : (
        <DataTable
          title="Faculty Directory"
          subtitle="Manage academic profiles, qualifications, and LinkedIn connections of ABS professors"
          columns={columns}
          data={facultyMembers || []}
          searchPlaceholder="Search faculty members..."
          searchKeys={['name', 'designation', 'department', 'specialization']}
          onEdit={can('faculty.edit') ? handleOpenEditModal : undefined}
          onDelete={can('faculty.delete') ? handleDelete : undefined}
          addButton={can('faculty.create') ? { label: 'Add Faculty Member', onClick: handleOpenAddModal } : undefined}
        />
      )}

      {/* Add / Edit Faculty Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingFaculty ? 'Edit Faculty Details' : 'Add Faculty Member'}
        maxWidth="800px"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formGrid}>
            {/* Name */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="name">Full Name *</label>
              <input id="name" {...register('name')} className={styles.input} placeholder="e.g. Dr. Suraj Verma" />
              {errors.name && <span className={styles.errorText}>{errors.name.message}</span>}
            </div>

            {/* Designation */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="designation">Designation *</label>
              <input id="designation" {...register('designation')} className={styles.input} placeholder="e.g. Associate Professor & HOD" />
              {errors.designation && <span className={styles.errorText}>{errors.designation.message}</span>}
            </div>

            {/* Department */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="department">Department *</label>
              <select id="department" {...register('department')} className={styles.select}>
                <option value="Business Analytics">Business Analytics</option>
                <option value="Finance & Accounts">Finance & Accounts</option>
                <option value="Strategy & Marketing">Strategy & Marketing</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Economics & Decisions">Economics & Decisions</option>
                <option value="Operations & Supply Chain">Operations & Supply Chain</option>
              </select>
              {errors.department && <span className={styles.errorText}>{errors.department.message}</span>}
            </div>

            {/* Qualification */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="qualification">Academic Qualification</label>
              <input id="qualification" {...register('qualification')} className={styles.input} placeholder="e.g. PhD in Management (IIT Delhi)" />
              {errors.qualification && <span className={styles.errorText}>{errors.qualification.message}</span>}
            </div>

            {/* Specialization */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="specialization">Specialization / Expertise</label>
              <input id="specialization" {...register('specialization')} className={styles.input} placeholder="e.g. Business Intelligence & Big Data" />
              {errors.specialization && <span className={styles.errorText}>{errors.specialization.message}</span>}
            </div>

            {/* Experience Years */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="experience_years">Experience (Years)</label>
              <input id="experience_years" type="number" {...register('experience_years')} className={styles.input} placeholder="e.g. 12" />
              {errors.experience_years && <span className={styles.errorText}>{errors.experience_years.message}</span>}
            </div>

            {/* Email */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="email">Email Address</label>
              <input id="email" type="email" {...register('email')} className={styles.input} placeholder="e.g. suraj.verma@abs.edu" />
              {errors.email && <span className={styles.errorText}>{errors.email.message}</span>}
            </div>

            {/* Publications */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="publications">Research Publications Count</label>
              <input id="publications" type="number" {...register('publications')} className={styles.input} placeholder="e.g. 15" />
              {errors.publications && <span className={styles.errorText}>{errors.publications.message}</span>}
            </div>

            {/* LinkedIn URL */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="linkedin_url">LinkedIn Profile URL</label>
              <input id="linkedin_url" {...register('linkedin_url')} className={styles.input} placeholder="https://linkedin.com/in/username" />
              {errors.linkedin_url && <span className={styles.errorText}>{errors.linkedin_url.message}</span>}
            </div>

            {/* Google Scholar URL */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="google_scholar">Google Scholar Link</label>
              <input id="google_scholar" {...register('google_scholar')} className={styles.input} placeholder="https://scholar.google.com/citations?user=..." />
              {errors.google_scholar && <span className={styles.errorText}>{errors.google_scholar.message}</span>}
            </div>

            {/* Sort Order */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="sort_order">Display Sort Order</label>
              <input id="sort_order" type="number" {...register('sort_order')} className={styles.input} placeholder="e.g. 0" />
            </div>

            {/* Distinguished status */}
            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" {...register('is_distinguished')} className={styles.checkbox} />
                <span>Feature as Distinguished Faculty (Home Carousel)</span>
              </label>

              <label className={styles.checkboxLabel}>
                <input type="checkbox" {...register('is_active')} className={styles.checkbox} />
                <span>Show profile publicly in Directory</span>
              </label>
            </div>

            {/* Bio */}
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label} htmlFor="bio">Professional Biography</label>
              <textarea id="bio" {...register('bio')} className={styles.textarea} placeholder="A short bio highlighting research targets, industry consultations, and teaching specialities..." />
              {errors.bio && <span className={styles.errorText}>{errors.bio.message}</span>}
            </div>

            {/* Photo Upload */}
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <FileUpload
                onChange={(file) => setPhotoFile(file)}
                accept="image/*"
                label="Faculty Profile Photograph"
                currentFileUrl={editingFaculty?.photo ? `${api.defaults.baseURL?.replace('/api', '')}/storage/${editingFaculty.photo}` : undefined}
              />
            </div>

          </div>

          <div className={styles.actions}>
            <Button type="button" variant="secondary" size="md" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" disabled={isSubmitting}>
              {isSubmitting ? 'Saving changes...' : 'Save Profile'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
