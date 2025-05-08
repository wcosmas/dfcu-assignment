'use client';

import { useCallback } from 'react';
import { paymentApi } from '@/api/payment';
import { PaymentRequest, PaymentResponse, PaymentStatus } from '@/types';
import { useApiMutation } from './useApiMutations';
import { useApiQuery } from './useApiQueries';
import { QUERY_KEYS } from '@/lib/query-keys';
import { toast } from 'sonner';

// Separate hook for checking payment status
export function useCheckPaymentStatus(transactionReference: string) {
    const {
        data: statusResult,
        isLoading: isCheckingStatus,
        error: checkStatusError,
        refetch,
    } = useApiQuery<PaymentStatus>(
        QUERY_KEYS.PAYMENT.STATUS(transactionReference),
        () => paymentApi.checkPaymentStatus(transactionReference),
        {
            enabled: !!transactionReference,
            // Don't refetch automatically, allow manual polling
            refetchOnWindowFocus: false,
            staleTime: 0,
        }
    );

    // Enhanced refetch with toast
    const refetchWithToast = async () => {
        const refreshToast = toast.loading('Checking payment status...');
        try {
            const result = await refetch();

            // Show different toast based on payment status
            if (result.data?.status === 'SUCCESSFUL') {
                toast.success('Payment Successful', {
                    id: refreshToast,
                    description: 'Your payment has been successfully processed.',
                });
            } else if (result.data?.status === 'PENDING') {
                toast.info('Payment Pending', {
                    id: refreshToast,
                    description: 'Your payment is still being processed.',
                });
            } else if (result.data?.status === 'FAILED') {
                toast.error('Payment Failed', {
                    id: refreshToast,
                    description: result.data.message || 'Your payment could not be processed.',
                });
            } else {
                toast.success('Status Updated', {
                    id: refreshToast,
                    description: 'Payment status has been updated.',
                });
            }

            return result;
        } catch (error) {
            toast.error('Status Check Failed', {
                id: refreshToast,
                description: 'Failed to check payment status. Please try again.',
            });
            throw error;
        }
    };

    return {
        statusResult,
        isCheckingStatus,
        checkStatusError,
        refetch: refetchWithToast,
    };
}

export function usePaymentWithToast() {
    // Initiate payment mutation with toast
    const {
        mutate: initiatePaymentMutation,
        isPending: isInitiatingPayment,
        error: initiatePaymentError,
        data: paymentResult,
    } = useApiMutation<PaymentResponse, PaymentRequest>(
        (paymentData) => paymentApi.initiatePayment(paymentData),
        {}, // No custom options
        [], // No queries to invalidate
        {
            successToast: true,
            successTitle: 'Payment Initiated',
            successMessage: 'Your payment has been successfully initiated.',
            errorToast: true,
            errorTitle: 'Payment Failed',
        }
    );

    // Get transaction history query with toast
    const {
        data: transactions = [],
        isLoading: isLoadingTransactions,
        error: transactionsError,
        refetch: refetchTransactionsBase,
    } = useApiQuery<PaymentStatus[]>(
        QUERY_KEYS.PAYMENT.HISTORY,
        paymentApi.getTransactionHistory,
        {
            // Start with disabled and manually enable when needed
            enabled: false,
        }
    );

    // Enhanced refetch with toast
    const refetchTransactions = async () => {
        const refreshToast = toast.loading('Loading transactions...');
        try {
            const result = await refetchTransactionsBase();
            toast.success('Transactions Updated', {
                id: refreshToast,
                description: `Successfully loaded ${result.data?.length || 0} transactions.`,
            });
            return result;
        } catch (error) {
            toast.error('Failed to Load Transactions', {
                id: refreshToast,
                description: 'Could not fetch your transaction history. Please try again.',
            });
            throw error;
        }
    };

    // Wrapper for initiatePayment with Promise interface for compatibility
    const initiatePayment = useCallback(
        async (paymentData: PaymentRequest) => {
            return new Promise<PaymentResponse>((resolve, reject) => {
                initiatePaymentMutation(paymentData, {
                    onSuccess: (response) => resolve(response),
                    onError: (error) => reject(error),
                });
            });
        },
        [initiatePaymentMutation]
    );

    return {
        // Data
        paymentResult,
        transactions,
        // Loading states
        loading: isInitiatingPayment || isLoadingTransactions,
        // Error states
        error: initiatePaymentError || transactionsError,
        // Methods
        initiatePayment,
        checkPaymentStatus: useCheckPaymentStatus,
        refetchTransactions,
    };
} 