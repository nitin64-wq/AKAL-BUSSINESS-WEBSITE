/* ============================================================
   ABS — Public Layout Wrapper
   Conditionally renders top bar, navbar, mobile menu, and footer 
   only for public facing routes. Admin routes are rendered without them.
   ============================================================ */

'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { TopBar } from './TopBar';
import { Navbar } from './Navbar';
import { MobileMenu } from './MobileMenu';
import { Footer } from './Footer';
import { AnnouncementBar } from './AnnouncementBar';
import { DbConnectionWarning } from './DbConnectionWarning';

interface PublicLayoutWrapperProps {
  children: React.ReactNode;
}

export function PublicLayoutWrapper({ children }: PublicLayoutWrapperProps) {
  const pathname = usePathname();
  const isAdmin = pathname === '/admin' || pathname?.startsWith('/admin/');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <DbConnectionWarning />
      <AnnouncementBar />
      <TopBar />
      <Navbar />
      <MobileMenu />
      <main style={{ flex: '1 0 auto', paddingTop: '70px' }}>{children}</main>
      <Footer />
    </div>
  );
}
