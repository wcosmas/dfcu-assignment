import { z } from 'zod';
import {
    initiatePaymentSchema,
    transactionReferenceSchema
} from '../schemas/payment.schema';

// Infer types from Zod schemas
export type PaymentInitiateRequestDto = z.infer<typeof initiatePaymentSchema>;
export type TransactionReferenceParamsDto = z.infer<typeof transactionReferenceSchema>;

// Response DTOs (not derived from schemas)
export interface PaymentInitiateResponseDto {
    transactionReference: string;
    status: string;
    statusCode: number;
    message: string;
}

export interface PaymentStatusResponseDto {
    transactionReference: string;
    status: string;
    statusCode: number;
    message: string;
    timestamp: string;
} 