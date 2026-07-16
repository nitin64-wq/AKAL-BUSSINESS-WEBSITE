'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '70vh',
      textAlign: 'center',
      padding: '2rem',
      backgroundColor: '#FFFFFF',
      color: '#1A1A2E'
    }}>
      <h1 style={{
        fontSize: '6rem',
        fontWeight: 'bold',
        margin: '0',
        color: '#C9A227',
        lineHeight: '1'
      }}>
        404
      </h1>
      <h2 style={{
        fontSize: '1.8rem',
        fontWeight: '600',
        marginTop: '1rem',
        marginBottom: '1.5rem',
        color: '#1A1A2E'
      }}>
        Page Not Found
      </h2>
      <p style={{
        fontSize: '1rem',
        color: '#555B6E',
        maxWidth: '500px',
        marginBottom: '2rem',
        lineHeight: '1.6'
      }}>
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link href="/" style={{
        backgroundColor: '#C9A227',
        color: '#FFFFFF',
        padding: '0.75rem 2rem',
        borderRadius: '4px',
        fontWeight: '600',
        textDecoration: 'none',
        transition: 'background-color 0.2s ease',
      }}>
        Go Back Home
      </Link>
    </div>
  );
}
