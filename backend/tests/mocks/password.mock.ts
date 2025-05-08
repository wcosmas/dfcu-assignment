// Mock password utilities
export const comparePassword = jest.fn().mockResolvedValue(true);
export const hashPassword = jest.fn().mockResolvedValue('hashed-password');

// Reset mocks before each test
export const resetPasswordMocks = () => {
    comparePassword.mockClear();
    hashPassword.mockClear();
}; 