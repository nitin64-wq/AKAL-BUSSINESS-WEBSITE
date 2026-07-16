/* ============================================================
   ABS — System Audit Logs Trail
   Enables administrators to monitor edits, deletions, creation logs
   and logins across all models with property differences.
   ============================================================ */

'use client';

import React, { useState } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { usePermission } from '@/hooks/usePermission';
import styles from './AuditLog.module.css';
import { DataTable, Modal } from '@/components/admin';
import { Button } from '@/components/ui';
import { ShieldAlert, Eye, Terminal } from 'lucide-react';

interface AuditLog {
  id: number;
  user_id: number | null;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  action: 'create' | 'update' | 'delete' | 'login' | 'status_change';
  model_type: string | null;
  model_id: number | null;
  changes: any | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export default function AdminAuditLogPage() {
  const { role } = usePermission();
  const [activeLog, setActiveLog] = useState<AuditLog | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [actionFilter, setActionFilter] = useState('');

  // Fetch audit logs (GET /admin/audit-logs)
  const { data: auditLogs, isLoading } = useFetch<AuditLog[]>(
    '/admin/audit-logs',
    ['admin_audit_logs_all', actionFilter],
    {
      params: {
        per_page: 100,
        action: actionFilter || undefined
      },
      enabled: role === 'admin',
      refetchOnWindowFocus: true
    }
  );

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
          Only super-administrators can view system audit logs.
        </p>
      </div>
    );
  }

  const handleOpenDetails = (log: AuditLog) => {
    setActiveLog(log);
    setModalOpen(true);
  };

  const getModelName = (modelType: string | null) => {
    if (!modelType) return 'System';
    const parts = modelType.split('\\');
    return parts[parts.length - 1]; // e.g. App\Models\Program -> Program
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create':
        return 'var(--color-success)';
      case 'delete':
        return 'var(--color-error)';
      case 'update':
      case 'status_change':
        return 'var(--color-gold)';
      default:
        return 'var(--color-muted)';
    }
  };

  const columns = [
    {
      key: 'user',
      label: 'Staff Member',
      sortable: true,
      render: (row: AuditLog) => row.user ? `${row.user.name} (${row.user.email})` : 'System / Guest',
    },
    {
      key: 'action',
      label: 'Action',
      sortable: true,
      render: (row: AuditLog) => (
        <span style={{ color: getActionColor(row.action), fontWeight: 'bold', textTransform: 'uppercase', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
          {row.action}
        </span>
      ),
    },
    {
      key: 'model_type',
      label: 'Impacted Module',
      sortable: true,
      render: (row: AuditLog) => (
        <span>
          {getModelName(row.model_type)} {row.model_id ? `#${row.model_id}` : ''}
        </span>
      ),
    },
    { key: 'ip_address', label: 'IP Address', sortable: true },
    {
      key: 'created_at',
      label: 'Timestamp',
      sortable: true,
      render: (row: AuditLog) => new Date(row.created_at).toLocaleString('en-IN'),
    },
  ];

  const renderChangesDiff = (changes: any) => {
    if (!changes) return <p style={{ color: 'var(--color-muted)', fontStyle: 'italic' }}>No values modified or recorded.</p>;

    const hasOld = 'old' in changes;
    const hasNew = 'new' in changes;

    if (hasOld || hasNew) {
      const oldObj = (hasOld && changes.old && typeof changes.old === 'object') ? changes.old : null;
      const newObj = (hasNew && changes.new && typeof changes.new === 'object') ? changes.new : null;

      // If both are null/non-objects
      if (!oldObj && !newObj) {
        return <p style={{ color: 'var(--color-muted)', fontStyle: 'italic' }}>No values modified or recorded.</p>;
      }

      const allKeys = Array.from(new Set([
        ...(oldObj ? Object.keys(oldObj) : []),
        ...(newObj ? Object.keys(newObj) : [])
      ]));

      return (
        <table className={styles.diffTable}>
          <thead>
            <tr>
              <th style={{ width: '25%' }}>Property Field</th>
              <th style={{ width: '37.5%' }}>Original Value</th>
              <th style={{ width: '37.5%' }}>Updated/New Value</th>
            </tr>
          </thead>
          <tbody>
            {allKeys.map((key) => {
              const oldVal = oldObj ? oldObj[key] : undefined;
              const newVal = newObj ? newObj[key] : undefined;

              if (key === 'updated_at' || key === 'created_at') return null;

              // For updates (where both old and new exist): skip if value is unchanged
              if (oldObj && newObj && JSON.stringify(oldVal) === JSON.stringify(newVal)) return null;

              return (
                <tr key={key}>
                  <td><strong>{key}</strong></td>
                  <td>
                    {oldObj && key in oldObj ? (
                      <span className={styles.diffRemoved}>
                        {oldVal === null ? 'null' : typeof oldVal === 'object' ? JSON.stringify(oldVal) : String(oldVal)}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--color-muted)', fontStyle: 'italic' }}>none</span>
                    )}
                  </td>
                  <td>
                    {newObj && key in newObj ? (
                      <span className={styles.diffAdded}>
                        {newVal === null ? 'null' : typeof newVal === 'object' ? JSON.stringify(newVal) : String(newVal)}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--color-muted)', fontStyle: 'italic' }}>deleted</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      );
    }

    // Default: Display payload dump as key-value table
    return (
      <table className={styles.diffTable}>
        <thead>
          <tr>
            <th style={{ width: '30%' }}>Field</th>
            <th style={{ width: '70%' }}>Value</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(changes).map(([key, val]) => {
            if (key === 'updated_at' || key === 'created_at') return null;
            return (
              <tr key={key}>
                <td><strong>{key}</strong></td>
                <td>
                  <span>
                    {val === null ? 'null' : typeof val === 'object' ? JSON.stringify(val) : String(val)}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  return (
    <div>
      {/* Action Filters Bar */}
      <div className={styles.filterHeader}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Action Filter</label>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className={styles.filterInput}
          >
            <option value="">All Actions</option>
            <option value="create">CREATE</option>
            <option value="update">UPDATE</option>
            <option value="delete">DELETE</option>
            <option value="login">LOGIN</option>
            <option value="status_change">STATUS CHANGE</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div style={{ color: 'var(--color-gold)' }}>Loading system audit logs...</div>
      ) : (
        <DataTable
          title="System Audit Logs Trail"
          subtitle="Real-time log of administrative changes, deletions, and login histories"
          columns={columns}
          data={auditLogs || []}
          searchPlaceholder="Filter logs..."
          onEdit={handleOpenDetails} // Repurpose the edit icon to be "View Details"
          actionsColumnWidth="50px"
        />
      )}

      {/* Details Diff view modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={activeLog ? `Audit Record Log #${activeLog.id}` : 'Loading...'}
        maxWidth="750px"
      >
        {activeLog ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            
            {/* Header info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border)', fontSize: 'var(--text-sm)' }}>
              <div>
                <span style={{ color: 'var(--color-muted)', display: 'block', fontSize: '11px', fontWeight: 'bold' }}>PERFORMED BY</span>
                <strong style={{ color: 'var(--color-white)' }}>
                  {activeLog.user ? `${activeLog.user.name} (${activeLog.user.email})` : 'System / Guest'}
                </strong>
              </div>
              <div>
                <span style={{ color: 'var(--color-muted)', display: 'block', fontSize: '11px', fontWeight: 'bold' }}>TIMESTAMP</span>
                <strong style={{ color: 'var(--color-white)' }}>
                  {new Date(activeLog.created_at).toLocaleString('en-IN')}
                </strong>
              </div>
              <div>
                <span style={{ color: 'var(--color-muted)', display: 'block', fontSize: '11px', fontWeight: 'bold' }}>IP ADDRESS & CLIENT</span>
                <span style={{ color: 'var(--color-off-white)', fontSize: 'var(--text-xs)', display: 'block' }}>
                  IP: {activeLog.ip_address || 'N/A'}<br />
                  Agent: {activeLog.user_agent ? activeLog.user_agent.substring(0, 80) + '...' : 'N/A'}
                </span>
              </div>
              <div>
                <span style={{ color: 'var(--color-muted)', display: 'block', fontSize: '11px', fontWeight: 'bold' }}>ACTION KEY</span>
                <strong style={{ color: getActionColor(activeLog.action), textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                  {activeLog.action}
                </strong>
              </div>
            </div>

            {/* Changes details */}
            <div>
              <span style={{ color: 'var(--color-muted)', display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: 'var(--space-2)' }}>
                CAPTURED PROPERTY CHANGESET
              </span>
              <div className={styles.changesContainer}>
                {renderChangesDiff(activeLog.changes)}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-2)' }}>
              <Button onClick={() => setModalOpen(false)} variant="secondary" size="md">
                Close Log
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
