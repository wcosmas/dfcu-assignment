import request from 'supertest';
import express from 'express';
import authRoutes from '../../src/routes/auth.route';
import { errorMiddleware } from '../../src/middlewares/error.middleware';
import { mockPrisma } from '../mocks/prisma.mock';

// Mock PrismaClient
jest.mock('@prisma/client', () => ({
    PrismaClient: mockPrisma
}));

// Mock the utilities
jest.mock('../../src/utils/jwt.util', () => require('../mocks/jwt.mock'));
jest.mock('../../src/utils/password.util', () => require('../mocks/password.mock'));

describe('Auth Routes Integration Tests', () => {
    let app: express.Application;
    let prismaClientMock: any;

    beforeEach(() => {
        // Create a fresh express app for each test
        app = express();
        app.use(express.json());
        app.use('/api/auth', authRoutes);
        app.use(errorMiddleware);

        // Get prisma mock instance
        prismaClientMock = mockPrisma();
    });

    describe('POST /api/auth/login', () => {
        it('should return 200 and tokens for valid credentials', async () => {
            // Setup
            const credentials = {
                username: 'testuser',
                password: 'password123'
            };

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

            // Execute & Assert
            const response = await request(app)
                .post('/api/auth/login')
                .send(credentials)
                .expect('Content-Type', /json/)
                .expect(200);

            // Check response structure
            expect(response.body).toHaveProperty('userId', 'user-id-123');
            expect(response.body).toHaveProperty('username', 'testuser');
            expect(response.body).toHaveProperty('accessToken', 'mock-access-token');
            expect(response.body).toHaveProperty('refreshToken', 'mock-refresh-token');
            expect(response.body).toHaveProperty('accessTokenExpiresIn');
        });

        it('should return 401 for invalid credentials', async () => {
            // Setup
            const credentials = {
                username: 'wronguser',
                password: 'wrongpassword'
            };

            prismaClientMock.user.findUnique.mockResolvedValue(null);

            // Execute & Assert
            const response = await request(app)
                .post('/api/auth/login')
                .send(credentials)
                .expect('Content-Type', /json/)
                .expect(401);

            expect(response.body).toHaveProperty('message', 'Invalid credentials');
        });

        it('should return 400 for missing required fields', async () => {
            // Execute & Assert
            const response = await request(app)
                .post('/api/auth/login')
                .send({})
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body).toHaveProperty('message');
        });
    });

    describe('POST /api/auth/refresh', () => {
        it('should return 200 and new tokens for valid refresh token', async () => {
            // Setup
            const body = {
                refreshToken: 'valid-refresh-token'
            };

            // Execute & Assert
            const response = await request(app)
                .post('/api/auth/refresh')
                .send(body)
                .expect('Content-Type', /json/)
                .expect(200);

            // Check response structure
            expect(response.body).toHaveProperty('accessToken', 'mock-access-token');
            expect(response.body).toHaveProperty('refreshToken', 'mock-refresh-token');
            expect(response.body).toHaveProperty('accessTokenExpiresIn');
        });

        it('should return 400 for missing refresh token', async () => {
            // Execute & Assert
            const response = await request(app)
                .post('/api/auth/refresh')
                .send({})
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body).toHaveProperty('message');
        });
    });

    describe('POST /api/auth/logout', () => {
        it('should return 200 for successful logout', async () => {
            // Setup
            const body = {
                refreshToken: 'valid-refresh-token'
            };

            // Execute & Assert
            const response = await request(app)
                .post('/api/auth/logout')
                .send(body)
                .expect('Content-Type', /json/)
                .expect(200);

            // Check response structure
            expect(response.body).toHaveProperty('message', 'Logout successful');
        });

        it('should return 400 for missing refresh token', async () => {
            // Execute & Assert
            const response = await request(app)
                .post('/api/auth/logout')
                .send({})
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body).toHaveProperty('message');
        });
    });

    describe('POST /api/auth/register', () => {
        it('should return 201 for successful registration', async () => {
            // Setup
            const userData = {
                username: 'newuser',
                password: 'password123',
                email: 'new@example.com',
                fullName: 'New User',
                accountNumber: '9876543210'
            };

            prismaClientMock.user.findFirst.mockResolvedValue(null);
            prismaClientMock.user.create.mockResolvedValue({
                id: 'new-user-id',
                username: 'newuser',
                password: 'hashed-password',
                email: 'new@example.com',
                fullName: 'New User',
                accountNumber: '9876543210',
                role: 'USER',
                createdAt: new Date(),
                updatedAt: new Date()
            });

            // Execute & Assert
            const response = await request(app)
                .post('/api/auth/register')
                .send(userData)
                .expect('Content-Type', /json/)
                .expect(201);

            // Check response structure
            expect(response.body).toHaveProperty('userId', 'new-user-id');
            expect(response.body).toHaveProperty('username', 'newuser');
            expect(response.body).toHaveProperty('message', 'User registered successfully');
        });

        it('should return 409 for existing username', async () => {
            // Setup
            const userData = {
                username: 'existinguser',
                password: 'password123',
                email: 'new@example.com',
                fullName: 'New User',
                accountNumber: '9876543210'
            };

            prismaClientMock.user.findFirst.mockResolvedValue({
                id: 'existing-user-id',
                username: 'existinguser',
                password: 'hashed-password',
                email: 'existing@example.com',
                fullName: 'Existing User',
                accountNumber: '1234567890',
                role: 'USER',
                createdAt: new Date(),
                updatedAt: new Date()
            });

            // Execute & Assert
            const response = await request(app)
                .post('/api/auth/register')
                .send(userData)
                .expect('Content-Type', /json/)
                .expect(409);

            expect(response.body).toHaveProperty('message', 'Username already exists');
        });

        it('should return 400 for missing required fields', async () => {
            // Execute & Assert
            const response = await request(app)
                .post('/api/auth/register')
                .send({})
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body).toHaveProperty('message');
        });
    });
}); 