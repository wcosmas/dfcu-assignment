import request from 'supertest';
import express from 'express';
import paymentRoutes from '../../src/routes/payment.route';
import { authMiddleware } from '../../src/middlewares/auth.middleware';
import { errorMiddleware } from '../../src/middlewares/error.middleware';
import { mockPrisma } from '../mocks/prisma.mock';

// Mock PrismaClient
jest.mock('@prisma/client', () => ({
    PrismaClient: mockPrisma
}));

// Mock middleware
jest.mock('../../src/middlewares/auth.middleware', () => ({
    authMiddleware: jest.fn((req, res, next) => {
        req.user = { id: 'test-user-id', role: 'USER' };
        next();
    })
}));

// Mock transaction utils
jest.mock('../../src/utils/transaction.util', () => require('../mocks/transaction.mock'));

describe('Payment Routes Integration Tests', () => {
    let app: express.Application;
    let prismaClientMock: any;

    beforeEach(() => {
        // Create a fresh express app for each test
        app = express();
        app.use(express.json());
        app.use('/api/payments', paymentRoutes);
        app.use(errorMiddleware);

        // Get prisma mock instance
        prismaClientMock = mockPrisma();
    });

    describe('POST /api/payments/initiate', () => {
        it('should return 200 and transaction details for valid payment', async () => {
            // Setup
            const paymentData = {
                payer: '1234567890',
                payee: '0987654321',
                amount: 100.00,
                currency: 'USD',
                payerReference: 'Test payment'
            };

            prismaClientMock.user.findFirst
                .mockResolvedValueOnce({
                    id: 'payer-id',
                    username: 'payer',
                    accountNumber: '1234567890'
                })
                .mockResolvedValueOnce({
                    id: 'payee-id',
                    username: 'payee',
                    accountNumber: '0987654321'
                });

            prismaClientMock.transaction.create.mockResolvedValue({
                id: 'transaction-id',
                transactionReference: 'TRX-1234567890-abcdef',
                amount: '100.00',
                currency: 'USD',
                payerReference: 'Test payment',
                status: 'SUCCESSFUL',
                statusCode: 200,
                message: 'Transaction successfully processed',
                payerId: 'payer-id',
                payeeId: 'payee-id',
                payerAccountNumber: '1234567890',
                payeeAccountNumber: '0987654321',
                createdAt: new Date(),
                updatedAt: new Date()
            });

            // Execute & Assert
            const response = await request(app)
                .post('/api/payments/initiate')
                .send(paymentData)
                .expect('Content-Type', /json/)
                .expect(200);

            // Check response structure
            expect(response.body).toHaveProperty('transactionReference', 'TRX-1234567890-abcdef');
            expect(response.body).toHaveProperty('status', 'SUCCESSFUL');
            expect(response.body).toHaveProperty('statusCode', 200);
            expect(response.body).toHaveProperty('message', 'Transaction successfully processed');
        });

        it('should return 400 for invalid payer account', async () => {
            // Setup
            const paymentData = {
                payer: 'invalid',
                payee: '0987654321',
                amount: 100.00,
                currency: 'USD'
            };

            prismaClientMock.user.findFirst.mockResolvedValue(null);

            // Execute & Assert
            const response = await request(app)
                .post('/api/payments/initiate')
                .send(paymentData)
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body).toHaveProperty('message', 'Invalid payer account number');
        });

        it('should return 400 for invalid payee account', async () => {
            // Setup
            const paymentData = {
                payer: '1234567890',
                payee: 'invalid',
                amount: 100.00,
                currency: 'USD'
            };

            prismaClientMock.user.findFirst
                .mockResolvedValueOnce({
                    id: 'payer-id',
                    username: 'payer',
                    accountNumber: '1234567890'
                })
                .mockResolvedValueOnce(null);

            // Execute & Assert
            const response = await request(app)
                .post('/api/payments/initiate')
                .send(paymentData)
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body).toHaveProperty('message', 'Invalid payee account number');
        });

        it('should return 400 for missing required fields', async () => {
            // Execute & Assert
            const response = await request(app)
                .post('/api/payments/initiate')
                .send({})
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body).toHaveProperty('message');
        });
    });

    describe('GET /api/payments/status/:transactionReference', () => {
        it('should return 200 and transaction status for valid reference', async () => {
            // Setup
            const transactionReference = 'TRX-1234567890-abcdef';
            const transactionDate = new Date();

            prismaClientMock.transaction.findUnique.mockResolvedValue({
                id: 'transaction-id',
                transactionReference,
                amount: '100.00',
                currency: 'USD',
                payerReference: 'Test payment',
                status: 'SUCCESSFUL',
                statusCode: 200,
                message: 'Transaction successfully processed',
                payerId: 'payer-id',
                payeeId: 'payee-id',
                payerAccountNumber: '1234567890',
                payeeAccountNumber: '0987654321',
                createdAt: transactionDate,
                updatedAt: transactionDate
            });

            // Execute & Assert
            const response = await request(app)
                .get(`/api/payments/status/${transactionReference}`)
                .expect('Content-Type', /json/)
                .expect(200);

            // Check response structure
            expect(response.body).toHaveProperty('transactionReference', transactionReference);
            expect(response.body).toHaveProperty('status', 'SUCCESSFUL');
            expect(response.body).toHaveProperty('statusCode', 200);
            expect(response.body).toHaveProperty('message', 'Transaction successfully processed');
            expect(response.body).toHaveProperty('timestamp', transactionDate.toISOString());
        });

        it('should return 404 for non-existent transaction reference', async () => {
            // Setup
            const transactionReference = 'TRX-nonexistent';

            prismaClientMock.transaction.findUnique.mockResolvedValue(null);

            // Execute & Assert
            const response = await request(app)
                .get(`/api/payments/status/${transactionReference}`)
                .expect('Content-Type', /json/)
                .expect(404);

            expect(response.body).toHaveProperty('message', 'Transaction not found');
        });
    });
}); 