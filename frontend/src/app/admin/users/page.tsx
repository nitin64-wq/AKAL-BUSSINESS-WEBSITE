/* ============================================================
   ABS — Administrative User & RBAC Management
   Allows super-administrators to create, edit, delete team members
   and assign operational roles (admin, editor, viewer).
   ============================================================ */

'use client';

import React, { useState } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { usePermission } from '@/hooks/usePermission';
import { useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import styles from './Users.module.css';
import { DataTable, Modal } from '@/components/admin';
import { Button } from '@/components/ui';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

interface UserRecord {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  is_active: boolean;
  created_at: string;
}

const userSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  email: z.string().min(1, 'Email is required').email('Invalid email address').max(255),
  password: z.string().optional().nullable().or(z.literal('')),
  role: z.enum(['admin', 'editor', 'viewer']),
  is_active: z.boolean().default(true),
});

type UserFormValues = z.infer<typeof userSchema>;

export default function AdminUsersPage() {
  const { role, user: currentUser } = usePermission();
  const queryClient = useQueryClient();

  // Fetch users
  const { data: users, isLoading } = useFetch<UserRecord[]>(
    '/admin/users',
    ['admin_users_all'],
    { params: { per_page: 100 } }
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema) as any,
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'viewer',
      is_active: true,
    },
  });

  if (role !== 'admin') {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-12) 0',
        color: 'var(--color-error)'
      }}>
        <ShieldAlert size={48} style={{ marginBottom: 'var(--space-4)' }} />
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 'bold' }}>Access Denied</h2>
        <p style={{ color: 'var(--color-muted)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-2)' }}>
          Only super-administrators can access user credentials and authorization controls.
        </p>
      </div>
    );
  }

  const handleOpenAddModal = () => {
    setEditingUser(null);
    reset({
      name: '',
      email: '',
      password: '',
      role: 'viewer',
      is_active: true,
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (user: UserRecord) => {
    setEditingUser(user);
    reset({
      name: user.name,
      email: user.email,
      password: '', // Keep blank unless resetting
      role: user.role,
      is_active: !!user.is_active,
    });
    setModalOpen(true);
  };

  const handleDelete = async (user: UserRecord) => {
    if (user.id === currentUser?.id) {
      toast.error("Cannot delete your own active account.");
      return;
    }
    if (confirm(`Are you sure you want to delete user ${user.name}? This will revoke all access.`)) {
      try {
        await api.delete(`/admin/users/${user.id}`);
        toast.success('User deleted successfully.');
        queryClient.invalidateQueries({ queryKey: ['admin_users_all'] });
      } catch {
        toast.error('Failed to delete user.');
      }
    }
  };

  const onSubmit = async (values: UserFormValues) => {
    try {
      // Create request payload
      const payload: Record<string, any> = {
        name: values.name,
        email: values.email,
        role: values.role,
        is_active: values.is_active,
      };

      if (values.password && values.password.length > 0) {
        if (values.password.length < 6) {
          toast.error("Password must be at least 6 characters.");
          return;
        }
        payload.password = values.password;
      } else if (!editingUser) {
        toast.error("Password is required for new users.");
        return;
      }

      if (editingUser) {
        // Edit PUT
        await api.put(`/admin/users/${editingUser.id}`, payload);
        toast.success('User updated successfully.');
      } else {
        // Create POST
        await api.post('/admin/users', payload);
        toast.success('User account created.');
      }

      setModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['admin_users_all'] });
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to submit form.';
      toast.error(errorMsg);
    }
  };

  const getRoleBadge = (userRole: 'admin' | 'editor' | 'viewer') => {
    switch (userRole) {
      case 'admin':
        return <span className={styles.roleBadge} style={{ backgroundColor: 'rgba(201,168,76,0.1)', color: 'var(--color-gold-light)', border: '1px solid var(--color-gold)', padding: '2px 8px', borderRadius: '50px', fontSize: '10px', fontWeight: 'bold' }}>ADMIN</span>;
      case 'editor':
        return <span className={styles.roleBadge} style={{ backgroundColor: 'rgba(59,130,246,0.1)', color: 'var(--color-info)', border: '1px solid var(--color-info)', padding: '2px 8px', borderRadius: '50px', fontSize: '10px', fontWeight: 'bold' }}>EDITOR</span>;
      default:
        return <span className={styles.roleBadge} style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--color-muted)', border: '1px solid var(--color-border)', padding: '2px 8px', borderRadius: '50px', fontSize: '10px', fontWeight: 'bold' }}>VIEWER</span>;
    }
  };

  const columns = [
    { key: 'name', label: 'User Name', sortable: true },
    { key: 'email', label: 'Email Address', sortable: true },
    {
      key: 'role',
      label: 'Security Role',
      sortable: true,
      render: (row: UserRecord) => getRoleBadge(row.role),
    },
    {
      key: 'is_active',
      label: 'Status',
      sortable: true,
      render: (row: UserRecord) => row.is_active ? (
        <span style={{ color: 'var(--color-success)', fontSize: 'var(--text-xs)' }}>Active</span>
      ) : <span style={{ color: 'var(--color-muted)', fontSize: 'var(--text-xs)' }}>Suspended</span>,
    },
    {
      key: 'created_at',
      label: 'Created Date',
      sortable: true,
      render: (row: UserRecord) => new Date(row.created_at).toLocaleDateString('en-IN'),
    },
  ];

  return (
    <div>
      {isLoading ? (
        <div style={{ color: 'var(--color-gold)' }}>Loading user accounts...</div>
      ) : (
        <DataTable
          title="Team Members & Authorization"
          subtitle="Manage administrative accounts, access credentials, and security roles (RBAC)"
          columns={columns}
          data={users || []}
          searchPlaceholder="Search users..."
          searchKeys={['name', 'email', 'role']}
          onEdit={handleOpenEditModal}
          onDelete={handleDelete}
          addButton={{ label: 'Create Account', onClick: handleOpenAddModal }}
        />
      )}

      {/* Add / Edit User Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingUser ? 'Edit User Credentials' : 'Create User Account'}
        maxWidth="500px"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formGrid}>
            
            {/* Name */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="name">Full Name *</label>
              <input id="name" {...register('name')} className={styles.input} placeholder="e.g. Gurpreet Singh" />
              {errors.name && <span className={styles.errorText}>{errors.name.message}</span>}
            </div>

            {/* Email */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="email">Email Address *</label>
              <input id="email" type="email" {...register('email')} className={styles.input} placeholder="e.g. staff@auts.ac.in" />
              {errors.email && <span className={styles.errorText}>{errors.email.message}</span>}
            </div>

            {/* Password */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="password">
                Password {editingUser ? '(Leave blank to retain current)' : '*'}
              </label>
              <input id="password" type="password" {...register('password')} className={styles.input} placeholder="••••••••" />
              {errors.password && <span className={styles.errorText}>{errors.password.message}</span>}
            </div>

            {/* Role select */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="role">Authorization Role *</label>
              <select id="role" {...register('role')} className={styles.select}>
                <option value="viewer">Viewer (Read-only staff access)</option>
                <option value="editor">Editor (Content & Status management)</option>
                <option value="admin">Admin (Super User bypass - Full access)</option>
              </select>
              {errors.role && <span className={styles.errorText}>{errors.role.message}</span>}
            </div>

            {/* Active checkbox */}
            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" {...register('is_active')} className={styles.checkbox} />
                <span>Account is active (permit login access)</span>
              </label>
            </div>

          </div>

          <div className={styles.actions}>
            <Button type="button" variant="secondary" size="md" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Account'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
