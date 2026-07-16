/* ============================================================
   ABS — Admissions Applications Manager
   Provides searchable/filterable directory of applications, details view,
   status updates (RBAC guarded), and Excel/CSV exporting.
   ============================================================ */

'use client';

import React, { useState } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { usePermission } from '@/hooks/usePermission';
import { useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import styles from './Applications.module.css';
import { DataTable, Modal } from '@/components/admin';
import { Button, Skeleton } from '@/components/ui';
import { FileSpreadsheet, FileText, Download, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

interface Program {
  id: number;
  title: string;
}

interface Application {
  id: number;
  application_no: string;
  program_id: number;
  program?: Program;
  full_name: string;
  email: string;
  phone: string;
  date_of_birth: string | null;
  gender: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  last_qualification: string | null;
  marks_percentage: number | null;
  entrance_exam: string | null;
  entrance_score: string | null;
  work_experience: number;
  category: 'General' | 'SC' | 'ST' | 'OBC' | 'EWS' | 'PWD';
  status: 'Pending' | 'Under Review' | 'Shortlisted' | 'Accepted' | 'Rejected' | 'Waitlist';
  documents: Record<string, string> | null;
  remarks: string | null;
  created_at: string;
}

export default function AdminApplicationsPage() {
  const { can, role } = usePermission();
  const queryClient = useQueryClient();

  // Filters State
  const [statusFilter, setStatusFilter] = useState('');
  const [programFilter, setProgramFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Details State
  const [selectedAppId, setSelectedAppId] = useState<number | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  // Status update Form states
  const [updatedStatus, setUpdatedStatus] = useState<string>('Pending');
  const [updatedRemarks, setUpdatedRemarks] = useState<string>('');
  const [savingStatus, setSavingStatus] = useState(false);

  // Fetch programs for filter dropdown
  const { data: programs } = useFetch<Program[]>(
    '/programs',
    ['filter_programs']
  );

  // Fetch applications list (fetch with large limit to enable server-assisted filtering via parameters)
  const { data: applications, isLoading } = useFetch<Application[]>(
    '/admin/applications',
    ['admin_applications', statusFilter, programFilter, searchQuery],
    {
      params: {
        per_page: 100, // Fetch top records
        status: statusFilter,
        program_id: programFilter,
        search: searchQuery
      },
      refetchOnWindowFocus: true
    }
  );

  // Fetch single application details when selected
  const { data: activeApp, isLoading: detailLoading } = useFetch<Application>(
    `/admin/applications/${selectedAppId}`,
    ['application_details', String(selectedAppId)],
    {
      enabled: selectedAppId !== null,
    }
  );

  // Check URL query parameters for ?id=X to open details modal automatically
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlId = params.get('id');
      if (urlId) {
        const idNum = parseInt(urlId);
        if (!isNaN(idNum)) {
          setSelectedAppId(idNum);
          setDetailModalOpen(true);
        }
      }
    }
  }, []);

  // Synchronize status update form values when activeApp loads
  React.useEffect(() => {
    if (activeApp) {
      setUpdatedStatus(activeApp.status);
      setUpdatedRemarks(activeApp.remarks || '');
    }
  }, [activeApp]);

  const handleOpenDetails = (app: Application) => {
    setSelectedAppId(app.id);
    setDetailModalOpen(true);
  };

  const handleSaveStatus = async () => {
    if (!selectedAppId || !can('applications.update_status')) return;
    setSavingStatus(true);
    try {
      await api.patch(`/admin/applications/${selectedAppId}/status`, {
        status: updatedStatus,
        remarks: updatedRemarks,
      });
      toast.success('Application status updated.');
      setDetailModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['admin_applications'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard_stats'] });
    } catch {
      toast.error('Failed to update status.');
    } finally {
      setSavingStatus(false);
    }
  };

  const handleDelete = async (app: Application) => {
    if (!can('applications.delete')) {
      toast.error('Forbidden: Insufficient privileges.');
      return;
    }
    if (confirm(`Are you sure you want to delete application ${app.application_no}?`)) {
      try {
        await api.delete(`/admin/applications/${app.id}`);
        toast.success('Application deleted successfully.');
        queryClient.invalidateQueries({ queryKey: ['admin_applications'] });
      } catch {
        toast.error('Failed to delete application.');
      }
    }
  };

  const handleExportCSV = async () => {
    try {
      toast.loading('Preparing CSV export...', { duration: 2000 });
      const response = await api.get('/admin/applications/export/csv', {
        params: { status: statusFilter },
        responseType: 'blob',
      });
      
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `applications_export_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('CSV Downloaded!');
    } catch {
      toast.error('Failed to export CSV data.');
    }
  };

  const handleExportPDF = (appId: number) => {
    // Open print view HTML template from backend
    const url = `${api.defaults.baseURL}/admin/applications/${appId}/export/pdf`;
    window.open(url, '_blank');
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Accepted':
        return styles.badgeApproved;
      case 'Rejected':
        return styles.badgeRejected;
      case 'Pending':
        return styles.badgePending;
      default:
        return styles.badgePending; // Fallback to orange warning badge
    }
  };

  const columns = [
    { key: 'application_no', label: 'App No.', sortable: true },
    { key: 'full_name', label: 'Applicant Name', sortable: true },
    {
      key: 'program',
      label: 'Program',
      sortable: true,
      render: (row: Application) => row.program?.title || 'Selected Program',
    },
    {
      key: 'marks_percentage',
      label: 'Qualifying %',
      sortable: true,
      render: (row: Application) => row.marks_percentage ? `${row.marks_percentage}%` : 'N/A',
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (row: Application) => (
        <span className={`${styles.badge} ${getStatusClass(row.status)}`}>
          {row.status}
        </span>
      ),
    },
    {
      key: 'created_at',
      label: 'Submitted Date',
      sortable: true,
      render: (row: Application) => new Date(row.created_at).toLocaleDateString('en-IN'),
    },
  ];

  return (
    <div>
      {/* Search / Filter Header */}
      <div className={styles.filterHeader}>
        {/* Search */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Search Applicant</label>
          <input
            type="text"
            placeholder="Name, App No, Email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.filterInput}
          />
        </div>

        {/* Program Filter */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Academic Course</label>
          <select
            value={programFilter}
            onChange={(e) => setProgramFilter(e.target.value)}
            className={styles.filterInput}
          >
            <option value="">All Programs</option>
            {programs?.map((p) => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Review Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={styles.filterInput}
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Under Review">Under Review</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
            <option value="Waitlist">Waitlist</option>
          </select>
        </div>

        {/* Export Button */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 'var(--space-2)' }}>
          <Button variant="secondary" size="sm" onClick={handleExportCSV} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <FileSpreadsheet size={16} /> Export Excel/CSV
          </Button>
        </div>
      </div>

      {/* Main applications table */}
      {isLoading ? (
        <div style={{ color: 'var(--color-gold)' }}>Loading admissions tracker...</div>
      ) : (
        <DataTable
          title="Student Applications Tracker"
          subtitle="Review incoming student registrations, qualifications, and marks percentages"
          columns={columns}
          data={applications || []}
          searchPlaceholder="Filter client-side..."
          onEdit={handleOpenDetails}
          onDelete={can('applications.delete') ? handleDelete : undefined}
          actionsColumnWidth="80px"
        />
      )}

      {/* Details View Modal */}
      <Modal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        title={activeApp ? `Application Detail: ${activeApp.application_no}` : 'Loading application...'}
        maxWidth="900px"
      >
        {detailLoading ? (
          <div className="space-y-4">
            <Skeleton height={100} />
            <Skeleton height={200} />
          </div>
        ) : activeApp ? (
          <div className={styles.detailsGrid}>
            
            {/* Left Side: Applicant details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              
              {/* Personal Info */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Personal Details</h3>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Full Name</span>
                    <span className={styles.infoValue}>{activeApp.full_name}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Email</span>
                    <span className={styles.infoValue}>{activeApp.email}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Phone</span>
                    <span className={styles.infoValue}>{activeApp.phone}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>DOB & Gender</span>
                    <span className={styles.infoValue}>
                      {activeApp.date_of_birth ? new Date(activeApp.date_of_birth).toLocaleDateString('en-IN') : 'N/A'} • {activeApp.gender || 'N/A'}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Social Category</span>
                    <span className={styles.infoValue}>{activeApp.category}</span>
                  </div>
                </div>
              </div>

              {/* Address details */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Address Info</h3>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem} style={{ gridColumn: '1 / -1' }}>
                    <span className={styles.infoLabel}>Mailing Address</span>
                    <span className={styles.infoValue}>{activeApp.address || 'N/A'}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>City & State</span>
                    <span className={styles.infoValue}>
                      {activeApp.city ? `${activeApp.city}, ` : ''}{activeApp.state || 'N/A'}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Pincode</span>
                    <span className={styles.infoValue}>{activeApp.pincode || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Academics & qualification */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Academic Qualifications</h3>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Applied Program</span>
                    <span className={styles.infoValue}>{activeApp.program?.title || 'Management Analytics'}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Last Qualification</span>
                    <span className={styles.infoValue}>{activeApp.last_qualification || 'Graduate'}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Qualifying Marks (%)</span>
                    <span className={styles.infoValue}>{activeApp.marks_percentage ? `${activeApp.marks_percentage}%` : 'N/A'}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Work Experience</span>
                    <span className={styles.infoValue}>{activeApp.work_experience ? `${activeApp.work_experience} Months` : 'None / Fresher'}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Entrance Exam</span>
                    <span className={styles.infoValue}>{activeApp.entrance_exam || 'None'}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Entrance Score</span>
                    <span className={styles.infoValue}>{activeApp.entrance_score || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Document files */}
              {activeApp.documents && Object.keys(activeApp.documents).length > 0 && (
                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>Submitted Document Files</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-2)' }}>
                    {Object.entries(activeApp.documents).map(([key, val]) => (
                      <a
                        key={key}
                        href={`${api.defaults.baseURL?.replace('/api', '')}/storage/${val}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.docLink}
                      >
                        <Download size={14} />
                        <span>Download {key.replace('_', ' ').toUpperCase()}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Side: Status Updates */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Review Status</h3>
                
                {can('applications.update_status') ? (
                  <div className={styles.statusContainer}>
                    <div className={styles.infoItem}>
                      <label className={styles.infoLabel} htmlFor="update-status">Review Status</label>
                      <select
                        id="update-status"
                        value={updatedStatus}
                        onChange={(e) => setUpdatedStatus(e.target.value)}
                        className={styles.select}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Waitlist">Waitlist</option>
                      </select>
                    </div>

                    <div className={styles.infoItem}>
                      <label className={styles.infoLabel} htmlFor="update-remarks">Admissions Team Remarks</label>
                      <textarea
                        id="update-remarks"
                        value={updatedRemarks}
                        onChange={(e) => setUpdatedRemarks(e.target.value)}
                        className={styles.textarea}
                        placeholder="Add remarks or instructions sent to candidate..."
                      />
                    </div>

                    <Button
                      onClick={handleSaveStatus}
                      disabled={savingStatus}
                      variant="primary"
                      size="sm"
                      fullWidth
                    >
                      {savingStatus ? 'Updating...' : 'Update Application'}
                    </Button>
                  </div>
                ) : (
                  <div className={styles.statusContainer}>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Current Status</span>
                      <span className={`${styles.badge} ${getStatusClass(activeApp.status)}`} style={{ width: 'fit-content' }}>
                        {activeApp.status}
                      </span>
                    </div>
                    <div className={styles.infoItem} style={{ marginTop: 'var(--space-2)' }}>
                      <span className={styles.infoLabel}>Team Remarks</span>
                      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-off-white)', fontStyle: 'italic' }}>
                        {activeApp.remarks || 'No remarks added yet.'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* PDF Print view button */}
              <div className={styles.section} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <h3 className={styles.sectionTitle}>Reports & Exports</h3>
                <Button
                  onClick={() => handleExportPDF(activeApp.id)}
                  variant="secondary"
                  size="sm"
                  fullWidth
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                >
                  <FileText size={16} /> Print Application PDF
                </Button>
              </div>

            </div>

          </div>
        ) : null}
      </Modal>
    </div>
  );
}
