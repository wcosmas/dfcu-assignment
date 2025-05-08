'use client';

import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

/**
 * Generic query hook for API calls
 */
export function useApiQuery<TData, TError = AxiosError>(
    queryKey: string | string[],
    queryFn: () => Promise<TData>,
    options: {
        enabled?: boolean;
        retry?: boolean | number;
        refetchOnWindowFocus?: boolean;
        staleTime?: number;
        cacheTime?: number;
        onSuccess?: (data: TData) => void;
        onError?: (error: TError) => void;
    } = {}
) {
    // Convert single string key to array
    const key = Array.isArray(queryKey) ? queryKey : [queryKey];

    return useQuery({
        queryKey: key,
        queryFn,
        ...options,
    });
} 