'use client';

import React from 'react';
import clsx from 'clsx';
import styles from './SectionHeader.module.css';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  align?: 'center' | 'left';
  theme?: 'dark' | 'light';
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  description,
  align = 'center',
  theme = 'dark',
  className = '',
}) => {
  return (
    <div
      className={clsx(
        styles.header,
        align === 'left' && styles.leftAlign,
        theme === 'light' && styles.light,
        className
      )}
    >
      {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.underline} />
      {description && <p className={styles.description}>{description}</p>}
    </div>
  );
};
