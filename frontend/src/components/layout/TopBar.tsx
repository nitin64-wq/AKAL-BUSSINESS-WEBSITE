'use client';

import React from 'react';
import { Phone, Mail } from 'lucide-react';
import { Facebook, Instagram, Linkedin, Youtube } from '@/components/ui';
import { useFetch } from '@/hooks/useFetch';
import styles from './TopBar.module.css';

const DEFAULT_SOCIALS = [
  { platform: 'facebook', url: 'https://www.facebook.com/AkalBusinessSchool' },
  { platform: 'instagram', url: 'https://www.instagram.com/akalbusinessschool' },
  { platform: 'linkedin', url: 'https://www.linkedin.com/school/akal-business-school' },
  { platform: 'youtube', url: 'https://www.youtube.com/AkalBusinessSchool' },
];

const SOCIAL_ICONS: Record<string, React.FC<{ size?: number }>> = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
};

export const TopBar: React.FC = () => {
  const { data: settings } = useFetch<Record<string, any>>(
    '/settings',
    ['settings_public']
  );

  const topbarData = settings?.site_topbar || {};
  const phone = topbarData.phone || '+91-175-2391234';
  const phoneHref = topbarData.phone_href || 'tel:+911752391234';
  const email = topbarData.email || 'director_abs@auts.ac.in';
  const emailHref = topbarData.email_href || 'mailto:director_abs@auts.ac.in';
  const socialLinks = topbarData.social_links || DEFAULT_SOCIALS;

  return (
    <div className={styles.topBar}>
      <div className={`container ${styles.container}`}>
        {/* Social Icons (Left) */}
        <div className={styles.socials}>
          {socialLinks.map((link: any, idx: number) => {
            const IconComponent = SOCIAL_ICONS[link.platform?.toLowerCase()];
            if (!IconComponent) return null;
            return (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label={link.platform}
              >
                <IconComponent size={14} />
              </a>
            );
          })}
        </div>

        {/* Contact Info (Right) */}
        <div className={styles.contactInfo}>
          <a href={phoneHref} className={styles.contactItem}>
            <Phone size={12} />
            <span>{phone}</span>
          </a>
          <a href={emailHref} className={styles.contactItem}>
            <Mail size={12} />
            <span>{email}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
