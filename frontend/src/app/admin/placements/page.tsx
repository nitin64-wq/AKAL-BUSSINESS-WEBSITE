/* ============================================================
   ABS — Corporate Placements Manager
   Allows administrators (restricted to editor+) to add recruiters,
   placement packages, roles, and years.
   ============================================================ */

'use client';

import React, { useState, useCallback } from 'react';
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

// ── Logo helpers ──
function getInitials(name: string): string {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2);
}
function nameToColor(name: string): string {
  const C = ['#6366F1','#EC4899','#10B981','#F59E0B','#EF4444','#8B5CF6','#06B6D4','#F97316','#14B8A6','#3B82F6','#D946EF','#22C55E'];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return C[Math.abs(h) % C.length];
}

/** Inline logo thumbnail with image error fallback */
function LogoThumb({ name, logo }: { name: string; logo: string | null }) {
  const [failed, setFailed] = useState(false);
  const onErr = useCallback(() => setFailed(true), []);
  const showImg = logo && !failed;
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', width:36, height:36 }}>
      {showImg ? (
        <img
          src={getImageUrl(logo)}
          alt=""
          style={{ width:36, height:36, objectFit:'contain', borderRadius:6 }}
          onError={onErr}
        />
      ) : (
        <div style={{ width:36, height:36, borderRadius:6, background:nameToColor(name), display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:13 }}>
          {getInitials(name)}
        </div>
      )}
    </div>
  );
}

interface Placement {
  id: number;
  company_name: string;
  company_logo: string | null;
  role_offered: string | null;
  package_lpa: number | null;
  year: number;
  placement_type: 'Campus' | 'Internship' | 'PPO';
  is_featured: boolean;
  sort_order: number;
}

const placementSchema = z.object({
  company_name: z.string().min(1, 'Company Name is required').max(255),
  role_offered: z.string().max(255).optional().nullable(),
  package_lpa: z.coerce.number().min(0, 'Package must be positive').optional().nullable(),
  year: z.coerce.number().min(2000, 'Invalid year').max(new Date().getFullYear() + 2),
  placement_type: z.enum(['Campus', 'Internship', 'PPO']),
  is_featured: z.boolean().default(false),
  sort_order: z.coerce.number().min(0).default(0),
});

type PlacementFormValues = z.infer<typeof placementSchema>;

export default function AdminPlacementsPage() {
  const { can } = usePermission();
  const queryClient = useQueryClient();
  const confirm = useConfirm();

  // Fetch placements
  const { data: placements, isLoading } = useFetch<Placement[]>(
    '/admin/placements',
    ['admin_placements_all'],
    { params: { per_page: 100 } }
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlacement, setEditingPlacement] = useState<Placement | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PlacementFormValues>({
    resolver: zodResolver(placementSchema) as any,
    defaultValues: {
      company_name: '',
      role_offered: '',
      package_lpa: null,
      year: new Date().getFullYear(),
      placement_type: 'Campus',
      is_featured: false,
      sort_order: 0,
    },
  });

  const handleOpenAddModal = () => {
    setEditingPlacement(null);
    setLogoFile(null);
    reset({
      company_name: '',
      role_offered: 'Business Analyst',
      package_lpa: 6.5,
      year: new Date().getFullYear(),
      placement_type: 'Campus',
      is_featured: false,
      sort_order: 0,
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (placement: Placement) => {
    setEditingPlacement(placement);
    setLogoFile(null);
    reset({
      company_name: placement.company_name,
      role_offered: placement.role_offered || '',
      package_lpa: placement.package_lpa ? Number(placement.package_lpa) : null,
      year: placement.year,
      placement_type: placement.placement_type,
      is_featured: !!placement.is_featured,
      sort_order: placement.sort_order || 0,
    });
    setModalOpen(true);
  };

  const handleDelete = async (placement: Placement) => {
    if (!can('placements.delete')) {
      toast.error('Forbidden: Insufficient privileges.');
      return;
    }
    const isConfirmed = await confirm(`Are you sure you want to remove placement record at ${placement.company_name}?`, {
      title: 'Remove Placement Record',
      confirmText: 'Remove',
      variant: 'danger',
    });
    if (isConfirmed) {
      try {
        await api.delete(`/admin/placements/${placement.id}`);
        toast.success('Record deleted.');
        queryClient.invalidateQueries({ queryKey: ['admin_placements_all'] });
      } catch {
        toast.error('Failed to delete placement record.');
      }
    }
  };

  const onSubmit = async (values: PlacementFormValues) => {
    try {
      const formData = new FormData();
      formData.append('company_name', values.company_name);
      
      if (values.role_offered) formData.append('role_offered', values.role_offered);
      if (values.package_lpa !== null && values.package_lpa !== undefined) {
        formData.append('package_lpa', String(values.package_lpa));
      }
      formData.append('year', String(values.year));
      formData.append('placement_type', values.placement_type);
      formData.append('is_featured', values.is_featured ? '1' : '0');
      formData.append('sort_order', String(values.sort_order));

      if (logoFile) {
        formData.append('logo_file', logoFile); // Backend expects 'logo_file'
      }

      if (editingPlacement) {
        await api.post(`/admin/placements/${editingPlacement.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Record updated.');
      } else {
        await api.post('/admin/placements', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Record created.');
      }

      setModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['admin_placements_all'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard_stats'] });
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to save placement record.';
      toast.error(errorMsg);
    }
  };

  const columns = [
    {
      key: 'company_logo',
      label: 'Logo',
      sortable: false,
      render: (row: Placement) => <LogoThumb name={row.company_name} logo={row.company_logo} />,
    },
    { key: 'company_name', label: 'Recruiter Company', sortable: true },
    { key: 'role_offered', label: 'Designation / Role', sortable: true },
    {
      key: 'package_lpa',
      label: 'Package Offered',
      sortable: true,
      render: (row: Placement) => row.package_lpa ? `${row.package_lpa} LPA` : 'N/A',
    },
    { key: 'placement_type', label: 'Offer Type', sortable: true },
    { key: 'year', label: 'Year', sortable: true },
    {
      key: 'is_featured',
      label: 'Marquee',
      sortable: true,
      render: (row: Placement) => (
        <span style={{
          display: 'inline-block',
          padding: '2px 10px',
          borderRadius: 'var(--radius-pill)',
          fontSize: 'var(--text-xs)',
          fontWeight: 600,
          background: row.is_featured ? 'rgba(34,197,94,0.12)' : 'rgba(107,114,128,0.1)',
          color: row.is_featured ? '#16A34A' : '#6B7280',
        }}>
          {row.is_featured ? '✓ Shown' : '— Hidden'}
        </span>
      ),
    },
    {
      key: 'sort_order',
      label: 'Order',
      sortable: true,
      render: (row: Placement) => (
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: '#6B7280' }}>
          #{row.sort_order || 0}
        </span>
      ),
    },
  ];

  return (
    <div>
      {isLoading ? (
        <div style={{ color: 'var(--color-gold)' }}>Loading placements logs...</div>
      ) : (
        <DataTable
          title="Placement Success Ledger"
          subtitle="Publish packages, corporate recruiters, average compensation packages, and drive types"
          columns={columns}
          data={placements || []}
          searchPlaceholder="Search recruiters..."
          searchKeys={['company_name', 'role_offered', 'placement_type']}
          onEdit={can('placements.manage') ? handleOpenEditModal : undefined}
          onDelete={can('placements.delete') ? handleDelete : undefined}
          addButton={can('placements.manage') ? { label: 'Add Record', onClick: handleOpenAddModal } : undefined}
        />
      )}

      {/* Modal for placements */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingPlacement ? 'Edit Placement Record' : 'Add Placement Record'}
        maxWidth="600px"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formGrid} style={{ gridTemplateColumns: '1fr' }}>
            
            {/* Company Name */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="company_name">Company Name *</label>
              <input id="company_name" {...register('company_name')} className={styles.input} placeholder="e.g. KPMG India" />
              {errors.company_name && <span className={styles.errorText}>{errors.company_name.message}</span>}
            </div>

            {/* Role offered */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="role_offered">Role / Designation</label>
              <input id="role_offered" {...register('role_offered')} className={styles.input} placeholder="e.g. Data Analyst Consultant" />
            </div>

            {/* Package LPA */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="package_lpa">Salary Package (LPA) *</label>
              <input id="package_lpa" type="number" step="0.1" {...register('package_lpa')} className={styles.input} placeholder="e.g. 10.5" />
              {errors.package_lpa && <span className={styles.errorText}>{errors.package_lpa.message}</span>}
            </div>

            {/* Year */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="year">Placement Year *</label>
              <input id="year" type="number" {...register('year')} className={styles.input} placeholder="e.g. 2026" />
              {errors.year && <span className={styles.errorText}>{errors.year.message}</span>}
            </div>

            {/* Placement Type */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="placement_type">Offer Type *</label>
              <select id="placement_type" {...register('placement_type')} className={styles.select}>
                <option value="Campus">Campus Recruitment</option>
                <option value="Internship">Pre-Placement Internship</option>
                <option value="PPO">PPO (Pre-Placement Offer)</option>
              </select>
            </div>

            {/* Featured */}
            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" {...register('is_featured')} className={styles.checkbox} />
                <span>Feature on placements ticker</span>
              </label>
            </div>

            {/* Logo File */}
            <div className={styles.formGroup}>
              <FileUpload
                onChange={(file) => setLogoFile(file)}
                accept="image/*"
                label="Recruiter Logo"
                currentFileUrl={editingPlacement?.company_logo ? getImageUrl(editingPlacement.company_logo) : undefined}
              />
            </div>

          </div>

          <div className={styles.actions}>
            <Button type="button" variant="secondary" size="md" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Record'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
