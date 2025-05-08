import {
    generateTransactionReference,
    simulateTransactionStatus,
    addTransactionDelay,
    TransactionStatusResult
} from '../../../src/utils/transaction.util';

describe('Transaction Utilities', () => {
    describe('generateTransactionReference', () => {
        it('should generate a unique transaction reference with correct format', () => {
            const reference = generateTransactionReference();

            // Check format: TRX-{timestamp}-{randomString}
            expect(reference).toMatch(/^TRX-\d+-[a-zA-Z0-9]+$/);

            // Ensure uniqueness
            const reference2 = generateTransactionReference();
            expect(reference).not.toEqual(reference2);
        });
    });

    describe('simulateTransactionStatus', () => {
        // Mock Math.random for predictable testing
        const originalRandom = Math.random;

        afterEach(() => {
            Math.random = originalRandom;
        });

        it('should return PENDING status (10% chance) when random value is 0.05', () => {
            Math.random = jest.fn().mockReturnValue(0.05);

            const result = simulateTransactionStatus();

            expect(result).toEqual({
                status: 'PENDING',
                statusCode: 100,
                message: 'Transaction Pending'
            });
        });

        it('should return SUCCESSFUL status (85% chance) when random value is 0.5', () => {
            Math.random = jest.fn().mockReturnValue(0.5);

            const result = simulateTransactionStatus();

            expect(result).toEqual({
                status: 'SUCCESSFUL',
                statusCode: 200,
                message: 'Transaction successfully processed'
            });
        });

        it('should return FAILED status (5% chance) when random value is 0.98', () => {
            Math.random = jest.fn().mockReturnValue(0.98);

            const result = simulateTransactionStatus();

            expect(result).toEqual({
                status: 'FAILED',
                statusCode: 400,
                message: expect.stringContaining('Transaction failed')
            });
        });
    });

    describe('addTransactionDelay', () => {
        // Mock setTimeout to avoid actual delay in tests
        jest.useFakeTimers();

        it('should return a promise that resolves after minimum delay', async () => {
            const delayPromise = addTransactionDelay();

            // Fast-forward time
            jest.runAllTimers();

            await expect(delayPromise).resolves.toBeUndefined();
        });
    });
}); 