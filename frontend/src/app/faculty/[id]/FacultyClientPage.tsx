'use client';

import React from 'react';
import styles from '../faculty.module.css';
import { Breadcrumb, Button, Skeleton, SocialIcons } from '@/components/ui';
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

export default function FacultyClientPage({ params }: { params: { id: string } }) {
  const { data: member, isLoading, isError } = useFetch<Faculty>(
    `/faculty/${params.id}`,
    [`faculty_${params.id}`]
  );

  const fallbackMember = FALLBACK_FACULTY.find((f) => f.slug === params.id);
  const displayMember = member || (isError ? fallbackMember : null);

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', padding: 'var(--space-24) 0' }}>
        <div className="container">
          <Skeleton height={40} className="mb-4" />
          <Skeleton height={300} />
        </div>
      </div>
    );
  }

  if (!displayMember) {
    return (
      <div style={{ minHeight: '100vh', padding: 'var(--space-24) 0', textAlign: 'center' }}>
        <div className="container">
          <h1 className={styles.heroTitle}>Profile Not Found</h1>
          <p style={{ color: 'var(--color-muted)' }}>The requested faculty member details could not be found.</p>
          <Link href="/faculty" style={{ marginTop: 'var(--space-4)', display: 'inline-block' }}>
            <Button variant="primary" size="md">Back to Faculty</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero Banner */}
      <div className={styles.hero}>
        <div className="container">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Faculty', href: '/faculty' },
              { label: displayMember.name, href: `/faculty/${displayMember.slug}` },
            ]}
          />
          <h1 className={styles.heroTitle}>{displayMember.name}</h1>
          <p className={styles.heroSubtitle}>{displayMember.designation} • {displayMember.department}</p>
        </div>
      </div>

      {/* Main Details */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.profileGrid}>
            <div className={styles.profileImageArea}>
              <div className={styles.profileImageWrapper}>
                <ImageWithFallback
                  src={displayMember.photo || ''}
                  fallbackSrc="/images/placeholder-faculty.jpg"
                  alt={displayMember.name}
                  className={styles.image}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <h3 className={styles.profileName}>{displayMember.name}</h3>
              <p className={styles.profileDesignation}>{displayMember.designation}</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', textAlign: 'left', fontSize: 'var(--text-xs)' }}>
                {displayMember.email && (
                  <div>
                    <span style={{ color: 'var(--color-muted)' }}>Email:</span>{' '}
                    <strong style={{ color: '#1A1A2E' }}>{displayMember.email}</strong>
                  </div>
                )}
                <div>
                  <span style={{ color: 'var(--color-muted)' }}>Experience:</span>{' '}
                  <strong style={{ color: '#1A1A2E' }}>{displayMember.experience_years} Years</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--color-muted)' }}>Publications:</span>{' '}
                  <strong style={{ color: '#1A1A2E' }}>{displayMember.publications} Research Papers</strong>
                </div>
              </div>
            </div>

            <div className={styles.detailsArea}>
              <div>
                <h2>Biography</h2>
                <p>{displayMember.bio || 'Biography details are currently updating. Please check back later.'}</p>
              </div>

              <div>
                <h2>Academic Credentials</h2>
                <p>
                  <strong>Qualification:</strong> {displayMember.qualification || 'PhD / Masters'}<br />
                  <strong>Specialization:</strong> {displayMember.specialization || 'Management Analytics'}
                </p>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)', marginTop: 'var(--space-8)' }}>
                {displayMember.linkedin_url && (
                  <div>
                    <a
                      href={displayMember.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.linkedin}
                      style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gold)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <SocialIcons platform="linkedin" size={18} />
                      LinkedIn Profile
                    </a>
                  </div>
                )}
                {displayMember.google_scholar && (
                  <div>
                    <a
                      href={displayMember.google_scholar}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.linkedin}
                      style={{ fontSize: 'var(--text-sm)', color: '#C9A227', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <span style={{ fontSize: '1.2rem' }}>🎓</span>
                      Google Scholar
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
