'use client';

import React from 'react';
import styles from './AnnouncementBar.module.css';
import { useFetch } from '@/hooks/useFetch';

interface Announcement {
  id: number;
  text: string;
  type: string | null;
  link: string | null;
}

export const AnnouncementBar: React.FC = () => {
  const { data: announcementsList } = useFetch<Announcement[]>(
    '/announcements',
    ['public_announcements']
  );

  const announcements = announcementsList && announcementsList.length > 0
    ? announcementsList
    : [];
  
  if (announcements.length === 0) {
    return null;
  }
  
  return (
    <div className={styles.bar}>
      <div className={styles.marquee}>
        {/* Duplicate items for infinite seamless scroll */}
        {Array.from({ length: 4 }).map((_, loopIdx) => (
          <React.Fragment key={loopIdx}>
            {announcements.map((announcement) => {
              const itemLink = announcement.link || "https://forms.gle/VjWqKM1j4cMrG2kt8";
              return (
                <a
                  key={`${loopIdx}-${announcement.id}`}
                  href={itemLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.marqueeItem}
                >
                  <span className={styles.pulsingDot} />
                  {announcement.type && announcement.type !== 'General' && (
                    <span 
                      style={{ 
                        backgroundColor: 'rgba(232, 212, 139, 0.15)', 
                        color: '#E8D48B', 
                        padding: '1px 6px', 
                        borderRadius: '4px', 
                        fontSize: '10px', 
                        fontWeight: '800', 
                        textTransform: 'uppercase',
                        marginRight: '6px',
                        border: '1px solid rgba(232, 212, 139, 0.3)',
                        letterSpacing: '0.5px'
                      }}
                    >
                      {announcement.type}
                    </span>
                  )}
                  <span>{announcement.text}</span>
                  <span style={{ color: '#E8D48B', marginLeft: '4px' }}>— Apply Now &rarr;</span>
                </a>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
