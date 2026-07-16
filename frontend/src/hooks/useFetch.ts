/* ============================================================
   ABS — useFetch Hook
   React Query wrapper for typed data fetching.
   ============================================================ */

'use client';

import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import api from '@/lib/api';

interface UseFetchOptions<T> extends Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'> {
  params?: Record<string, string | number | boolean | undefined>;
}

/**
 * Generic data fetching hook using React Query + Axios.
 * 
 * @example
 * const { data, isLoading } = useFetch<Program[]>('/programs', ['programs']);
 */
export function useFetch<T>(
  url: string,
  queryKey: string[],
  options?: UseFetchOptions<T>
) {
  const { params, ...queryOptions } = options || {};

  return useQuery<T>({
    queryKey: [...queryKey, params],
    queryFn: async () => {
      const response = await api.get(url, { params });
      return response.data.data ?? response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...queryOptions,
  });
}
