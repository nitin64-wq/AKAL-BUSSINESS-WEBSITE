/* ============================================================
   ABS — Admin Login Page
   Checks active sessions, handles user sign-in and handles logout parameters.
   ============================================================ */

'use client';

import React, { useEffect } from 'react'; // React or standard hooks
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import styles from './Login.module.css';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, logout, user, isAuthenticated, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Handle logout parameter and redirect if already authenticated
  useEffect(() => {
    const checkAuthStatus = async () => {
      const isLogout = searchParams.get('logout') === 'true';
      if (isLogout) {
        await logout();
        toast.success('Signed out successfully.');
        // Clean URL parameter
        router.replace('/admin/login');
        return;
      }

      if (isAuthenticated && user) {
        router.replace('/admin');
      }
    };
    checkAuthStatus();
  }, [searchParams, isAuthenticated, user, router, logout]);

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data.email, data.password);
      toast.success('Welcome back!');
      router.push('/admin');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Invalid email or password.';
      toast.error(message);
    }
  };

  return (
    <div className={styles.card}>
      <h1 className={styles.logo}>
        <span className={styles.logoGold}>ABS</span> Admin
      </h1>
      <p className={styles.subtitle}>Sign in to manage academic records and applications</p>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>Email Address</label>
          <input
            id="email"
            type="email"
            placeholder="director_abs@auts.ac.in"
            {...register('email')}
            className={styles.input}
          />
          {errors.email && <span className={styles.errorText}>{errors.email.message}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.label}>Password</label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            {...register('password')}
            className={styles.input}
          />
          {errors.password && <span className={styles.errorText}>{errors.password.message}</span>}
        </div>

        <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
          {isSubmitting ? (
            <>
              <div className={styles.spinner} />
              <span>Verifying...</span>
            </>
          ) : (
            <span>Sign In</span>
          )}
        </button>
      </form>
    </div>
  );
}

// Wrap in Suspense because of useSearchParams hook requirement in static Next.js compilation
export default function LoginPage() {
  return (
    <React.Suspense fallback={
      <div style={{ color: 'var(--color-gold)' }}>Loading auth portal...</div>
    }>
      <LoginContent />
    </React.Suspense>
  );
}
