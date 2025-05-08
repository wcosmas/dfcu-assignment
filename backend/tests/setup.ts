import { resetPrismaMocks } from './mocks/prisma.mock';
import { resetJwtMocks } from './mocks/jwt.mock';
import { resetPasswordMocks } from './mocks/password.mock';
import { resetTransactionMocks } from './mocks/transaction.mock';

// Setup global test environment
beforeEach(() => {
    // Reset all mocks before each test
    resetPrismaMocks();
    resetJwtMocks();
    resetPasswordMocks();
    resetTransactionMocks();

    // Mock environment variables
    process.env.NODE_ENV = 'test';
    process.env.JWT_SECRET = 'test-jwt-secret';
    process.env.REFRESH_TOKEN_SECRET = 'test-refresh-token-secret';
    process.env.ACCESS_TOKEN_EXPIRY = '15m';
    process.env.REFRESH_TOKEN_EXPIRY = '7d';
});

// Global teardown
afterAll(() => {
    jest.resetAllMocks();
}); 