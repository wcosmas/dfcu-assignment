// Mock implementation of PrismaClient for tests
interface PrismaClientMock {
    user: {
        findUnique: jest.Mock;
        findFirst: jest.Mock;
        create: jest.Mock;
    };
    refreshToken: {
        create: jest.Mock;
        findUnique: jest.Mock;
        update: jest.Mock;
    };
    transaction: {
        create: jest.Mock;
        findUnique: jest.Mock;
    };
    $disconnect: jest.Mock;
    [key: string]: any; // Add index signature
}

const prismaClientMock: PrismaClientMock = {
    user: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
    },
    refreshToken: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
    },
    transaction: {
        create: jest.fn(),
        findUnique: jest.fn(),
    },
    $disconnect: jest.fn(),
};

export const mockPrisma = jest.fn().mockImplementation(() => prismaClientMock);

// Reset all mocks before each test
export const resetPrismaMocks = () => {
    Object.keys(prismaClientMock).forEach((key) => {
        if (typeof prismaClientMock[key] === 'object' && prismaClientMock[key] !== null) {
            Object.keys(prismaClientMock[key]).forEach((method) => {
                if (typeof prismaClientMock[key][method] === 'function' && prismaClientMock[key][method].mockReset) {
                    prismaClientMock[key][method].mockReset();
                }
            });
        } else if (typeof prismaClientMock[key] === 'function' && prismaClientMock[key].mockReset) {
            prismaClientMock[key].mockReset();
        }
    });
};

export default prismaClientMock; 