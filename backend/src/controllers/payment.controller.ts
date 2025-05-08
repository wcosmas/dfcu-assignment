import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { BadRequestException, NotFoundException } from '../utils/exceptions';
import { RequestWithUser } from '../interfaces/request.interface';
import { PaymentInitiateRequestDto, TransactionReferenceParamsDto } from '../dtos/payment.dto';
import {
    generateTransactionReference,
    simulateTransactionStatus,
    addTransactionDelay,
    TransactionStatusResult
} from '../utils/transaction.util';

const prisma = new PrismaClient();

/**
 * Initiate a payment transaction
 */
export const initiatePayment = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const paymentData: PaymentInitiateRequestDto = req.body;
        const { payer, payee, amount, currency, payerReference } = paymentData;

        // Verify payer account exists
        const payerUser = await prisma.user.findFirst({
            where: { accountNumber: payer }
        });

        if (!payerUser) {
            throw new BadRequestException('Invalid payer account number');
        }

        // Verify payee account exists
        const payeeUser = await prisma.user.findFirst({
            where: { accountNumber: payee }
        });

        if (!payeeUser) {
            throw new BadRequestException('Invalid payee account number');
        }

        // Generate transaction reference
        const transactionReference = generateTransactionReference();

        // Add minimum processing delay (100ms)
        await addTransactionDelay();

        // Simulate transaction status based on distribution rule
        const statusResult: TransactionStatusResult = simulateTransactionStatus();

        // Create transaction record - convert amount to a Decimal compatible value
        const transaction = await prisma.transaction.create({
            data: {
                transactionReference,
                amount: amount.toString(), // Convert to string for Prisma Decimal
                currency,
                payerReference,
                status: statusResult.status,
                statusCode: statusResult.statusCode,
                message: statusResult.message,
                payerId: payerUser.id,
                payeeId: payeeUser.id,
                payerAccountNumber: payer,
                payeeAccountNumber: payee
            }
        });

        // Send response
        res.status(200).json({
            transactionReference: transaction.transactionReference,
            status: transaction.status,
            statusCode: transaction.statusCode,
            message: transaction.message
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get the status of a payment transaction
 */
export const getPaymentStatus = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { transactionReference } = req.params as TransactionReferenceParamsDto;

        // Find transaction by reference
        const transaction = await prisma.transaction.findUnique({
            where: { transactionReference }
        });

        if (!transaction) {
            throw new NotFoundException('Transaction not found');
        }

        // Send response
        res.status(200).json({
            transactionReference: transaction.transactionReference,
            status: transaction.status,
            statusCode: transaction.statusCode,
            message: transaction.message,
            timestamp: transaction.createdAt.toISOString()
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get transaction history for the current user
 */
export const getTransactionHistory = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if (!req.user) {
            throw new BadRequestException('User not authenticated');
        }

        const userId = req.user.id;

        // Fetch transactions where the user is either payer or payee
        const transactions = await prisma.transaction.findMany({
            where: {
                OR: [
                    { payerId: userId },
                    { payeeId: userId }
                ]
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 20 // Limit to the most recent 20 transactions
        });

        // Format the response
        const formattedTransactions = transactions.map(transaction => ({
            transactionReference: transaction.transactionReference,
            amount: transaction.amount,
            currency: transaction.currency,
            status: transaction.status,
            statusCode: transaction.statusCode,
            message: transaction.message,
            timestamp: transaction.createdAt.toISOString(),
            payerReference: transaction.payerReference,
            payerAccountNumber: transaction.payerAccountNumber,
            payeeAccountNumber: transaction.payeeAccountNumber,
            type: transaction.payerId === userId ? 'SENT' : 'RECEIVED'
        }));

        res.status(200).json(formattedTransactions);
    } catch (error) {
        next(error);
    }
}; 