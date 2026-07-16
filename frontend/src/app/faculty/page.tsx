'use client';

import React, { useMemo } from 'react';
import styles from './faculty.module.css';
import { Breadcrumb, Skeleton, SocialIcons } from '@/components/ui';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { useFetch } from '@/hooks/useFetch';
import type { Faculty } from '@/types';
import Link from 'next/link';

const FALLBACK_FACULTY: Faculty[] = [
  {
    id: 1,
    name: 'Dr. Suraj Verma',
    slug: 'dr-suraj-verma',
    designation: 'Assistant Professor',
    department: 'Business Analytics',
    photo: '/images/faculty/Dr_Suraj_Verma.png',
    linkedin_url: 'https://linkedin.com',
    specialization: 'Marketing Management, Consumer Behavior, HRM, Digital Marketing, and Statistics',
    qualification: 'Ph.D. in Management (Shoolini University), MBA (Marketing & Finance)',
    experience_years: 12,
    bio: 'Dr. Suraj Verma holds a Ph.D. in Management from Shoolini University, along with an MBA in Marketing and Finance. His academic interests include Marketing Management, Consumer Behavior, Human Resource Management, Digital Marketing, and Statistics. He has published several research papers in reputed national and international journals and has contributed a book chapter in the field of management. His research primarily focuses on consumer decision-making and rural markets. He is also the holder of a granted design patent and multiple copyrights, and actively participates in faculty development programs, workshops, and academic conferences.',
    email: 'suraj.verma@abs.edu',
    google_scholar: 'https://scholar.google.com/citations?view_op=search_authors&mauthors=Dr.+Suraj+Verma+Akal+University',
    publications: 10,
    is_distinguished: true,
    sort_order: 1,
    is_active: true,
    created_at: '',
    updated_at: ''
  },
  {
    id: 2,
    name: 'Dr. Priyanka',
    slug: 'dr-priyanka',
    designation: 'Assistant Professor',
    department: 'Finance & Accounts',
    photo: '/images/faculty/Dr_Priyanka.png',
    linkedin_url: 'https://linkedin.com',
    specialization: 'Finance, Accounting, and Taxation',
    qualification: 'Ph.D. (Central University of Punjab), UGC NET-JRF',
    experience_years: 3,
    bio: 'Dr. Priyanka is serving as an Assistant Professor in the Department of Akal Business School at Akal University. She completed her Ph.D. from the Central University of Punjab and has qualified the UGC NET–JRF. With approximately three years of experience in higher education, she has been actively involved in teaching, research activities, and academic mentoring. Her areas of specialization and research interest include Finance, Accounting, and Taxation. She is committed to academic excellence and continuously strives to enhance her knowledge while contributing meaningfully to research and higher education.',
    email: 'priyanka@abs.edu',
    google_scholar: 'https://scholar.google.com/citations?view_op=search_authors&mauthors=Dr.+Priyanka+Akal+University',
    publications: 5,
    is_distinguished: false,
    sort_order: 2,
    is_active: true,
    created_at: '',
    updated_at: ''
  },
  {
    id: 3,
    name: 'Syed Owais Khursheed',
    slug: 'syed-owais-khursheed',
    designation: 'Assistant Professor',
    department: 'Strategy & Marketing',
    photo: '/images/faculty/Syed_Owais_Khursheed.png',
    linkedin_url: 'https://linkedin.com',
    specialization: 'Financial Management, Accounting, Economics',
    qualification: 'MBA (Financial Management), M. Com, B.Ed. (SET Qualified)',
    experience_years: 6,
    bio: 'Syed Owais Khursheed is an Assistant Professor in Finance at Akal University. He holds an MBA (Financial Management), M. Com, and B.Ed., and has qualified for the State Eligibility Test (SET) for Assistant Professor. He is currently pursuing an Integrated Ph.D. (Finance) at the Department of Management Studies, University of Kashmir. He also holds additional diplomas in International Business Operations, Computer Applications, and Business Accounting. His teaching interests include Financial Management, Accounting, Economics, and related areas. His research spans agricultural finance, healthcare service quality, and consumer behaviour. He has published several research papers in reputable journals and has presented his work at national and international conference presentations. He contributed to a RUSA-sponsored research project on Healthcare Service Quality as a research fellow. In addition, he is actively involved in academic workshops, faculty development programs, and institutional development initiatives.',
    email: 'owais@abs.edu',
    google_scholar: 'https://scholar.google.com/citations?view_op=search_authors&mauthors=Syed+Owais+Khursheed+Akal+University',
    publications: 4,
    is_distinguished: false,
    sort_order: 3,
    is_active: true,
    created_at: '',
    updated_at: ''
  },
  {
    id: 4,
    name: 'Dr. Ayash Manzoor',
    slug: 'dr-ayash-manzoor',
    designation: 'Assistant Professor',
    department: 'Human Resources',
    photo: '/images/faculty/Dr_Ayash_Manzoor.png',
    linkedin_url: 'https://linkedin.com',
    specialization: 'Consumer Behaviour, Strategic Management, Digital Marketing and Entrepreneurship',
    qualification: 'Ph.D. in Management (University of Kashmir), UGC-NET',
    experience_years: 3,
    bio: 'Dr. Ayash Manzoor is serving as an Assistant Professor in the Department of Akal Business School at Akal University. He is UGC-NET qualified academician and AMCAT certified professional with specialization in Marketing. He holds a Ph.D. in Management from University of Kashmir, Srinagar with research focused on Social Media Influencer Marketing and its impact on brand awareness and purchase intention among Generation Y and Generation Z. He has published several research papers and book chapters in reputed national and international journals. He has also contributed to various research projects sponsored by Indian Council of Social Science Research (ICSSR) as Research Assistant. His teaching and research interests include Consumer Behaviour, Strategic Management, Digital Marketing and Entrepreneurship. Dr. Ayash Manzoor has over 3 years of experience beyond teaching, including corporate exposure with Yes Bank India Ltd. and Extramarks Learning. His professional background in banking and the ed-tech sector has strengthened his industry perspective, enabling him to connect academic concepts with real-world business practices effectively.',
    email: 'ayash@abs.edu',
    google_scholar: 'https://scholar.google.com/citations?view_op=search_authors&mauthors=Dr.+Ayash+Manzoor+Akal+University',
    publications: 3,
    is_distinguished: false,
    sort_order: 4,
    is_active: true,
    created_at: '',
    updated_at: ''
  },
  {
    id: 5,
    name: 'Dr. Rupinder Kaur',
    slug: 'dr-rupinder-kaur',
    designation: 'Assistant Professor',
    department: 'Economics & Decisions',
    photo: '/images/faculty/Dr_Rupinder_Kaur.png',
    linkedin_url: 'https://linkedin.com',
    specialization: 'Green Investment, Quantum Finance, Environmental Efficiency & Economic Development',
    qualification: 'Ph.D. in Business Administration, UGC-NET & JRF',
    experience_years: 9,
    bio: 'Dr. Rupinder Kaur is an accomplished academician and serves as an Assistant Professor in Finance. Dr. Kaur holds a Ph.D. in Business Administration with specialisation in Green Foreign Direct Investment and Sustainable Development. She qualified the UGC- NET examination and was awarded the prestigious Junior Research Fellowship (JRF) in recognition of her academic excellence. Her research interests encompass Green investment, Quantum finance Environmental efficiency, and Economic development. She has published extensively in reputed national and international journals and regularly presents her scholarly work at prominent academic conferences.',
    email: 'rupinder@abs.edu',
    google_scholar: 'https://scholar.google.com/citations?view_op=search_authors&mauthors=Dr.+Rupinder+Kaur+Akal+University',
    publications: 6,
    is_distinguished: false,
    sort_order: 5,
    is_active: true,
    created_at: '',
    updated_at: ''
  },
  {
    id: 6,
    name: 'Dr. Peerzada Munaqib Naseer',
    slug: 'dr-peerzada-munaqib-naseer',
    designation: 'Assistant Professor',
    department: 'Operations & Supply Chain',
    photo: '/images/faculty/Dr_Peerzada_Munaqib_Naseer.png',
    linkedin_url: 'https://linkedin.com',
    specialization: 'Sustainable Consumption, Consumer Behaviour & Wellbeing',
    qualification: 'Ph.D. in Management, Integrated MBA (Marketing & IT)',
    experience_years: 5,
    bio: 'Dr. Peerzada Munaqib Naseer is an Assistant Professor in Marketing and Analytics with a Ph.D. in Management specializing in Sustainable Marketing. He holds an Integrated MBA in Marketing and IT. His research focuses on sustainable consumption, consumer behaviour and Wellbeing. He has published in reputed national and international journals and serves as a reviewer for leading publishers, including Emerald Insights and Frontiers.',
    email: 'munaqib@abs.edu',
    google_scholar: 'https://scholar.google.com/citations?view_op=search_authors&mauthors=Dr.+Peerzada+Munaqib+Naseer+Akal+University',
    publications: 4,
    is_distinguished: false,
    sort_order: 6,
    is_active: true,
    created_at: '',
    updated_at: ''
  }
];

export default function FacultyPage() {
  const { data: facultyList, isLoading } = useFetch<Faculty[]>(
    '/faculty',
    ['faculty_all']
  );

  const displayFaculty = useMemo(() => {
    if (facultyList !== undefined) {
      return [...facultyList].sort((a, b) => {
        const diff = (a.sort_order ?? 0) - (b.sort_order ?? 0);
        if (diff !== 0) return diff;
        return a.id - b.id;
      });
    }
    return FALLBACK_FACULTY;
  }, [facultyList]);

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero Banner */}
      <div className={styles.hero}>
        <div className="container">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Faculty', href: '/faculty' },
            ]}
          />
          <h1 className={styles.heroTitle}>Distinguished Faculty</h1>
          <p className={styles.heroSubtitle}>
            Our world-class researchers and experienced industry advisors guiding you toward analytical leadership.
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.grid}>
            {isLoading
              ? Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx} className={styles.facultyCard}>
                    <Skeleton height={260} />
                    <div className={styles.infoArea}>
                      <Skeleton height={24} className="mb-2" />
                      <Skeleton width={100} height={16} className="mb-2" />
                      <Skeleton height={60} />
                    </div>
                  </div>
                ))
              : displayFaculty.map((member) => (
                  <div key={member.id} className={styles.facultyCard}>
                    <div className={styles.imageWrapper}>
                      <ImageWithFallback
                        src={member.photo || ''}
                        fallbackSrc="/images/placeholder-faculty.jpg"
                        alt={member.name}
                        className={styles.image}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                    <div className={styles.infoArea}>
                      <h3 className={styles.name}>{member.name}</h3>
                      <p className={styles.designation}>{member.designation}</p>
                      <p className={styles.department}>{member.department}</p>
                      
                      <div className={styles.metaGrid}>
                        <div className={styles.metaItem}>
                          <span>Exp</span>
                          <strong>{member.experience_years} Years</strong>
                        </div>
                        <div className={styles.metaItem}>
                          <span>Publications</span>
                          <strong>{member.publications} Papers</strong>
                        </div>
                      </div>

                      <div className={styles.footer}>
                        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                          {member.linkedin_url && (
                            <a
                              href={member.linkedin_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.linkedin}
                            >
                              <SocialIcons platform="linkedin" size={14} />
                              LinkedIn
                            </a>
                          )}
                          {member.google_scholar && (
                            <a
                              href={member.google_scholar}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.linkedin}
                              style={{ color: '#C9A227' }}
                            >
                              <span style={{ fontSize: '11px', display: 'inline-flex', alignItems: 'center' }}>🎓</span>
                              Scholar
                            </a>
                          )}
                        </div>
                        <Link href={`/faculty/${member.slug}`} className="text-xs gold-gradient-text font-semibold">
                          Profile &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </section>
    </div>
  );
}
