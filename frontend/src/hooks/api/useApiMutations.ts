'use client';

import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

/**
 * Configuration options for toast notifications
 */
export interface ToastOptions {
    /** Whether to show success toast */
    successToast?: boolean;
    /** Success toast title */
    successTitle?: string;
    /** Success toast message */
    successMessage?: string;
    /** Whether to show error toast */
    errorToast?: boolean;
    /** Error toast title */
    errorTitle?: string;
    /** Custom error message (if not provided, will use the error response message) */
    errorMessage?: string;
}

/**
 * Generic mutation hook for API calls with toast notifications
 */
export function useApiMutation<TData, TVariables, TError = AxiosError>(
    mutationFn: (variables: TVariables) => Promise<TData>,
    options?: UseMutationOptions<TData, TError, TVariables>,
    invalidateQueries?: string[],
    toastOptions?: ToastOptions
) {
    const queryClient = useQueryClient();
    const defaultToastOptions: ToastOptions = {
        successToast: false,
        errorToast: false,
        ...toastOptions,
    };

    return useMutation<TData, TError, TVariables>({
        mutationFn,
        ...options,
        onSuccess: async (data, variables, context) => {
            // Invalidate relevant queries if specified
            if (invalidateQueries?.length) {
                await Promise.all(
                    invalidateQueries.map((query) => queryClient.invalidateQueries({ queryKey: [query] }))
                );
            }

            // Show success toast if enabled
            if (defaultToastOptions.successToast) {
                toast.success(
                    defaultToastOptions.successTitle || 'Success',
                    {
                        description: defaultToastOptions.successMessage || 'Operation completed successfully',
                    }
                );
            }

            // Call original onSuccess if provided
            if (options?.onSuccess) {
                options.onSuccess(data, variables, context);
            }
        },
        onError: (error, variables, context) => {
            // Show error toast if enabled
            if (defaultToastOptions.errorToast) {
                let errorMessage = defaultToastOptions.errorMessage || 'An error occurred. Please try again.';

                // Try to extract message from Axios error
                if (error instanceof AxiosError && error.response?.data) {
                    // Safely access the message property if it exists
                    const responseData = error.response.data as Record<string, unknown>;
                    if (responseData.message && typeof responseData.message === 'string') {
                        errorMessage = responseData.message;
                    }
                }

                toast.error(
                    defaultToastOptions.errorTitle || 'Error',
                    {
                        description: errorMessage,
                    }
                );
            }

            // Call original onError if provided
            if (options?.onError) {
                options.onError(error, variables, context);
            }
        },
    });
} 