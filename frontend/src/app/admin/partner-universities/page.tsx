/* ============================================================
   ABS — Partner Universities Manager
   Allows administrators (restricted to editor+) to add, edit,
   and manage partner university MoUs and benefits.
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

interface PartnerUniversity {
  id: number;
  name: string;
  description: string;
  logo_icon: string;
  sort_order: number;
  is_active: boolean;
}

const partnerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  description: z.string().min(1, 'Description is required'),
  logo_icon: z.string().max(50).default('Landmark'),
  sort_order: z.coerce.number().min(0).default(0),
  is_active: z.boolean().default(true),
});

type PartnerFormValues = z.infer<typeof partnerSchema>;

export default function AdminPartnerUniversitiesPage() {
  const { role } = usePermission();
  const queryClient = useQueryClient();

  // Fetch partner universities
  const { data: responseData, isLoading } = useFetch<{ data: PartnerUniversity[] } | PartnerUniversity[]>(
    '/admin/partner-universities',
    ['admin_partner_universities_all'],
    { params: { per_page: 100 } }
  );

  const universities = React.useMemo(() => {
    if (!responseData) return [];
    if (Array.isArray(responseData)) return responseData;
    if (Array.isArray((responseData as any).data)) return (responseData as any).data;
    return [];
  }, [responseData]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<PartnerUniversity | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PartnerFormValues>({
    resolver: zodResolver(partnerSchema) as any,
    defaultValues: {
      name: '',
      description: '',
      logo_icon: 'Landmark',
      sort_order: 0,
      is_active: true,
    },
  });

  const handleOpenAddModal = () => {
    setEditingPartner(null);
    reset({
      name: '',
      description: '',
      logo_icon: 'Landmark',
      sort_order: 0,
      is_active: true,
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (uni: PartnerUniversity) => {
    setEditingPartner(uni);
    reset({
      name: uni.name,
      description: uni.description,
      logo_icon: uni.logo_icon || 'Landmark',
      sort_order: uni.sort_order || 0,
      is_active: !!uni.is_active,
    });
    setModalOpen(true);
  };

  const handleDelete = async (uni: PartnerUniversity) => {
    if (role !== 'admin') {
      toast.error('Forbidden: Insufficient privileges.');
      return;
    }
    if (confirm(`Are you sure you want to delete this partner university MoU?`)) {
      try {
        await api.delete(`/admin/partner-universities/${uni.id}`);
        toast.success('Partner university deleted.');
        queryClient.invalidateQueries({ queryKey: ['admin_partner_universities_all'] });
        queryClient.invalidateQueries({ queryKey: ['partner_universities_public'] });
      } catch {
        toast.error('Failed to delete partner university.');
      }
    }
  };

  const onSubmit = async (values: PartnerFormValues) => {
    try {
      if (editingPartner) {
        await api.post(`/admin/partner-universities/${editingPartner.id}`, values);
        toast.success('Partner university updated.');
      } else {
        await api.post('/admin/partner-universities', values);
        toast.success('Partner university created.');
      }

      setModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['admin_partner_universities_all'] });
      queryClient.invalidateQueries({ queryKey: ['partner_universities_public'] });
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to save partner university.';
      toast.error(errorMsg);
    }
  };

  const columns = [
    { key: 'name', label: 'University Name', sortable: true },
    { key: 'description', label: 'MoU Brief / Guidance', sortable: false, render: (row: PartnerUniversity) => (
      <div style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {row.description}
      </div>
    )},
    { key: 'logo_icon', label: 'Icon Tag', sortable: false },
    {
      key: 'is_active',
      label: 'Status',
      sortable: true,
      render: (row: PartnerUniversity) => (
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
      render: (row: PartnerUniversity) => (
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: '#6B7280' }}>
          #{row.sort_order || 0}
        </span>
      ),
    },
  ];

  return (
    <div>
      {isLoading ? (
        <div style={{ color: 'var(--color-gold)' }}>Loading global partners...</div>
      ) : (
        <DataTable
          title="Global Academic Collaborators Ledger"
          subtitle="Publish partner universities, foreign educational MoUs, joint summit guidance, and credit structures"
          columns={columns}
          data={universities}
          searchPlaceholder="Search partners..."
          searchKeys={['name', 'description']}
          onEdit={role === 'admin' || role === 'editor' ? handleOpenEditModal : undefined}
          onDelete={role === 'admin' ? handleDelete : undefined}
          addButton={role === 'admin' || role === 'editor' ? { label: 'Add University', onClick: handleOpenAddModal } : undefined}
        />
      )}

      {/* Modal for partner university form */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingPartner ? 'Edit Partner University' : 'Add Partner University'}
        maxWidth="600px"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formGrid} style={{ gridTemplateColumns: '1fr' }}>
            
            {/* Name */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="name">University Name *</label>
              <input id="name" {...register('name')} className={styles.input} placeholder="e.g. University of Nebraska Omaha" />
              {errors.name && <span className={styles.errorText}>{errors.name.message}</span>}
            </div>

            {/* Description */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="description">MoU Collaborative Guidance *</label>
              <textarea id="description" {...register('description')} className={styles.textarea} rows={4} placeholder="Describe the MoU guidance and student pathway..." />
              {errors.description && <span className={styles.errorText}>{errors.description.message}</span>}
            </div>

            {/* Icon Select */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="logo_icon">Display Icon Type *</label>
              <select id="logo_icon" {...register('logo_icon')} className={styles.select}>
                <option value="Landmark">🏛️ Landmark (Default)</option>
                <option value="GraduationCap">🎓 Graduation Cap</option>
                <option value="Globe">🌐 Globe</option>
                <option value="Award">🏅 Award Ribbon</option>
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
                <span>Publish collaborator on global learning section immediately</span>
              </label>
            </div>

          </div>

          <div className={styles.actions}>
            <Button type="button" variant="secondary" size="md" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" disabled={isSubmitting}>
              {isSubmitting ? 'Saving University...' : 'Save University'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
