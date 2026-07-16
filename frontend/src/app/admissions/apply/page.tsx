import React from 'react';
import styles from '../admissions.module.css';
import { Breadcrumb } from '@/components/ui';
import { ApplicationForm } from '@/components/forms/ApplicationForm';

export const metadata = {
  title: 'Apply Online | Akal Business School',
  description: 'Submit your student application online for Akal Business School (ABS) flagship MBA in AI & Business Analytics, BBA, or PhD.',
};

export default function ApplyPage() {
  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero Banner */}
      <div className={styles.hero}>
        <div className="container">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Admissions', href: '/admissions' },
              { label: 'Apply Online', href: '/admissions/apply' },
            ]}
          />
          <h1 className={styles.heroTitle}>Admissions Application Form</h1>
          <p className={styles.heroSubtitle}>
            Admissions Session 2026-2028. Fill out the application form below to start your management career.
          </p>
        </div>
      </div>

      {/* Form Container */}
      <section className={styles.section}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <ApplicationForm />
        </div>
      </section>
    </div>
  );
}
