import { Request, Response } from 'express';
import { login } from '../../../src/controllers/auth.controller';

// Mock PrismaClient
jest.mock('@prisma/client', () => {
    return {
        PrismaClient: jest.fn().mockImplementation(() => ({
            user: {
                findUnique: jest.fn().mockResolvedValue({
                    id: 'user-id-123',
                    username: 'testuser',
                    password: 'hashed-password',
                    email: 'test@example.com',
                    fullName: 'Test User',
                    accountNumber: '1234567890',
                    role: 'USER',
                    createdAt: new Date(),
                    updatedAt: new Date()
                })
            },
            $disconnect: jest.fn()
        }))
    };
});

// Mock the JWT utils
jest.mock('../../../src/utils/jwt.util', () => ({
    generateAccessToken: jest.fn().mockReturnValue('mock-access-token'),
    generateRefreshToken: jest.fn().mockResolvedValue('mock-refresh-token')
}));

// Mock the password utils
jest.mock('../../../src/utils/password.util', () => ({
    comparePassword: jest.fn().mockResolvedValue(true)
}));

// Mock env config
jest.mock('../../../src/config/env', () => ({
    env: {
        accessTokenExpiry: '1h'
    }
}));

describe('Auth Controller', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: jest.Mock;

    beforeEach(() => {
        req = { body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    describe('login', () => {
        it('should login a user with valid credentials', async () => {
            // Setup
            req.body = {
                username: 'testuser',
                password: 'password123'
            };

            // Execute
            await login(req as Request, res as Response, next);

            // Assert
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                userId: 'user-id-123',
                username: 'testuser',
                accessToken: 'mock-access-token',
                refreshToken: 'mock-refresh-token'
            }));
        });
    });
}); 