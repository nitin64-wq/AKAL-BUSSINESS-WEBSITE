'use client';

import React, { useEffect, useState } from 'react';
import { SectionHeader, AnimatedCounter } from '@/components/ui';
import { contactService } from '@/services/contactService';
import { useFetch } from '@/hooks/useFetch';
import styles from './ImpactNumbers.module.css';

export const ImpactNumbers: React.FC = () => {
  const [stats, setStats] = useState<{
    highest_package: number;
    average_package: number;
    alumni_count: number;
    corporate_recruiters: number;
  } | null>(null);

  const { data: settings, isLoading } = useFetch<Record<string, any>>(
    '/settings',
    ['settings_public']
  );

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await contactService.getSettingsPublic();
        if (response.status === 'success') {
          const data = response.data;
          setStats({
            highest_package: parseFloat(data.highest_package) || 0,
            average_package: parseFloat(data.average_package) || 0,
            alumni_count: parseInt(data.alumni_count) || 0,
            corporate_recruiters: parseInt(data.corporate_recruiters) || 0,
          });
        }
      } catch (err) {
        console.error(err);
        // Stats remain null — section will not render
      }
    };
    fetchSettings();
  }, []);

  // Don't render if settings or stats haven't loaded (DB offline)
  if (isLoading || !settings || !stats) {
    return null;
  }

  // Read editable content from settings
  const content = settings.section_impact_numbers_content || {};
  const sectionTitle = content.title || 'ABS By The Numbers';
  const sectionSubtitle = content.subtitle || 'Impact & Statistics';
  const sectionDescription = content.description || 'Proven record of academic success, high placements, and strong corporate tie-ups.';
  const editableItems = content.items || [
    { label: 'Highest Package', desc: 'Top compensation package secured by our MBA Analytics candidates.' },
    { label: 'Average Package', desc: 'Mean annual compensation across placed MBA and BBA graduates.' },
    { label: 'Alumni Network', desc: 'ABS graduates leading analytics and commerce in Fortune 500 firms.' },
    { label: 'Corporate Recruiters', desc: 'Top analytics, consulting, and tech firms visiting our campus.' },
  ];

  const items = [
    {
      value: stats.highest_package,
      decimals: 1,
      prefix: '₹',
      suffix: ' LPA',
      label: editableItems[0]?.label || 'Highest Package',
      desc: editableItems[0]?.desc || '',
    },
    {
      value: stats.average_package,
      decimals: 1,
      prefix: '₹',
      suffix: ' LPA',
      label: editableItems[1]?.label || 'Average Package',
      desc: editableItems[1]?.desc || '',
    },
    {
      value: stats.alumni_count,
      decimals: 0,
      suffix: '+',
      label: editableItems[2]?.label || 'Alumni Network',
      desc: editableItems[2]?.desc || '',
    },
    {
      value: stats.corporate_recruiters,
      decimals: 0,
      suffix: '+',
      label: editableItems[3]?.label || 'Corporate Recruiters',
      desc: editableItems[3]?.desc || '',
    },
  ];

  return (
    <section className={`${styles.section} darkSection`}>
      <div className="container">
        <SectionHeader
          title={sectionTitle}
          subtitle={sectionSubtitle}
          description={sectionDescription}
        />

        <div className={styles.grid}>
          {items.map((item, idx) => (
            <div key={idx} className={styles.card}>
              <div className={styles.num}>
                <AnimatedCounter
                  end={item.value}
                  decimals={item.decimals}
                  prefix={item.prefix}
                  suffix={item.suffix}
                />
              </div>
              <h3 className={styles.label}>{item.label}</h3>
              <p className={styles.desc}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
