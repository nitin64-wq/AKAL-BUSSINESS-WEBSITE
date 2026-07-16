'use client';

import React from 'react';
import styles from '../other-pages.module.css';
import { Breadcrumb } from '@/components/ui';
import { ContactForm } from '@/components/forms/ContactForm';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { useFetch } from '@/hooks/useFetch';

const DEFAULTS = {
  hero_title: 'Contact ABS',
  hero_subtitle: 'Have questions about admissions, fees, or curriculum? Our support desk and counselors are ready to help.',
  form_title: 'Admissions & General Inquiry',
  form_subtitle: 'Fill out the contact form, and our representative will call you back within 24 business hours.',
  address_title: 'Campus Address',
  address: 'Akal Business School, Baru Sahib, Via Rajgarh, Distt. Sirmour, Himachal Pradesh - 173101',
  phone_title: 'Phone Numbers',
  phones: 'Admissions: +91-175-2391234\nGeneral Inquiry: +91-XXXXX-XXXXX',
  email_title: 'Email Addresses',
  emails: 'Admissions Desk: director_abs@auts.ac.in\nUniversity Office: info@auts.ac.in',
  hours_title: 'Office Hours',
  hours: 'Monday - Saturday: 9:00 AM to 5:00 PM\nSunday: Closed',
};

export default function ContactPage() {
  const { data: settings } = useFetch<Record<string, any>>('/settings', ['settings_public']);
  const d = settings?.page_contact || DEFAULTS;
  const g = (key: string) => d[key] ?? (DEFAULTS as any)[key];

  // Helper to split multi-line strings into paragraphs/spans
  const renderLines = (text: string) => {
    return text.split('\n').map((line, idx) => (
      <React.Fragment key={idx}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero Banner */}
      <div className={styles.hero}>
        <div className="container">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Contact Us', href: '/contact' },
            ]}
          />
          <h1 className={styles.heroTitle}>{g('hero_title')}</h1>
          <p className={styles.heroSubtitle}>{g('hero_subtitle')}</p>
        </div>
      </div>

      {/* Main Grid */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.contactGrid}>
            <div className={styles.contactInfoCard}>
              <h2 style={{ color: 'var(--color-white)', fontSize: 'var(--text-xl)', fontFamily: 'var(--font-display)', marginBottom: 'var(--space-2)' }}>
                {g('form_title')}
              </h2>
              <p style={{ color: 'var(--color-muted)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-6)' }}>
                {g('form_subtitle')}
              </p>

              <ContactForm />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              {/* Address */}
              <div className={styles.contactItem} style={{
                background: 'var(--gradient-card)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-6)'
              }}>
                <MapPin className={styles.contactIcon} size={24} />
                <div className={styles.contactText}>
                  <h4>{g('address_title')}</h4>
                  <p>{g('address')}</p>
                </div>
              </div>

              {/* Phone */}
              <div className={styles.contactItem} style={{
                background: 'var(--gradient-card)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-6)'
              }}>
                <Phone className={styles.contactIcon} size={24} />
                <div className={styles.contactText}>
                  <h4>{g('phone_title')}</h4>
                  <p>{renderLines(g('phones'))}</p>
                </div>
              </div>

              {/* Email */}
              <div className={styles.contactItem} style={{
                background: 'var(--gradient-card)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-6)'
              }}>
                <Mail className={styles.contactIcon} size={24} />
                <div className={styles.contactText}>
                  <h4>{g('email_title')}</h4>
                  <p>{renderLines(g('emails'))}</p>
                </div>
              </div>

              {/* Office Hours */}
              <div className={styles.contactItem} style={{
                background: 'var(--gradient-card)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-6)'
              }}>
                <Clock className={styles.contactIcon} size={24} />
                <div className={styles.contactText}>
                  <h4>{g('hours_title')}</h4>
                  <p>{renderLines(g('hours'))}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
