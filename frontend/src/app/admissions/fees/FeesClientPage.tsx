'use client';

import React from 'react';
import styles from '../admissions.module.css';
import { Breadcrumb, Button, Skeleton } from '@/components/ui';
import Link from 'next/link';
import { useFetch } from '@/hooks/useFetch';
import type { Program } from '@/types';

export default function FeesClientPage() {
  // Fetch programs dynamically
  const { data: programs, isLoading } = useFetch<Program[]>(
    '/programs',
    ['programs_all']
  );

  const feeStructure = React.useMemo(() => {
    // Standard programs with their defaults
    const defaults = [
      { type: 'MBA', label: 'MBA in AI & Business Analytics', defaultFee: 100000, defaultSeats: 60 },
      { type: 'BBA', label: 'BBA (4-year course)', defaultFee: 100000, defaultSeats: 60 },
      { type: 'IMP', label: 'Integrated Management Program (IMP)', defaultFee: 100000, defaultSeats: 40 },
      { type: 'Doctoral', label: 'PhD in Management', defaultFee: 100000, defaultSeats: 10 }
    ];

    if (!programs || programs.length === 0) {
      return defaults.map(item => ({
        program: item.label,
        semester: `₹${(item.defaultFee / 2).toLocaleString('en-IN')}`,
        annual: `₹${item.defaultFee.toLocaleString('en-IN')}`,
        seats: `${item.defaultSeats} Seats`
      }));
    }

    return defaults.map(item => {
      // Find matching program from DB by type
      const dbProg = programs.find(p => p.type === item.type);
      const annualFee = dbProg?.fee_per_year ? Number(dbProg.fee_per_year) : item.defaultFee;
      const seats = dbProg?.seats ? Number(dbProg.seats) : item.defaultSeats;
      const title = dbProg?.title || item.label;

      return {
        program: title,
        semester: `₹${(annualFee / 2).toLocaleString('en-IN')}`,
        annual: `₹${annualFee.toLocaleString('en-IN')}`,
        seats: `${seats} Seats`
      };
    });
  }, [programs]);

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero Banner */}
      <div className={styles.hero}>
        <div className="container">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Admissions', href: '/admissions' },
              { label: 'Fee Structure', href: '/admissions/fees' },
            ]}
          />
          <h1 className={styles.heroTitle}>Program Fees & Structure</h1>
          <p className={styles.heroSubtitle}>
            A transparent overview of academic tuition fees, intake capacity, and payment methods at ABS.
          </p>
        </div>
      </div>

      {/* Main Details */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.contentBlock}>
            <h2>Approved Tuition Fee Rates (2026-2028 Session)</h2>
            <p>
              ABS offers affordable education packages to ensure quality analytics and management learning is accessible to rural and urban youth alike.
            </p>

            <div className={styles.tableWrapper}>
              <table className={styles.feesTable}>
                <thead>
                  <tr>
                    <th>Academic Program</th>
                    <th>Tuition Fee (Per Sem)</th>
                    <th>Annual Tuition Fee</th>
                    <th>Total Intake</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    Array.from({ length: 4 }).map((_, idx) => (
                      <tr key={idx}>
                        <td><Skeleton width={200} height={20} /></td>
                        <td><Skeleton width={80} height={20} /></td>
                        <td><Skeleton width={80} height={20} /></td>
                        <td><Skeleton width={80} height={20} /></td>
                      </tr>
                    ))
                  ) : (
                    feeStructure.map((row, idx) => (
                      <tr key={idx}>
                        <td><strong>{row.program}</strong></td>
                        <td>{row.semester}</td>
                        <td>{row.annual}</td>
                        <td>{row.seats}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <h2 style={{ marginTop: 'var(--space-10)' }}>Installments & Payment Plans</h2>
            <p>
              Tuition fees are payable in two equal installments at the beginning of each academic semester. ABS also provides financial installment concessions and merit waivers to eligible candidates.
            </p>

            <div style={{ marginTop: 'var(--space-8)', display: 'flex', gap: 'var(--space-4)' }}>
              <Link href="/admissions/scholarships" passHref legacyBehavior>
                <Button variant="primary" size="md">View Scholarship Concessions</Button>
              </Link>
              <Link href="/contact" passHref legacyBehavior>
                <Button variant="secondary" size="md">Contact Accounts Desk</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
