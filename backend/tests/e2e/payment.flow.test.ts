import request from 'supertest';
import app from '../../src/app';
import { mockPrisma } from '../mocks/prisma.mock';

// Mock PrismaClient
jest.mock('@prisma/client', () => ({
    PrismaClient: mockPrisma
}));

// Mock JWT utils
jest.mock('../../src/utils/jwt.util', () => require('../mocks/jwt.mock'));

// Mock password utils
jest.mock('../../src/utils/password.util', () => require('../mocks/password.mock'));

// Mock transaction utils
jest.mock('../../src/utils/transaction.util', () => require('../mocks/transaction.mock'));

describe('End-to-End Payment Flow', () => {
    let accessToken: string;
    let refreshToken: string;
    let transactionReference: string;
    let prismaClientMock: any;

    beforeAll(() => {
        // Reset all mocks
        jest.clearAllMocks();

        // Get prisma mock instance
        prismaClientMock = mockPrisma();
    });

    // Test 1: User Login
    describe('1. Authentication', () => {
        it('should successfully log in', async () => {
            // Setup mock
            prismaClientMock.user.findUnique.mockResolvedValue({
                id: 'user-id-123',
                username: 'testuser',
                password: 'hashed-password',
                email: 'test@example.com',
                fullName: 'Test User',
                accountNumber: '1234567890',
                role: 'USER',
                createdAt: new Date(),
                updatedAt: new Date()
            });

            // Login request
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    username: 'testuser',
                    password: 'password123'
                })
                .expect(200);

            // Store tokens for subsequent requests
            accessToken = response.body.accessToken;
            refreshToken = response.body.refreshToken;

            expect(accessToken).toBe('mock-access-token');
            expect(refreshToken).toBe('mock-refresh-token');
        });
    });

    // Test 2: Initiate Payment
    describe('2. Payment Initiation', () => {
        it('should successfully initiate a payment', async () => {
            // Setup mocks
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

            // Payment initiation request
            const response = await request(app)
                .post('/api/payments/initiate')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    payer: '1234567890',
                    payee: '0987654321',
                    amount: 100.00,
                    currency: 'USD',
                    payerReference: 'Test payment'
                })
                .expect(200);

            // Store transaction reference for status check
            transactionReference = response.body.transactionReference;

            expect(transactionReference).toBe('TRX-1234567890-abcdef');
            expect(response.body.status).toBe('SUCCESSFUL');
            expect(response.body.statusCode).toBe(200);
        });
    });

    // Test 3: Check Payment Status
    describe('3. Payment Status Check', () => {
        it('should retrieve transaction status', async () => {
            // Setup mock
            const transactionDate = new Date();
            prismaClientMock.transaction.findUnique.mockResolvedValue({
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
                createdAt: transactionDate,
                updatedAt: transactionDate
            });

            // Status check request
            const response = await request(app)
                .get(`/api/payments/status/${transactionReference}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200);

            expect(response.body.transactionReference).toBe('TRX-1234567890-abcdef');
            expect(response.body.status).toBe('SUCCESSFUL');
            expect(response.body.timestamp).toBe(transactionDate.toISOString());
        });
    });

    // Test 4: Token Refresh
    describe('4. Token Refresh', () => {
        it('should refresh tokens', async () => {
            // Refresh request
            const response = await request(app)
                .post('/api/auth/refresh')
                .send({
                    refreshToken
                })
                .expect(200);

            // Update tokens
            accessToken = response.body.accessToken;
            refreshToken = response.body.refreshToken;

            expect(accessToken).toBe('mock-access-token');
            expect(refreshToken).toBe('mock-refresh-token');
        });
    });

    // Test 5: Logout
    describe('5. Logout', () => {
        it('should logout successfully', async () => {
            // Logout request
            const response = await request(app)
                .post('/api/auth/logout')
                .send({
                    refreshToken
                })
                .expect(200);

            expect(response.body.message).toBe('Logout successful');
        });
    });
}); 