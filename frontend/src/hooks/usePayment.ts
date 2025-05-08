import { useState, useCallback } from 'react';
import { paymentApi } from '@/api/payment';
import { PaymentRequest, PaymentResponse, PaymentStatus } from '@/types';

export function usePayment() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [paymentResult, setPaymentResult] = useState<PaymentResponse | null>(null);
    const [statusResult, setStatusResult] = useState<PaymentStatus | null>(null);
    const [transactions, setTransactions] = useState<PaymentStatus[]>([]);

    // Initiate a payment
    const initiatePayment = useCallback(async (paymentData: PaymentRequest) => {
        setLoading(true);
        setError(null);

        try {
            const response = await paymentApi.initiatePayment(paymentData);
            setPaymentResult(response);
            return response;
        } catch (err: any) {
            const message = err.response?.data?.message || 'Payment initiation failed';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Check status of a payment
    const checkPaymentStatus = useCallback(async (transactionReference: string) => {
        setLoading(true);
        setError(null);

        try {
            const response = await paymentApi.checkPaymentStatus(transactionReference);
            setStatusResult(response);
            return response;
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to check payment status';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Get transaction history
    const getTransactionHistory = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await paymentApi.getTransactionHistory();
            setTransactions(response);
            return response;
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to fetch transaction history';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Reset state (useful when navigating between forms)
    const resetState = useCallback(() => {
        setPaymentResult(null);
        setStatusResult(null);
        setError(null);
    }, []);

    return {
        loading,
        error,
        paymentResult,
        statusResult,
        transactions,
        initiatePayment,
        checkPaymentStatus,
        getTransactionHistory,
        resetState,
    };
} 