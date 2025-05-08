// Mock transaction utilities
export const generateTransactionReference = jest.fn().mockReturnValue('TRX-1234567890-abcdef');

export const simulateTransactionStatus = jest.fn().mockReturnValue({
    status: 'SUCCESSFUL',
    statusCode: 200,
    message: 'Transaction successfully processed'
});

export const addTransactionDelay = jest.fn().mockResolvedValue(undefined);

// Reset mocks before each test
export const resetTransactionMocks = () => {
    generateTransactionReference.mockClear();
    simulateTransactionStatus.mockClear();
    addTransactionDelay.mockClear();
}; 