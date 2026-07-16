'use client';

import React, { useEffect, useState } from 'react';
import { useUIStore } from '@/store/uiStore';
import { DatabaseZap, RefreshCw, WifiOff } from 'lucide-react';
import api from '@/lib/api';
import styles from './DbConnectionWarning.module.css';

export const DbConnectionWarning: React.FC = () => {
  const isDbDisconnected = useUIStore((state) => state.isDbDisconnected);
  const setDbDisconnected = useUIStore((state) => state.setDbDisconnected);
  const [retryCount, setRetryCount] = useState(0);
  const [checking, setChecking] = useState(false);

  // Periodically ping the health check endpoint if disconnected to detect recovery
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isDbDisconnected) {
      intervalId = setInterval(async () => {
        setChecking(true);
        try {
          const response = await api.get('/db-status');
          if (response.status === 200 && response.data.connected) {
            setDbDisconnected(false);
            setRetryCount(0);
            // Reload the page to re-fetch all data fresh
            window.location.reload();
          }
        } catch {
          setRetryCount((prev) => prev + 1);
        } finally {
          setChecking(false);
        }
      }, 5000); // Check every 5 seconds when offline
    } else {
      setRetryCount(0);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isDbDisconnected, setDbDisconnected]);

  if (!isDbDisconnected) {
    return null;
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.backdrop} />
      <div className={styles.card}>
        {/* Animated icon */}
        <div className={styles.iconContainer}>
          <div className={styles.iconRing} />
          <div className={styles.iconRing2} />
          <DatabaseZap size={40} className={styles.icon} />
        </div>

        {/* Main message */}
        <h2 className={styles.title}>Database Temporarily Unavailable</h2>
        <p className={styles.message}>
          We&apos;re unable to connect to the database right now. Please try again later.
        </p>

        {/* Status indicator */}
        <div className={styles.statusRow}>
          <WifiOff size={14} className={styles.statusIcon} />
          <span className={styles.statusText}>Connection lost</span>
          <span className={styles.statusDivider}>•</span>
          <RefreshCw size={14} className={`${styles.statusIcon} ${checking ? styles.spinning : ''}`} />
          <span className={styles.statusText}>
            {checking ? 'Checking...' : 'Auto-retrying every 5s'}
          </span>
        </div>

        {/* Retry counter */}
        {retryCount > 0 && (
          <p className={styles.retryCount}>
            Retry attempts: {retryCount}
          </p>
        )}

        {/* Progress bar animation */}
        <div className={styles.progressTrack}>
          <div className={styles.progressBar} />
        </div>
      </div>
    </div>
  );
};
