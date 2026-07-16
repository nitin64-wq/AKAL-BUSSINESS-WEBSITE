'use client';

import React, { useState, useMemo } from 'react';
import styles from './placements.module.css';
import { Breadcrumb } from '@/components/ui';
import { Search, Trophy, GraduationCap, Award, BookOpen, Lightbulb, Star } from 'lucide-react';
import { useFetch } from '@/hooks/useFetch';

interface PlacementRecord {
  id: number;
  name: string;
  batch: string;
  company: string;
}

const PLACEMENT_RECORDS: PlacementRecord[] = [
  { id: 1, name: 'Simranpreet Kaur', batch: 'MBA (2023–2025)', company: 'Oracle India Pvt. Ltd.' },
  { id: 2, name: 'Prabhjot Virk', batch: 'MBA (2023–2025)', company: 'Oracle India Pvt. Ltd.' },
  { id: 3, name: 'Sarvjeet Kaur', batch: 'MBA (2023–2025)', company: 'K C Global EdTech Pvt. Ltd.' },
  { id: 4, name: 'Anchal Soni', batch: 'MBA (2023–2025)', company: 'Xenage Solutions Pvt. Ltd.' },
  { id: 5, name: 'Baljeet Kaur', batch: 'MBA (2023–2025)', company: 'K C Global EdTech Pvt. Ltd.' },
  { id: 6, name: 'Gurdev Kaur', batch: 'MBA (2023–2025)', company: 'Greenway Carriers' },
  { id: 7, name: 'Raman Punihani', batch: 'MBA (2022–2024)', company: 'PR Operational Services Pvt. Ltd.' },
  { id: 8, name: 'Satnam Kaur', batch: 'MBA (2022–2024)', company: 'Xenage Solution Pvt. Ltd.' },
  { id: 9, name: 'Arihant Garg', batch: 'MBA (2022–2024)', company: 'BJS Distribution & Storage & Couriers Pvt. Ltd.' },
  { id: 10, name: 'Gagandeep Kaur', batch: 'MBA (2022–2024)', company: 'The Kalgidhar Trust, Baru Sahib' },
  { id: 11, name: 'Ramandeep Kaur', batch: 'MBA (2022–2024)', company: 'Western Refrigeration Pvt. Ltd.' },
  { id: 12, name: 'Loveleen Kaur', batch: 'MBA (2022–2024)', company: 'Jivo Wellness Pvt. Ltd.' },
  { id: 13, name: 'Kiranjot Kaur', batch: 'MBA (2022–2024)', company: 'Xenage Solution Pvt. Ltd.' },
  { id: 14, name: 'Harjeet Kaur', batch: 'MBA (2022–2024)', company: 'BJS Distribution & Storage & Couriers Pvt. Ltd.' },
  { id: 15, name: 'Mohit Seoda', batch: 'MBA (2022–2024)', company: 'BJS Distribution & Storage & Couriers Pvt. Ltd.' },
  { id: 16, name: 'Amandeep Kaur', batch: 'MBA (2021–2023)', company: 'BJS Distribution & Storage & Couriers Pvt. Ltd.' },
  { id: 17, name: 'Harpreet Kaur', batch: 'MBA (2021–2023)', company: 'BJS Distribution & Storage & Couriers Pvt. Ltd.' },
  { id: 18, name: 'Khushdeep Kaur', batch: 'MBA (2021–2023)', company: 'BJS Distribution & Storage & Couriers Pvt. Ltd.' },
  { id: 19, name: 'Muskan Kumari', batch: 'MBA (2021–2023)', company: 'Hamid & Kumar Enterprises LLC' },
  { id: 20, name: 'Paramjeet Kaur', batch: 'MBA (2021–2023)', company: 'Hamid & Kumar Enterprises LLC' },
  { id: 21, name: 'Ruchi Rani', batch: 'MBA (2021–2023)', company: 'BJS Distribution & Storage & Couriers Pvt. Ltd.' },
  { id: 22, name: 'Manjinder Kaur', batch: 'MBA (2021–2023)', company: 'University of North Texas (USA)' },
  { id: 23, name: 'Rasleen Kaur', batch: 'MBA (2021–2023)', company: 'Florida State University (USA)' },
  { id: 24, name: 'Anchal Rani', batch: 'MBA (2021–2023)', company: 'The Kalgidhar Trust, Baru Sahib' },
  { id: 25, name: 'Emanpreet Kaur', batch: 'MBA (2021–2023)', company: 'The Kalgidhar Trust, Baru Sahib' },
  { id: 26, name: 'Rasdeep Kaur', batch: 'MBA (2021–2023)', company: 'The Kalgidhar Trust, Baru Sahib' },
];

const ACHIEVEMENTS = [
  {
    icon: Trophy,
    title: 'Ms. Manjinder Kaur Qualified GMAT',
    description: 'Ms. Manjinder Kaur successfully qualified GMAT, demonstrating exceptional aptitude for global business education.',
    badge: 'GMAT Qualifier',
  },
  {
    icon: GraduationCap,
    title: 'Fully Funded PhD — University of North Texas',
    description: 'Ms. Manjinder Kaur, a student from MBA Business Analytics, secured a fully funded Ph.D. position in University of North Texas, USA.',
    badge: 'PhD — USA',
  },
  {
    icon: GraduationCap,
    title: 'Fully Funded PhD — Florida State University',
    description: 'Ms. Rasleen Kaur, a student from MBA Business Analytics, secured a fully funded Ph.D. position in Florida State University, USA.',
    badge: 'PhD — USA',
  },
  {
    icon: Lightbulb,
    title: 'Snug-Sakhi Business Incubation',
    description: 'Successfully incubated Snug-Sakhi Business Idea by two BBA students (Puneet Singla & Rajveer Kaur) through Akal Incubation Centre.',
    badge: 'Entrepreneurship',
  },
  {
    icon: BookOpen,
    title: '18 Research Papers at International Conferences',
    description: '18 MBA students presented research papers in International Conferences, showcasing strong research capabilities.',
    badge: 'Research',
  },
  {
    icon: Award,
    title: 'Best Paper Award — Ms. Harleen Kaur',
    description: 'Ms. Harleen Kaur received the Best Paper Award at the International Conference on Strengthening the Industry-Academia Interface for Inclusive and Sustainable Economic Growth (2025) at Eternal University, Baru Sahib, Sirmour, Himachal Pradesh.',
    badge: 'Best Paper',
  },
];

export default function PlacementsPage() {
  const [search, setSearch] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');

  // Fetch settings dynamically from database
  const { data: settings } = useFetch<Record<string, any>>('/settings', ['settings_public']);

  const placementRecords = useMemo(() => {
    return settings?.page_placements_students?.students || PLACEMENT_RECORDS;
  }, [settings]);

  const batches = useMemo<string[]>(() => {
    return Array.from(new Set(placementRecords.map((r: any) => r.batch)));
  }, [placementRecords]);

  const filteredRecords = useMemo(() => {
    return placementRecords.filter((record: any) => {
      const matchesSearch =
        record.name.toLowerCase().includes(search.toLowerCase()) ||
        record.company.toLowerCase().includes(search.toLowerCase());
      const matchesBatch = selectedBatch === '' || record.batch === selectedBatch;
      return matchesSearch && matchesBatch;
    });
  }, [search, selectedBatch, placementRecords]);

  // Stats
  const totalPlaced = placementRecords.length;
  const totalCompanies = new Set(placementRecords.map((r: any) => r.company)).size;
  const totalBatches = batches.length;

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  return (
    <div className={styles.pageWrapper}>
      {/* Hero Banner */}
      <div className={styles.hero}>
        <div className="container">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Placements', href: '/placements' },
            ]}
          />
          <h1 className={styles.heroTitle}>Student Placements</h1>
          <p className={styles.heroSubtitle}>
            100% Placement Assistance — Our graduates work across IT, logistics, consulting, EdTech, manufacturing, and international firms.
          </p>
        </div>
      </div>

      {/* Stats Bar */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statCardGlow} />
              <div className={styles.statIcon}>🎓</div>
              <div className={styles.statNum}>{totalPlaced}+</div>
              <div className={styles.statLabel}>Students Placed</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statCardGlow} />
              <div className={styles.statIcon}>🏢</div>
              <div className={styles.statNum}>{totalCompanies}+</div>
              <div className={styles.statLabel}>Recruiting Organizations</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statCardGlow} />
              <div className={styles.statIcon}>📅</div>
              <div className={styles.statNum}>{totalBatches}</div>
              <div className={styles.statLabel}>MBA Batches</div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className={styles.filterBar}>
            <div className={styles.searchWrapper}>
              <Search className={styles.searchIcon} size={18} />
              <input
                type="text"
                placeholder="Search by student name or company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            <div className={styles.filtersGroup}>
              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className={styles.selectInput}
              >
                <option value="">All Batches</option>
                {batches.map((batch, i) => (
                  <option key={i} value={batch}>{batch}</option>
                ))}
              </select>

              {/* View Toggle Buttons */}
              <div className={styles.toggleGroup}>
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`${styles.toggleBtn} ${viewMode === 'grid' ? styles.toggleActive : ''}`}
                  title="Grid View"
                >
                  Grid
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={`${styles.toggleBtn} ${viewMode === 'table' ? styles.toggleActive : ''}`}
                  title="Table View"
                >
                  Table
                </button>
              </div>
            </div>
          </div>

          {/* Placed Students Output */}
          {filteredRecords.length > 0 ? (
            viewMode === 'grid' ? (
              /* Premium Card Grid View */
              <div className={styles.recordsGrid}>
                {filteredRecords.map((record: any, idx: number) => {
                  const colors = ['#6366F1', '#EC4899', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
                  const avatarBg = colors[idx % colors.length];
                  const initials = record.name
                    ? record.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
                    : 'ST';

                  return (
                    <div key={idx} className={styles.studentCard}>
                      <div className={styles.cardHeader}>
                        <div className={styles.avatar} style={{ backgroundColor: avatarBg }}>
                          {initials}
                        </div>
                        <div className={styles.meta}>
                          <h4 className={styles.studentName}>{record.name}</h4>
                          <span className={`${styles.batchBadge} ${
                            record.batch.includes('2023–2025') ? styles.batchGreen :
                            record.batch.includes('2022–2024') ? styles.batchBlue :
                            styles.batchOrange
                          }`}>
                            {record.batch}
                          </span>
                        </div>
                      </div>
                      <div className={styles.cardBody}>
                        <span className={styles.placedLabel}>Placed At</span>
                        <h5 className={styles.placedCompany}>{record.company}</h5>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Redesigned Premium Table View */
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th style={{ width: '60px', textAlign: 'center' }}>#</th>
                      <th>Student Name</th>
                      <th>Batch</th>
                      <th>Company / Organization</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.map((record: any, idx: number) => (
                      <tr key={idx}>
                        <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', color: 'var(--color-gold)', fontWeight: 'bold' }}>
                          {idx + 1}
                        </td>
                        <td className={styles.tableStudentName}>
                          {record.name}
                        </td>
                        <td>
                          <span className={`${styles.batchBadge} ${
                            record.batch.includes('2023–2025') ? styles.batchGreen :
                            record.batch.includes('2022–2024') ? styles.batchBlue :
                            styles.batchOrange
                          }`}>
                            {record.batch}
                          </span>
                        </td>
                        <td className={styles.tableCompanyName}>{record.company}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            <div className={styles.noResults}>
              No student records found matching your search criteria.
            </div>
          )}

          <div className={styles.resultsCount}>
            Showing {filteredRecords.length} of {totalPlaced} placement records
          </div>
        </div>
      </section>

      {/* Student Achievements Section */}
      <section className={styles.achievementsSection}>
        <div className="container">
          <div className={styles.achievementsHeader}>
            <span className={styles.achievementsBadge}>Excellence & Recognition</span>
            <h2 className={styles.achievementsTitle}>Student Achievements</h2>
          </div>

          <div className={styles.achievementsGrid}>
            {ACHIEVEMENTS.map((ach, idx) => {
              const IconComponent = ach.icon;
              return (
                <div key={idx} className={styles.achievementCard}>
                  <div className={styles.achievementCardGlow} />
                  
                  <div className={styles.achievementHeaderRow}>
                    <div className={styles.achievementIconWrapper}>
                      <IconComponent size={20} />
                    </div>
                    <span className={styles.achievementBadgeText}>
                      {ach.badge}
                    </span>
                  </div>

                  <h3 className={styles.achievementTitleText}>
                    {ach.title}
                  </h3>
                  <p className={styles.achievementDescText}>
                    {ach.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
