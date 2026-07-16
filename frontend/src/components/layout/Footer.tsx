'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Phone,
  Mail,
  MapPin,
  Send,
} from 'lucide-react';
import { Facebook, Instagram, Linkedin, Youtube } from '@/components/ui';
import { contactService } from '@/services/contactService';
import { Button } from '@/components/ui';
import { useFetch } from '@/hooks/useFetch';
import toast from 'react-hot-toast';
import styles from './Footer.module.css';


const SOCIAL_ICONS: Record<string, React.FC<{ size?: number }>> = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
};

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const { data: settings } = useFetch<Record<string, any>>(
    '/settings',
    ['settings_public']
  );

  const footerData = settings?.site_footer || {};
  const brandDescription = footerData.brand_description || (settings ? 'Transforming future business leaders through rigorous business analytics, advanced AI management programs, distinguished faculty guidance, and global academic partnerships.' : '');
  const socialLinks = footerData.social_links || [];
  const address = footerData.address || '';
  const phones = footerData.phones || '';
  const emailVal = footerData.email || '';

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      await contactService.submitNewsletter({ email });
      toast.success('Successfully subscribed to our newsletter!');
      setEmail('');
    } catch (err) {
      console.error(err);
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          {/* Brand Info */}
          <div className={styles.brandCol}>
            <div className={styles.logo} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img 
                src="/images/logo.png" 
                alt="Akal University Logo" 
                style={{ height: '44px', width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} 
              />
              <div style={{ height: '28px', width: '1px', backgroundColor: 'rgba(255, 255, 255, 0.15)' }} />
              <span>
                AKAL <span className={styles.logoGold}>BUSINESS SCHOOL</span>
              </span>
            </div>
            <p className={styles.desc}>
              {brandDescription}
            </p>
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
                    <IconComponent size={16} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* About Links */}
          <div>
            <h3 className={styles.title}>About</h3>
            <ul className={styles.links}>
              <li>
                <Link href="/about" className={styles.link}>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/about/founders" className={styles.link}>
                  Founders
                </Link>
              </li>
              <li>
                <Link href="/about/chancellors-message" className={styles.link}>
                  Chancellor&apos;s Message
                </Link>
              </li>
              <li>
                <Link href="/about/vice-chancellors-message" className={styles.link}>
                  Vice Chancellor&apos;s Message
                </Link>
              </li>
              <li>
                <Link href="/about/directors-message" className={styles.link}>
                  Director&apos;s Message
                </Link>
              </li>
              <li>
                <Link href="/about/why-abs" className={styles.link}>
                  Why ABS
                </Link>
              </li>
            </ul>
          </div>

          {/* Academics & Facilities Links */}
          <div>
            <h3 className={styles.title}>Academics &amp; Facilities</h3>
            <ul className={styles.links}>
              <li>
                <Link href="/academics/mba" className={styles.link}>
                  MBA in Business Analytics
                </Link>
              </li>
              <li>
                <Link href="/academics/bba" className={styles.link}>
                  BBA
                </Link>
              </li>
              <li>
                <Link href="/faculty" className={styles.link}>
                  Faculty
                </Link>
              </li>
              <li>
                <Link href="/facilities/library" className={styles.link}>
                  Library
                </Link>
              </li>
              <li>
                <Link href="/facilities/hostels" className={styles.link}>
                  Hostels
                </Link>
              </li>
            </ul>
          </div>

          {/* Admissions Links */}
          <div>
            <h3 className={styles.title}>Admissions</h3>
            <ul className={styles.links}>
              <li>
                <Link href="/admissions/fees" className={styles.link}>
                  Fees Structure
                </Link>
              </li>
              <li>
                <Link href="/admissions/scholarships" className={styles.link}>
                  Scholarships
                </Link>
              </li>
              <li>
                <Link href="/admissions/apply" className={styles.link}>
                  How to Apply
                </Link>
              </li>
              <li>
                <Link href="/downloads" className={styles.link}>
                  Downloads
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className={styles.title}>Contact Us</h3>
            <div className={styles.contactList}>
              {address && (
              <div className={styles.contactItem}>
                <MapPin size={18} className={styles.contactIcon} />
                <span>{address}</span>
              </div>
              )}
              {phones && (
              <div className={styles.contactItem}>
                <Phone size={16} className={styles.contactIcon} />
                <span>{phones}</span>
              </div>
              )}
              {emailVal && (
              <div className={styles.contactItem}>
                <Mail size={16} className={styles.contactIcon} />
                <span style={{ wordBreak: 'break-all' }}>{emailVal}</span>
              </div>
              )}
            </div>

            {/* Newsletter */}
            <div className={styles.newsletter}>
              <div style={{ color: 'var(--color-white)', fontSize: '12px', fontWeight: 'bold' }}>
                SUBSCRIBE TO NEWSLETTER
              </div>
              <form onSubmit={handleSubscribe} className={styles.newsletterForm}>
                <input
                  type="email"
                  placeholder="Enter email..."
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.newsletterInput}
                />
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={loading}
                  className={styles.newsletterButton}
                  style={{ width: '40px', padding: 0 }}
                  aria-label="Subscribe"
                >
                  <Send size={14} />
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottom}>
          <div className={styles.copyright}>
            © {new Date().getFullYear()} Akal Business School. All Rights Reserved.
          </div>
          <div className={styles.bottomLinks}>
            <Link href="/privacy" className={styles.link}>
              Privacy Policy
            </Link>
            <Link href="/terms" className={styles.link}>
              Terms of Use
            </Link>
            <Link href="/contact" className={styles.link}>
              Site Feedback
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
