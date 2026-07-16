/* ============================================================
   ABS — Utility Functions
   clsx helper, formatters, and common utilities.
   ============================================================ */

import clsx, { type ClassValue } from 'clsx';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

/**
 * Merges class names conditionally using clsx.
 * Since we use CSS Modules (not Tailwind), we don't need tailwind-merge.
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

/**
 * Format a date string to a readable format.
 */
export function formatDate(date: string | Date, format: string = 'DD MMM YYYY'): string {
  return dayjs(date).format(format);
}

/**
 * Get relative time from now (e.g., "2 hours ago").
 */
export function timeAgo(date: string | Date): string {
  return dayjs(date).fromNow();
}

/**
 * Format currency in Indian Rupee format.
 */
export function formatCurrency(amount: number, decimals: number = 0): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}

/**
 * Format a number with commas (Indian format).
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-IN').format(num);
}

/**
 * Truncate text to a specified length with ellipsis.
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Generate a slug from a string.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Get initials from a name (e.g., "John Doe" → "JD").
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Capitalize first letter of each word.
 */
export function capitalize(text: string): string {
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Check if we're running on the client side.
 */
export function isClient(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Debounce a function call.
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Get the full image URL from a relative path.
 */
export function getImageUrl(path: string | null | undefined): string {
  if (!path) return '/images/placeholder.jpg';
  if (path.startsWith('http') || path.startsWith('/images/')) return path;
  
  // Replaces trailing /api or /api/v1 to get backend base url (e.g. http://localhost:8000)
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api(\/v\d+)?$/, '') || 'http://localhost:8000';
  
  let cleanPath = path;
  if (cleanPath.startsWith('/storage/')) {
    cleanPath = cleanPath.substring(9);
  } else if (cleanPath.startsWith('storage/')) {
    cleanPath = cleanPath.substring(8);
  }
  
  return `${baseUrl}/storage/${cleanPath}`;
}

/**
 * Generate application number format: ABS-YYYY-XXXXX
 */
export function formatApplicationNo(no: string): string {
  return no.toUpperCase();
}

/**
 * Get status badge color class
 */
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    'Pending': 'warning',
    'Under Review': 'info',
    'Shortlisted': 'info',
    'Accepted': 'success',
    'Rejected': 'error',
    'Waitlist': 'warning',
  };
  return colors[status] || 'muted';
}
