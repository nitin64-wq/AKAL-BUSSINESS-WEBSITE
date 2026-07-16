'use client';

import React, { useState } from 'react';
import styles from './track.module.css';
import { Breadcrumb, Button } from '@/components/ui';
import api from '@/lib/api';
import { Search, Loader2, ClipboardCheck, Clock, ShieldAlert, FileSearch, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface ApplicationStatus {
  application_no: string;
  full_name: string;
  program_title: string;
  status: 'Pending' | 'Under Review' | 'Shortlisted' | 'Accepted' | 'Rejected' | 'Waitlist';
  remarks: string | null;
  submitted_at: string;
}

export default function TrackPage() {
  const [appNo, setAppNo] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApplicationStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appNo.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await api.get(`/applications/track/${appNo.trim()}`);
      if (response.data.status === 'success') {
        setResult(response.data.data);
      } else {
        setError('Application not found. Please verify the code.');
      }
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 404) {
        setError('No application found with the provided code. Please double-check and try again.');
      } else {
        setError('An error occurred while fetching application status. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: ApplicationStatus['status']) => {
    switch (status) {
      case 'Accepted':
        return <span className={`${styles.badge} ${styles.badgeAccepted}`}>Accepted</span>;
      case 'Rejected':
        return <span className={`${styles.badge} ${styles.badgeRejected}`}>Rejected</span>;
      case 'Shortlisted':
        return <span className={`${styles.badge} ${styles.badgeShortlisted}`}>Shortlisted</span>;
      case 'Under Review':
        return <span className={`${styles.badge} ${styles.badgeReview}`}>Under Review</span>;
      case 'Waitlist':
        return <span className={`${styles.badge} ${styles.badgeWaitlist}`}>Waitlisted</span>;
      default:
        return <span className={`${styles.badge} ${styles.badgePending}`}>Pending</span>;
    }
  };

  // Timeline configuration based on status
  const getTimelineSteps = (status: ApplicationStatus['status']) => {
    const steps = [
      { label: 'Application Submitted', desc: 'Received successfully', completed: true, active: false },
      { label: 'Document Verification', desc: 'Under review by admissions', completed: false, active: false },
      { label: 'Admission Decision', desc: 'Final status released', completed: false, active: false, final: true }
    ];

    if (status === 'Pending') {
      steps[1].active = true;
    } else if (status === 'Under Review') {
      steps[0].completed = true;
      steps[1].completed = true;
      steps[1].active = true;
    } else {
      // Shortlisted, Accepted, Rejected, Waitlist
      steps[0].completed = true;
      steps[1].completed = true;
      steps[2].completed = true;
      steps[2].active = true;
    }

    return steps;
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      {/* Hero Banner */}
      <div className={styles.hero}>
        <div className="container">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Admissions', href: '/admissions' },
              { label: 'Track Status', href: '/admissions/track' },
            ]}
          />
          <h1 className={styles.heroTitle}>Track Application</h1>
          <p className={styles.heroSubtitle}>
            Enter your unique admission application number to view your current status and feedback.
          </p>
        </div>
      </div>

      <section className={styles.section}>
        <div className="container" style={{ maxWidth: '750px' }}>
          {/* Search Form Card */}
          <div className={styles.searchCard}>
            <h3 className={styles.cardTitle}>Enter Application Code</h3>
            <p className={styles.cardSubtitle}>Your code was shown on the success screen after applying (e.g., ABS-2026-XXXX).</p>
            
            <form onSubmit={handleTrack} className={styles.searchForm}>
              <div className={styles.inputWrapper}>
                <Search className={styles.searchIcon} size={20} />
                <input
                  type="text"
                  placeholder="e.g. ABS-2026-1042"
                  value={appNo}
                  onChange={(e) => setAppNo(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>
              <Button type="submit" variant="primary" disabled={loading} style={{ minWidth: '130px' }}>
                {loading ? <Loader2 className={styles.spinner} size={18} /> : 'Track Status'}
              </Button>
            </form>

            {error && (
              <div className={styles.errorBox}>
                <AlertCircle size={18} className={styles.errorIcon} />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Tracking Results Card */}
          {result && (
            <div className={styles.resultCard}>
              <div className={styles.resultHeader}>
                <div>
                  <h3 className={styles.applicantName}>{result.full_name}</h3>
                  <p className={styles.programTitle}>{result.program_title}</p>
                </div>
                <div>{getStatusBadge(result.status)}</div>
              </div>

              {/* Grid Info */}
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Application Number</span>
                  <span className={styles.infoValue}>{result.application_no}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Date Submitted</span>
                  <span className={styles.infoValue}>{result.submitted_at}</span>
                </div>
              </div>

              {/* Progress Timeline */}
              <div className={styles.timelineContainer}>
                <h4 className={styles.timelineHeader}>Application Progress</h4>
                
                <div className={styles.timeline}>
                  {getTimelineSteps(result.status).map((step, idx) => {
                    let Icon = Clock;
                    if (step.completed) {
                      Icon = CheckCircle2;
                    }
                    if (step.final && result.status === 'Rejected') {
                      Icon = XCircle;
                    }
                    return (
                      <div key={idx} className={`${styles.timelineStep} ${step.completed ? styles.timelineCompleted : ''} ${step.active ? styles.timelineActive : ''}`}>
                        <div className={styles.timelineIconWrapper}>
                          <Icon size={18} className={styles.timelineStepIcon} />
                        </div>
                        <div className={styles.timelineContent}>
                          <span className={styles.stepLabel}>{step.label}</span>
                          <span className={styles.stepDesc}>{step.desc}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Remarks/Feedback */}
              {result.remarks && (
                <div className={styles.remarksBox}>
                  <h4 className={styles.remarksTitle}>Admissions Team Feedback</h4>
                  <p className={styles.remarksText}>&ldquo;{result.remarks}&rdquo;</p>
                </div>
              )}

              {/* Next Steps Info */}
              {result.status === 'Accepted' && (
                <div className={`${styles.noticeBox} ${styles.noticeSuccess}`}>
                  🎉 <strong>Congratulations!</strong> Your application has been accepted. Our admissions office will contact you via email and phone with your offer letter and details regarding the counseling schedule.
                </div>
              )}
              {result.status === 'Shortlisted' && (
                <div className={`${styles.noticeBox} ${styles.noticeWarning}`}>
                  💼 <strong>Interview Shortlisted:</strong> You have been shortlisted for the personal interview round. Please check your registered email inbox for the interview slot booking link.
                </div>
              )}
              {result.status === 'Rejected' && (
                <div className={`${styles.noticeBox} ${styles.noticeDanger}`}>
                  ✉️ We regret to inform you that your application was not selected for admission this semester. We wish you the best in your future academic endeavors.
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
