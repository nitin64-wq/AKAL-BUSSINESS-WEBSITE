'use client';

import React from 'react';
import clsx from 'clsx';
import styles from './Skeleton.module.css';

interface SkeletonProps {
  className?: string;
  variant?: 'rect' | 'circle';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rect',
  width,
  height,
}) => {
  return (
    <span
      className={clsx(
        styles.skeleton,
        variant === 'circle' && styles.circle,
        className
      )}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    />
  );
};
