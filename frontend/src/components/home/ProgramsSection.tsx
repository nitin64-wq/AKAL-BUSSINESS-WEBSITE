'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { SectionHeader, Badge, Button, Skeleton } from '@/components/ui';
import { programService } from '@/services/programService';
import type { Program } from '@/types';
import { ArrowRight, Check, FileDown } from 'lucide-react';
import styles from './ProgramsSection.module.css';

export const ProgramsSection: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await programService.getAll();
        if (response.status === 'success' && response.data.length > 0) {
          setPrograms(response.data);
        } else {
          setPrograms([]);
        }
      } catch (err) {
        console.error(err);
        setPrograms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  if (!loading && programs.length === 0) {
    return null;
  }

  return (
    <section className={`${styles.section} sectionLight`}>
      <div className="container">
        <SectionHeader
          title="Programs Designed For Tomorrow's Economy"
          subtitle="Academics & Curricula"
          theme="light"
          description="Prepare for the future of business. ABS offers rigorous academic degrees embedded with hands-on technical analytics and business intelligence training."
        />

        <div className={styles.grid}>
          {loading
            ? Array.from({ length: 2 }).map((_, idx) => (
              <div key={idx} className={styles.programCard}>
                <div className={styles.headerArea}>
                  <Skeleton width={120} height={20} className="mb-4" />
                  <Skeleton height={32} className="mb-2" />
                </div>
                <div className={styles.content}>
                  <Skeleton height={60} className="mb-4" />
                  <Skeleton height={80} className="mb-4" />
                  <Skeleton height={40} />
                </div>
              </div>
            ))
            : programs.slice(0, 2).map((program) => (
              <div key={program.id} className={styles.programCard}>
                {/* Header */}
                <div className={styles.headerArea}>
                  <div className={styles.badgeWrapper}>
                    <Badge variant="gold">
                      {program.type}
                    </Badge>
                    <span className={styles.durationBadge}>
                      {program.type === 'MBA' ? 'Postgraduate' : 'Undergraduate'}
                    </span>
                  </div>
                  <h3 className={styles.title}>{program.title}</h3>
                </div>

                {/* Content */}
                <div className={styles.content}>
                  <p className={styles.desc}>{program.description}</p>

                  {/* Metrics Box */}
                  <div className={styles.metricsGrid}>
                    <div className={styles.metricItem}>
                      <span className={styles.metricLabel}>Duration</span>
                      <span className={styles.metricVal}>{program.duration}</span>
                    </div>
                    <div className={styles.metricItem}>
                      <span className={styles.metricLabel}>Intake Capacity</span>
                      <span className={styles.metricVal}>{program.seats} Seats</span>
                    </div>
                  </div>

                  {/* Highlights List */}
                  {Array.isArray(program.highlights) && program.highlights.length > 0 && (
                    <div>
                      <h4 className={styles.highlightTitle}>Core Curriculum Focus</h4>
                      <ul className={styles.highlightList}>
                        {program.highlights.slice(0, 4).map((high, i) => (
                          <li key={i} className={styles.highlightItem}>
                            <Check size={14} className={styles.checkIcon} />
                            <span>{high}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Footer */}
                  <div className={styles.footer}>
                    <div className={styles.feeBox}>
                      <span className={styles.feeLabel}>Annual Academic Fee</span>
                      <span className={styles.fee}>
                        {program.fee_per_year
                          ? `₹${Number(program.fee_per_year).toLocaleString('en-IN')}`
                          : 'Contact Desk'}
                      </span>
                    </div>

                    <div className={styles.actions}>
                      <Link href={`/academics/${program.slug}`}>
                        <Button
                          variant="primary"
                          size="md"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          Details <ArrowRight size={14} />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};
