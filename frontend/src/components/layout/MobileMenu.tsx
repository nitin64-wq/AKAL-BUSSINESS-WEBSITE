'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { Button } from '@/components/ui';
import { useFetch } from '@/hooks/useFetch';
import clsx from 'clsx';
import styles from './MobileMenu.module.css';

const DEFAULT_MENU_ITEMS = [
  { label: 'Home', href: '/' },
  {
    label: 'About',
    href: '#',
    submenu: [
      { label: 'About Us', href: '/about' },
      { label: 'Founders', href: '/about/founders' },
      { label: "Chancellor's Message", href: '/about/chancellors-message' },
      { label: "Vice Chancellor's Message", href: '/about/vice-chancellors-message' },
      { label: 'The Kalgidhar Society', href: '/about/the-kalgidhar-society' },
      { label: "Director's Message", href: '/about/directors-message' },
      { label: 'Recognitions & Approvals', href: '/about/recognitions-approvals' },
      { label: 'Why ABS', href: '/about/why-abs' },
    ],
  },
  {
    label: 'Academics',
    href: '#',
    submenu: [
      { label: 'MBA in Business Analytics', href: '/academics/mba' },
      { label: 'BBA (4-year course)', href: '/academics/bba' },
      { label: 'PhD in Management', href: '/academics/phd' },
      { label: 'Faculty', href: '/faculty' },
    ],
  },
  {
    label: 'Admissions',
    href: '#',
    submenu: [
      { label: 'Fees Structure', href: '/admissions/fees' },
      { label: 'Scholarships', href: '/admissions/scholarships' },
      { label: 'How to Apply', href: '/admissions/apply' },
    ],
  },
  {
    label: 'Facilities',
    href: '#',
    submenu: [
      { label: 'Library', href: '/facilities/library' },
      { label: 'Hostels', href: '/facilities/hostels' },
    ],
  },
  {
    label: 'Campus Life',
    href: '#',
    submenu: [
      { label: 'Events', href: 'https://blog.auts.ac.in/category/campus-life/events/' },
      { label: 'Success Stories', href: 'https://blog.auts.ac.in/category/achievements/success-stories-achievements/' },
    ],
  },
  { label: 'Downloads', href: '/downloads' },
];

export const MobileMenu: React.FC = () => {
  const { isMobileMenuOpen, closeMobileMenu } = useUIStore();
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

  const { data: settings } = useFetch<Record<string, any>>(
    '/settings',
    ['settings_public']
  );

  const menuItems = settings?.site_navbar?.items || DEFAULT_MENU_ITEMS;

  const toggleSubmenu = (menu: string) => {
    if (activeSubmenu === menu) {
      setActiveSubmenu(null);
    } else {
      setActiveSubmenu(menu);
    }
  };

  const handleLinkClick = () => {
    closeMobileMenu();
    setActiveSubmenu(null);
  };

  return (
    <>
      {/* Background Overlay */}
      <div
        className={clsx(styles.overlay, isMobileMenuOpen && styles.overlayOpen)}
        onClick={handleLinkClick}
      />

      {/* Drawer */}
      <div
        className={clsx(styles.drawer, isMobileMenuOpen && styles.drawerOpen)}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img 
              src="/images/logo.png" 
              alt="Akal University Logo" 
              style={{ height: '32px', width: 'auto', objectFit: 'contain' }} 
            />
          </div>
          <button
            onClick={closeMobileMenu}
            className={styles.closeButton}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Links list */}
        <div className={styles.scrollArea}>
          <ul className={styles.menuList}>
            {menuItems.map((item: any) => {
              const hasSub = !!item.submenu;
              const isSubOpen = activeSubmenu === item.label;

              return (
                <li key={item.label} className={styles.menuItem}>
                  {hasSub ? (
                    <div>
                      <button
                        onClick={() => toggleSubmenu(item.label)}
                        className={styles.menuLink}
                      >
                        <span>{item.label}</span>
                        {isSubOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                      
                      {/* Accordion Content */}
                      {isSubOpen && (
                        <div className={styles.accordionContent}>
                          {item.submenu!.map((sub: any) =>
                            sub.href.startsWith('http') ? (
                              <a
                                key={sub.label}
                                href={sub.href}
                                onClick={handleLinkClick}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.subMenuLink}
                              >
                                {sub.label}
                              </a>
                            ) : (
                              <Link
                                key={sub.label}
                                href={sub.href}
                                onClick={handleLinkClick}
                                className={styles.subMenuLink}
                              >
                                {sub.label}
                              </Link>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={handleLinkClick}
                      className={styles.menuLink}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Drawer footer CTA */}
        <div className={styles.footer}>
          <Link href="/admissions/apply" onClick={handleLinkClick}>
            <Button variant="primary" fullWidth size="md">
              Apply Now
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
};
