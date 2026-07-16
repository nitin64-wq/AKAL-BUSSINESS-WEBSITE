'use client';

import React, { useMemo } from 'react';
import { SectionHeader } from '@/components/ui';
import { useFetch } from '@/hooks/useFetch';
import { Landmark, GraduationCap, Globe, Award, Check } from 'lucide-react';
import styles from './GlobalLearning.module.css';

interface PartnerUniversity {
  id: number;
  name: string;
  description: string;
  logo_icon: string;
  sort_order: number;
  is_active: boolean;
}

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  Landmark,
  GraduationCap,
  Globe,
  Award,
};

const DEFAULT_BENEFITS = [
  'Academic credit transfers and semester abroad opportunities',
  'Joint research publication pathways in Scopus/FT50 indexed journals',
  'Interactive masterclasses led by distinguished international professors',
  'Collaborative student capstones addressing global business analytics cases',
];

export const GlobalLearning: React.FC = () => {
  const { data: dbUniversities } = useFetch<PartnerUniversity[]>(
    '/partner-universities',
    ['partner_universities_public']
  );

  const { data: settings } = useFetch<Record<string, any>>(
    '/settings',
    ['settings_public']
  );

  // Read editable content from settings
  const content = settings?.section_global_learning_content || {};
  const sectionTitle = content.title || 'Global Learning Ecosystem';
  const sectionSubtitle = content.subtitle || 'International Partnerships';
  const sectionDescription = content.description || 'ABS breaks geographic barriers. Through active collaborations with premier universities in the United States, our students gain exposure to international business paradigms and world-class researcher insights.';
  const benefits = content.benefits || DEFAULT_BENEFITS;

  const universities = useMemo(() => {
    if (dbUniversities && dbUniversities.length > 0) {
      return dbUniversities;
    }
    return [];
  }, [dbUniversities]);

  if (universities.length === 0) {
    return null;
  }

  return (
    <section className={`${styles.section} sectionLight`}>
      <div className="container">
        <div className={styles.grid}>
          {/* Left Column (University Cards) */}
          <div className={styles.cardGrid}>
            {universities.map((uni) => {
              const IconComponent = ICON_MAP[uni.logo_icon] || Landmark;
              return (
                <div key={uni.id} className={styles.uniCard}>
                  <div className={styles.logoArea}>
                    <IconComponent size={24} />
                  </div>
                  <h4 className={styles.uniName}>{uni.name}</h4>
                  <p className={styles.uniDesc}>{uni.description}</p>
                </div>
              );
            })}
          </div>

          {/* Right Column (Info & Benefits) */}
          <div className={styles.benefitsCol}>
            <SectionHeader
              title={sectionTitle}
              subtitle={sectionSubtitle}
              align="left"
              theme="light"
              description={sectionDescription}
            />

            <div className={styles.benefitsList}>
              {benefits.map((benefit: string, idx: number) => (
                <div key={idx} className={styles.benefitItem}>
                  <div className={styles.benefitIcon}>
                    <Check size={16} />
                  </div>
                  <span className={styles.benefitText}>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
