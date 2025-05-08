import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import {
    LoginRequestDto,
    RefreshTokenRequestDto,
    LogoutRequestDto,
    RegisterUserRequestDto
} from '../dtos/auth.dto';
import {
    BadRequestException,
    UnauthorizedException,
    ConflictException
} from '../utils/exceptions';
import { comparePassword, hashPassword } from '../utils/password.util';
import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
    invalidateRefreshToken
} from '../utils/jwt.util';
import { env } from '../config/env';

const prisma = new PrismaClient();

/**
 * Login user and return JWT tokens
 */
export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { username, password }: LoginRequestDto = req.body;

        // Find user by username
        const user = await prisma.user.findUnique({
            where: { username },
        });

        // Check if user exists and password is correct
        if (!user || !(await comparePassword(password, user.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Generate tokens
        const accessToken = generateAccessToken(user.id);
        const refreshToken = await generateRefreshToken(user.id);

        // Parse token expiry for response
        const expiryDuration = env.accessTokenExpiry;
        let accessTokenExpiresIn = 900; // Default 15 minutes in seconds

        const durationMatch = expiryDuration.match(/^(\d+)([dhms])$/);
        if (durationMatch) {
            const value = parseInt(durationMatch[1]);
            const unit = durationMatch[2];

            switch (unit) {
                case 'd':
                    accessTokenExpiresIn = value * 24 * 60 * 60;
                    break;
                case 'h':
                    accessTokenExpiresIn = value * 60 * 60;
                    break;
                case 'm':
                    accessTokenExpiresIn = value * 60;
                    break;
                case 's':
                    accessTokenExpiresIn = value;
                    break;
            }
        }

        // Send response
        res.status(200).json({
            userId: user.id,
            username: user.username,
            accessToken,
            refreshToken,
            accessTokenExpiresIn
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Refresh access token using refresh token
 */
export const refresh = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { refreshToken }: RefreshTokenRequestDto = req.body;

        // Verify refresh token
        const userId = await verifyRefreshToken(refreshToken);

        if (!userId) {
            throw new UnauthorizedException('Invalid or expired refresh token');
        }

        // Generate new tokens
        const accessToken = generateAccessToken(userId);
        const newRefreshToken = await generateRefreshToken(userId);

        // Invalidate old refresh token (one-time use)
        await invalidateRefreshToken(refreshToken);

        // Parse token expiry for response
        const expiryDuration = env.accessTokenExpiry;
        let accessTokenExpiresIn = 900; // Default 15 minutes in seconds

        const durationMatch = expiryDuration.match(/^(\d+)([dhms])$/);
        if (durationMatch) {
            const value = parseInt(durationMatch[1]);
            const unit = durationMatch[2];

            switch (unit) {
                case 'd':
                    accessTokenExpiresIn = value * 24 * 60 * 60;
                    break;
                case 'h':
                    accessTokenExpiresIn = value * 60 * 60;
                    break;
                case 'm':
                    accessTokenExpiresIn = value * 60;
                    break;
                case 's':
                    accessTokenExpiresIn = value;
                    break;
            }
        }

        // Send response
        res.status(200).json({
            accessToken,
            refreshToken: newRefreshToken,
            accessTokenExpiresIn
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Logout user by invalidating refresh token
 */
export const logout = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { refreshToken }: LogoutRequestDto = req.body;

        // Invalidate refresh token
        const success = await invalidateRefreshToken(refreshToken);

        if (!success) {
            throw new BadRequestException('Invalid refresh token');
        }

        // Send response
        res.status(200).json({
            message: 'Logout successful'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Register new user
 */
export const register = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userData: RegisterUserRequestDto = req.body;

        // Check if username already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { username: userData.username },
                    { email: userData.email },
                    { accountNumber: userData.accountNumber }
                ]
            }
        });

        if (existingUser) {
            if (existingUser.username === userData.username) {
                throw new ConflictException('Username already exists');
            }
            if (existingUser.email === userData.email) {
                throw new ConflictException('Email already in use');
            }
            if (existingUser.accountNumber === userData.accountNumber) {
                throw new ConflictException('Account number already registered');
            }
        }

        // Hash password
        const hashedPassword = await hashPassword(userData.password);

        // Create user
        const newUser = await prisma.user.create({
            data: {
                username: userData.username,
                password: hashedPassword,
                email: userData.email,
                fullName: userData.fullName,
                accountNumber: userData.accountNumber,
                role: 'USER' // Default role
            }
        });

        // Send response
        res.status(201).json({
            userId: newUser.id,
            username: newUser.username,
            message: 'User registered successfully'
        });
    } catch (error) {
        next(error);
    }
}; 