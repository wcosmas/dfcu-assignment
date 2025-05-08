// Mock JWT utilities
export const generateAccessToken = jest.fn().mockReturnValue('mock-access-token');
export const generateRefreshToken = jest.fn().mockResolvedValue('mock-refresh-token');
export const verifyRefreshToken = jest.fn().mockResolvedValue('mock-user-id');
export const invalidateRefreshToken = jest.fn().mockResolvedValue(true);

// Reset all mocks before each test
export const resetJwtMocks = () => {
    generateAccessToken.mockClear();
    generateRefreshToken.mockClear();
    verifyRefreshToken.mockClear();
    invalidateRefreshToken.mockClear();
}; 