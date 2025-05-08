'use client';

import { useCallback } from 'react';
import { paymentApi } from '@/api/payment';
import { PaymentRequest, PaymentResponse, PaymentStatus } from '@/types';
import { useApiMutation } from './useApiMutations';
import { useApiQuery } from './useApiQueries';
import { QUERY_KEYS } from '@/lib/query-keys';

export function usePayment() {
    // Initiate payment mutation
    const {
        mutate: initiatePaymentMutation,
        isPending: isInitiatingPayment,
        error: initiatePaymentError,
        data: paymentResult,
    } = useApiMutation<PaymentResponse, PaymentRequest>(
        (paymentData) => paymentApi.initiatePayment(paymentData)
    );

    // Check payment status query
    const checkPaymentStatus = (transactionReference: string) => {
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

        return {
            statusResult,
            isCheckingStatus,
            checkStatusError,
            refetch,
        };
    };

    // Get transaction history query
    const {
        data: transactions = [],
        isLoading: isLoadingTransactions,
        error: transactionsError,
        refetch: refetchTransactions,
    } = useApiQuery<PaymentStatus[]>(
        QUERY_KEYS.PAYMENT.HISTORY,
        paymentApi.getTransactionHistory,
        {
            // Start with disabled and manually enable when needed
            enabled: false,
        }
    );

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

    // For compatibility with existing code
    const getTransactionHistory = useCallback(async () => {
        const result = await refetchTransactions();
        return result.data || [];
    }, [refetchTransactions]);

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
        checkPaymentStatus,
        getTransactionHistory,
        refetchTransactions,
    };
} 