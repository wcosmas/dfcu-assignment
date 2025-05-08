import { generateAccessToken } from '../../../src/utils/jwt.util';
import jwt from 'jsonwebtoken';

// Mock env config
jest.mock('../../../src/config/env', () => ({
    env: {
        jwtSecret: 'test-jwt-secret',
        accessTokenExpiry: '1h'
    }
}));

// Mock jsonwebtoken
jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(() => 'mock-access-token')
}));

describe('JWT Utilities - Basic Tests', () => {
    beforeEach(() => {
        // Clear all mocks
        jest.clearAllMocks();
    });

    describe('generateAccessToken', () => {
        it('should generate a JWT access token with correct payload and expiry', () => {
            // Setup
            const userId = 'test-user-id';

            // Execute
            const token = generateAccessToken(userId);

            // Assert
            expect(jwt.sign).toHaveBeenCalledWith(
                { userId },
                'test-jwt-secret',
                { expiresIn: '1h' }
            );
            expect(token).toBe('mock-access-token');
        });
    });
}); 