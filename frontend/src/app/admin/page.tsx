/* ============================================================
   ABS — Admin Dashboard Page
   Presents quick statistics, recent activities, and admin short CTAs.
   ============================================================ */

'use client';

import React from 'react';
import { useFetch } from '@/hooks/useFetch';
import { usePermission } from '@/hooks/usePermission';
import styles from './Dashboard.module.css';
import { Card, Badge, Skeleton } from '@/components/ui';
import {
  FileText,
  Mail,
  Newspaper,
  Plus,
  ArrowRight,
  Shield,
  GraduationCap,
  Users,
  Settings,
  ClipboardList
} from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  total_applications: number;
  pending_applications: number;
  new_messages: number;
  published_news: number;
  recent_applications: Array<{
    id: number;
    application_no: string;
    full_name: string;
    email: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    created_at: string;
    program?: { id: number; title: string };
  }>;
}

interface Message {
  id: number;
  name: string;
  email: string;
  subject: string;
  is_read: boolean;
  created_at: string;
}

export default function AdminDashboard() {
  const { role, can } = usePermission();

  // Fetch Stats from backend
  const { data: stats, isLoading: statsLoading } = useFetch<DashboardStats>(
    '/admin/dashboard/stats',
    ['dashboard_stats'],
    { refetchOnWindowFocus: true }
  );

  // Fetch recent messages
  const { data: messages, isLoading: messagesLoading } = useFetch<Message[]>(
    '/admin/messages',
    ['recent_messages'],
    {
      params: { per_page: 5 },
      refetchOnWindowFocus: true
    }
  );

  const getStatusBadge = (status: 'Pending' | 'Approved' | 'Rejected') => {
    switch (status) {
      case 'Approved':
        return <span className={`${styles.badge} ${styles.badgeApproved}`}>Approved</span>;
      case 'Rejected':
        return <span className={`${styles.badge} ${styles.badgeRejected}`}>Rejected</span>;
      default:
        return <span className={`${styles.badge} ${styles.badgePending}`}>Pending</span>;
    }
  };

  return (
    <div>
      {/* 1. Statistics Cards Grid */}
      <div className={styles.statsGrid}>
        {statsLoading ? (
          <>
            <Skeleton height={120} />
            <Skeleton height={120} />
            <Skeleton height={120} />
            <Skeleton height={120} />
          </>
        ) : (
          <>
            {/* Total Applications */}
            <div style={{
              backgroundColor: 'var(--color-navy-mid)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-6)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-4)'
            }}>
              <div style={{
                backgroundColor: 'rgba(201, 168, 76, 0.1)',
                color: 'var(--color-gold)',
                padding: 'var(--space-4)',
                borderRadius: 'var(--radius-md)'
              }}>
                <FileText size={24} />
              </div>
              <div>
                <span style={{ fontSize: 'var(--text-3xl)', fontWeight: 'bold', display: 'block', color: 'var(--color-white)', fontFamily: 'var(--font-mono)' }}>
                  {stats?.total_applications ?? 0}
                </span>
                <span style={{ color: 'var(--color-muted)', fontSize: 'var(--text-xs)' }}>Total Applications</span>
              </div>
            </div>

            {/* Pending Applications */}
            <div style={{
              backgroundColor: 'var(--color-navy-mid)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-6)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-4)'
            }}>
              <div style={{
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                color: 'var(--color-warning)',
                padding: 'var(--space-4)',
                borderRadius: 'var(--radius-md)'
              }}>
                <FileText size={24} />
              </div>
              <div>
                <span style={{ fontSize: 'var(--text-3xl)', fontWeight: 'bold', display: 'block', color: 'var(--color-white)', fontFamily: 'var(--font-mono)' }}>
                  {stats?.pending_applications ?? 0}
                </span>
                <span style={{ color: 'var(--color-muted)', fontSize: 'var(--text-xs)' }}>Pending Review</span>
              </div>
            </div>

            {/* Unread Inquiries */}
            <div style={{
              backgroundColor: 'var(--color-navy-mid)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-6)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-4)'
            }}>
              <div style={{
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                color: 'var(--color-info)',
                padding: 'var(--space-4)',
                borderRadius: 'var(--radius-md)'
              }}>
                <Mail size={24} />
              </div>
              <div>
                <span style={{ fontSize: 'var(--text-3xl)', fontWeight: 'bold', display: 'block', color: 'var(--color-white)', fontFamily: 'var(--font-mono)' }}>
                  {stats?.new_messages ?? 0}
                </span>
                <span style={{ color: 'var(--color-muted)', fontSize: 'var(--text-xs)' }}>Unread Inquiries</span>
              </div>
            </div>

            {/* Published News */}
            <div style={{
              backgroundColor: 'var(--color-navy-mid)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-6)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-4)'
            }}>
              <div style={{
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                color: 'var(--color-success)',
                padding: 'var(--space-4)',
                borderRadius: 'var(--radius-md)'
              }}>
                <Newspaper size={24} />
              </div>
              <div>
                <span style={{ fontSize: 'var(--text-3xl)', fontWeight: 'bold', display: 'block', color: 'var(--color-white)', fontFamily: 'var(--font-mono)' }}>
                  {stats?.published_news ?? 0}
                </span>
                <span style={{ color: 'var(--color-muted)', fontSize: 'var(--text-xs)' }}>Published Articles</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 2. Main Dashboard Split Layout */}
      <div className={styles.dashboardGrid}>
        
        {/* Left Side: Tables */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          
          {/* Recent Applications Card */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Recent Student Applications</h2>
              <Link href="/admin/applications" className={styles.viewAllLink}>
                View All <ArrowRight size={14} style={{ display: 'inline', marginLeft: '2px' }} />
              </Link>
            </div>

            {statsLoading ? (
              <Skeleton height={200} />
            ) : stats?.recent_applications && stats.recent_applications.length > 0 ? (
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>App No.</th>
                      <th>Applicant</th>
                      <th>Program</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recent_applications.map((app) => (
                      <tr key={app.id}>
                        <td>
                          <Link href={`/admin/applications?id=${app.id}`} style={{ fontWeight: 'bold', color: 'var(--color-gold-light)' }}>
                            {app.application_no}
                          </Link>
                        </td>
                        <td>{app.full_name}</td>
                        <td>{app.program?.title || 'Management Analytics'}</td>
                        <td>{getStatusBadge(app.status)}</td>
                        <td>{new Date(app.created_at).toLocaleDateString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className={styles.emptyText}>No applications received yet.</p>
            )}
          </div>

          {/* Recent Message Inquiries Card */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Recent Inquiries</h2>
              <Link href="/admin/messages" className={styles.viewAllLink}>
                View All <ArrowRight size={14} style={{ display: 'inline', marginLeft: '2px' }} />
              </Link>
            </div>

            {messagesLoading ? (
              <Skeleton height={200} />
            ) : messages && messages.length > 0 ? (
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Sender</th>
                      <th>Email</th>
                      <th>Subject</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {messages.map((msg) => (
                      <tr key={msg.id}>
                        <td><strong>{msg.name}</strong></td>
                        <td>{msg.email}</td>
                        <td>{msg.subject || 'No Subject'}</td>
                        <td>
                          {msg.is_read ? (
                            <span className={styles.badge} style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--color-muted)' }}>Read</span>
                          ) : (
                            <span className={styles.badge} style={{ backgroundColor: 'rgba(59,130,246,0.1)', color: 'var(--color-info)' }}>New</span>
                          )}
                        </td>
                        <td>{new Date(msg.created_at).toLocaleDateString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className={styles.emptyText}>No messages received yet.</p>
            )}
          </div>
        </div>

        {/* Right Side: Quick Action shortcuts */}
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Quick Management</h2>
          </div>
          
          <div className={styles.actionsCard}>
            {can('programs.create') && (
              <Link href="/admin/programs" className={styles.actionBtn}>
                <GraduationCap className={styles.actionIcon} size={18} />
                <div>
                  <span style={{ display: 'block', color: 'var(--color-white)', fontSize: 'var(--text-sm)' }}>Manage Programs</span>
                  <span style={{ color: 'var(--color-muted)', fontSize: '11px' }}>Create and modify academic curriculum</span>
                </div>
              </Link>
            )}

            {can('faculty.create') && (
              <Link href="/admin/faculty" className={styles.actionBtn}>
                <Users className={styles.actionIcon} size={18} />
                <div>
                  <span style={{ display: 'block', color: 'var(--color-white)', fontSize: 'var(--text-sm)' }}>Faculty Directory</span>
                  <span style={{ color: 'var(--color-muted)', fontSize: '11px' }}>Add and arrange professor profiles</span>
                </div>
              </Link>
            )}

            {can('news.create') && (
              <Link href="/admin/news" className={styles.actionBtn}>
                <Newspaper className={styles.actionIcon} size={18} />
                <div>
                  <span style={{ display: 'block', color: 'var(--color-white)', fontSize: 'var(--text-sm)' }}>Publish News/Events</span>
                  <span style={{ color: 'var(--color-muted)', fontSize: '11px' }}>Publish press updates or calendar events</span>
                </div>
              </Link>
            )}

            {role === 'admin' && (
              <>
                <Link href="/admin/users" className={styles.actionBtn}>
                  <Shield className={styles.actionIcon} size={18} />
                  <div>
                    <span style={{ display: 'block', color: 'var(--color-white)', fontSize: 'var(--text-sm)' }}>Users & Roles</span>
                    <span style={{ color: 'var(--color-muted)', fontSize: '11px' }}>Manage administrative team roles</span>
                  </div>
                </Link>

                <Link href="/admin/settings" className={styles.actionBtn}>
                  <Settings className={styles.actionIcon} size={18} />
                  <div>
                    <span style={{ display: 'block', color: 'var(--color-white)', fontSize: 'var(--text-sm)' }}>Global Settings</span>
                    <span style={{ color: 'var(--color-muted)', fontSize: '11px' }}>Update site parameters & contacts</span>
                  </div>
                </Link>

                <Link href="/admin/audit-log" className={styles.actionBtn}>
                  <ClipboardList className={styles.actionIcon} size={18} />
                  <div>
                    <span style={{ display: 'block', color: 'var(--color-white)', fontSize: 'var(--text-sm)' }}>System Audit Trail</span>
                    <span style={{ color: 'var(--color-muted)', fontSize: '11px' }}>Verify changes and action logs</span>
                  </div>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
