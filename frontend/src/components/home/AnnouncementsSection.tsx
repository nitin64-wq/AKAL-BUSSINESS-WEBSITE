'use client';

import React from 'react';
import { useFetch } from '@/hooks/useFetch';
import styles from './AnnouncementsSection.module.css';
import { Bell, ArrowRight, Calendar } from 'lucide-react';

interface Announcement {
  id: number;
  text: string;
  type: string;
  link: string | null;
  show_as_card: boolean;
  created_at: string;
}

export const AnnouncementsSection: React.FC = () => {
  const { data: announcementsList } = useFetch<Announcement[]>(
    '/announcements',
    ['public_announcements']
  );

  // Filter announcements to show in card form on homepage
  const cardAnnouncements = React.useMemo(() => {
    if (!announcementsList) return [];
    return announcementsList.filter((item) => item.show_as_card);
  }, [announcementsList]);

  // If there are no announcements selected to be shown as card, do not render this section!
  if (cardAnnouncements.length === 0) {
    return null;
  }

  const getTypeBadgeStyle = (type: string) => {
    switch (type) {
      case 'Admission': return { backgroundColor: '#FEF3C7', color: '#D97706', border: '1px solid #FDE68A' };
      case 'Event': return { backgroundColor: '#F3E8FF', color: '#7C3AED', border: '1px solid #E9D5FF' };
      case 'Placement': return { backgroundColor: '#D1FAE5', color: '#059669', border: '1px solid #A7F3D0' };
      case 'News': return { backgroundColor: '#E0F2FE', color: '#0284C7', border: '1px solid #BAE6FD' };
      default: return { backgroundColor: '#F3F4F6', color: '#4B5563', border: '1px solid #E5E7EB' };
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return '';
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Notice Board & Announcements</h2>
          <p className={styles.subtitle}>
            Stay updated with the latest news, deadlines, and official notices from Akal Business School.
          </p>
        </div>

        <div className={styles.grid}>
          {cardAnnouncements.map((announcement) => {
            const badgeStyle = getTypeBadgeStyle(announcement.type || 'General');
            const itemLink = announcement.link || 'https://forms.gle/VjWqKM1j4cMrG2kt8';
            
            return (
              <div key={announcement.id} className={styles.card}>
                <div>
                  <div className={styles.cardHeader}>
                    <span 
                      style={{
                        padding: '2px 10px',
                        borderRadius: '9999px',
                        fontSize: '10px',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        ...badgeStyle
                      }}
                    >
                      {announcement.type || 'General'}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={12} style={{ color: 'var(--color-muted)' }} />
                      <span className={styles.date}>{formatDate(announcement.created_at)}</span>
                    </div>
                  </div>
                  <p className={styles.content}>{announcement.text}</p>
                </div>

                <div className={styles.footer}>
                  <a 
                    href={itemLink}
                    target={announcement.link?.startsWith('http') ? '_blank' : '_self'}
                    rel={announcement.link?.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className={styles.actionLink}
                  >
                    <span>{announcement.type === 'Admission' ? 'Apply Now' : 'View Details'}</span>
                    <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
