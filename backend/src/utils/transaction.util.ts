import crypto from 'crypto';
import { TransactionStatus } from '@prisma/client';

// Interface for transaction status result
export interface TransactionStatusResult {
    status: TransactionStatus;
    statusCode: number;
    message: string;
}

// Generate unique transaction reference
export const generateTransactionReference = (): string => {
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(4).toString('hex');
    return `TRX-${timestamp}-${randomString}`;
};

// Simulate transaction status based on required distribution
// 10% PENDING, 85% SUCCESSFUL, 5% FAILED
export const simulateTransactionStatus = (): TransactionStatusResult => {
    // Generate random number between 0 and 100
    const random = Math.floor(Math.random() * 100);

    // Determine status based on random number
    if (random < 10) {
        // 10% chance of PENDING
        return {
            status: TransactionStatus.PENDING,
            statusCode: 100,
            message: 'Transaction Pending',
        };
    } else if (random < 95) {
        // 85% chance of SUCCESSFUL
        return {
            status: TransactionStatus.SUCCESSFUL,
            statusCode: 200,
            message: 'Transaction successfully processed',
        };
    } else {
        // 5% chance of FAILED
        return {
            status: TransactionStatus.FAILED,
            statusCode: 400,
            message: generateFailureMessage(),
        };
    }
};

// Generate a random failure message
const generateFailureMessage = (): string => {
    const failureMessages = [
        'Transaction failed: Invalid payer account number',
        'Transaction failed: Invalid payee account number',
        'Transaction failed: Insufficient funds',
        'Transaction failed: Invalid amount',
        'Transaction failed: Unsupported currency',
        'Transaction failed: System error',
        'Transaction failed: Duplicate transaction',
        'Transaction failed: Transaction timed out',
    ];

    const randomIndex = Math.floor(Math.random() * failureMessages.length);
    return failureMessages[randomIndex];
};

// Add a delay to simulate processing time
// Ensures minimum response time of 100ms
export const addTransactionDelay = async (): Promise<void> => {
    const minimumDelayMs = 100;
    return new Promise((resolve) => setTimeout(resolve, minimumDelayMs));
}; 