import React from 'react';
import styles from '../admissions.module.css';
import { Breadcrumb, Button } from '@/components/ui';
import Link from 'next/link';

export const metadata = {
  title: 'Scholarships & Grants | Akal Business School',
  description: 'Understand Akal Business School scholarship policies, merit waivers, sports waivers, and financial aid structures.',
};

export default function ScholarshipsPage() {
  const scholarships = [
    {
      title: 'Merit-Based Scholarships',
      criteria: 'Offered to students scoring 90% or above in graduation (for MBA) or 10+2 (for BBA).',
      waiver: 'Up to 100% Tuition Fee Waiver'
    },
    {
      title: 'Need-Based Financial Assistance',
      criteria: 'Eligible for students belonging to families with an annual income below ₹2.5 LPA.',
      waiver: 'Up to 50% Tuition Fee Waiver'
    },
    {
      title: 'Sports and Extra-Curricular Waivers',
      criteria: 'Available for students who have represented their state or nation in recognized sports events.',
      waiver: 'Up to 75% Tuition Fee Waiver'
    },
    {
      title: 'Research Fellowships & Grants',
      criteria: 'Provided to PhD candidates and scholars co-authoring Scopus/FT50 index research publications.',
      waiver: '100% Tuition Fee Waiver + Monthly Stipend'
    }
  ];

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero Banner */}
      <div className={styles.hero}>
        <div className="container">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Admissions', href: '/admissions' },
              { label: 'Scholarships', href: '/admissions/scholarships' },
            ]}
          />
          <h1 className={styles.heroTitle}>Scholarships & Financial Aid</h1>
          <p className={styles.heroSubtitle}>
            Supporting deserving candidates to eliminate financial barriers to business leadership.
          </p>
        </div>
      </div>

      {/* Main Details */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.contentBlock}>
            <h2>Available Scholarship Schemes</h2>
            <p>
              Akal Business School believes in rewarding academic excellence and supporting students with genuine financial needs. Here is our structured scholarship parameter list:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', margin: 'var(--space-6) 0' }}>
              {scholarships.map((s, idx) => (
                <div key={idx} style={{
                  backgroundColor: 'var(--color-navy-mid)',
                  border: '1px solid var(--color-border)',
                  padding: 'var(--space-6)',
                  borderRadius: 'var(--radius-lg)'
                }}>
                  <h3 style={{ color: 'var(--color-gold)', fontSize: 'var(--text-lg)', fontFamily: 'var(--font-display)', marginBottom: 'var(--space-2)' }}>
                    {s.title}
                  </h3>
                  <p style={{ color: 'var(--color-off-white)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-3)' }}>
                    <strong>Eligibility:</strong> {s.criteria}
                  </p>
                  <div style={{
                    display: 'inline-block',
                    backgroundColor: 'rgba(201, 168, 76, 0.1)',
                    border: '1px solid var(--color-gold)',
                    color: 'var(--color-gold-light)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 'bold',
                    padding: 'var(--space-2) var(--space-4)',
                    borderRadius: 'var(--radius-pill)'
                  }}>
                    {s.waiver}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 'var(--space-8)' }}>
              <Link href="/admissions/apply" passHref legacyBehavior>
                <Button variant="primary" size="lg">Apply For Scholarship Now</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
