'use client';

import React from 'react';
import clsx from 'clsx';
import styles from './Badge.module.css';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'gold' | 'navy' | 'success' | 'error' | 'warning';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'gold',
  ...props
}) => {
  return (
    <span className={clsx(styles.badge, styles[variant], className)} {...props}>
      {children}
    </span>
  );
};
