import apiClient from './client';
import { PaymentRequest, PaymentResponse, PaymentStatus } from '@/types';

export const paymentApi = {
    /**
     * Initiate a new payment transaction
     */
    initiatePayment: async (paymentData: PaymentRequest): Promise<PaymentResponse> => {
        return await apiClient.post<PaymentResponse>('/payments/initiate', paymentData);
    },

    /**
     * Check status of a payment transaction
     */
    checkPaymentStatus: async (transactionReference: string): Promise<PaymentStatus> => {
        return await apiClient.get<PaymentStatus>(`/payments/status/${transactionReference}`);
    },

    /**
     * Get transaction history (optional - if backend supports it)
     */
    getTransactionHistory: async (): Promise<PaymentStatus[]> => {
        return await apiClient.get<PaymentStatus[]>('/payments/history');
    },
}; 