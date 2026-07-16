'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { Button } from '@/components/ui';
import { useFetch } from '@/hooks/useFetch';
import clsx from 'clsx';
import styles from './Navbar.module.css';

const DEFAULT_NAV_LINKS = [
  { label: 'Home', href: '/' },
  {
    label: 'About',
    href: '/about',
    submenu: [
      { label: 'About Us', href: '/about' },
      { label: 'Founders', href: '/about/founders' },
      { label: "Chancellor's Message", href: '/about/chancellors-message' },
      { label: "Vice Chancellor's Message", href: '/about/vice-chancellors-message' },
      { label: 'The Kalgidhar Society', href: '/about/the-kalgidhar-society' },
      { label: "Director's Message", href: '/about/directors-message' },
      { label: 'Recognitions & Approvals', href: '/about/recognitions-approvals' },
      { label: 'Vision & Mission', href: '/about/vision-mission' },
      { label: 'Why ABS', href: '/about/why-abs' },
    ],
  },
  {
    label: 'Academics',
    href: '/academics',
    submenu: [
      { label: 'MBA in Business Analytics', href: '/academics/mba' },
      { label: 'BBA (4-year course)', href: '/academics/bba' },
      { label: 'PhD in Management', href: '/academics/phd' },
      { label: 'Faculty', href: '/faculty' },
    ],
  },
  {
    label: 'Admissions',
    href: '/admissions',
    submenu: [
      { label: 'Fees Structure', href: '/admissions/fees' },
      { label: 'Scholarships', href: '/admissions/scholarships' },
      { label: 'How to Apply', href: '/admissions/apply' },
    ],
  },
  {
    label: 'Facilities',
    href: '/facilities',
    submenu: [
      { label: 'Library', href: '/facilities/library' },
      { label: 'Hostels', href: '/facilities/hostels' },
    ],
  },
  {
    label: 'Campus Life',
    href: '/campus-life',
    submenu: [
      { label: 'Events', href: 'https://blog.auts.ac.in/category/campus-life/events/' },
      { label: 'Success Stories', href: 'https://blog.auts.ac.in/category/achievements/success-stories-achievements/' },
    ],
  },
  { label: 'Placements', href: '/placements' },
  { label: 'Downloads', href: '/downloads' },
];

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { isMobileMenuOpen, toggleMobileMenu } = useUIStore();
  const [scrolled, setScrolled] = useState(false);

  const { data: settings } = useFetch<Record<string, any>>(
    '/settings',
    ['settings_public']
  );

  const navLinks = settings?.site_navbar?.items || DEFAULT_NAV_LINKS;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav
      className={clsx(
        styles.navbar,
        scrolled && styles.scrolled
      )}
    >
      <div className={`container ${styles.container}`}>
        <Link href="/" className={styles.logo} style={{ display: 'flex', alignItems: 'center' }}>
          <img 
            src="/images/logo.png" 
            alt="Akal University Logo" 
            style={{ height: '40px', width: 'auto', objectFit: 'contain' }} 
          />
        </Link>

        {/* Center Links (Desktop) */}
        <div className={styles.navLinks}>
          {navLinks.map((link: any) => {
            const hasSubmenu = !!link.submenu;
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/');

            return (
              <div key={link.label} className={styles.navLinkWrapper}>
                {hasSubmenu ? (
                  <button
                    className={clsx(styles.navLink, isActive && styles.navLinkActive)}
                  >
                    {link.label} <ChevronDown size={14} />
                  </button>
                ) : (
                  <Link
                    href={link.href}
                    className={clsx(styles.navLink, isActive && styles.navLinkActive)}
                  >
                    {link.label}
                  </Link>
                )}

                {/* Submenu Dropdown */}
                {hasSubmenu && (
                  <div className={styles.dropdown}>
                    {link.submenu!.map((sub: any) =>
                      sub.href.startsWith('http') ? (
                        <a
                          key={sub.label}
                          href={sub.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.dropdownItem}
                        >
                          {sub.label}
                        </a>
                      ) : (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          className={styles.dropdownItem}
                        >
                          {sub.label}
                        </Link>
                      )
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Apply CTA (Desktop) */}
        <div className={styles.actions}>
          <Link href="/admissions/apply">
            <Button variant="primary" size="sm">
              Apply Now
            </Button>
          </Link>
        </div>

        {/* Hamburger (Mobile) */}
        <button
          onClick={toggleMobileMenu}
          className={styles.mobileTrigger}
          aria-label={isMobileMenuOpen ? 'Close Menu' : 'Open Menu'}
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </nav>
  );
};
