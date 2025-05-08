import { Request, Response, NextFunction } from 'express';
import { verify, TokenExpiredError, JsonWebTokenError, JwtPayload } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { UnauthorizedException, ForbiddenException } from '../utils/exceptions';
import logger from '../config/logger';
import { env } from '../config/env';
import { RequestWithUser } from '../interfaces/request.interface';

const prisma = new PrismaClient();

export const authMiddleware = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        // Check if Authorization header exists
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('Authentication token required');
        }

        // Extract token
        const token = authHeader.split(' ')[1];

        if (!token) {
            throw new UnauthorizedException('Invalid token format');
        }

        try {
            // Verify token
            const decoded = verify(token, env.jwtSecret) as JwtPayload;

            // Check if user exists
            const user = await prisma.user.findUnique({
                where: { id: decoded.userId },
            });

            if (!user) {
                throw new UnauthorizedException('User not found');
            }

            // Add user to request object
            req.user = user;
            next();

        } catch (error) {
            // Handle JWT errors
            if (error instanceof TokenExpiredError) {
                throw new UnauthorizedException('Token has expired');
            } else if (error instanceof JsonWebTokenError) {
                throw new UnauthorizedException('Invalid token');
            }

            // Re-throw other errors
            throw error;
        }
    } catch (error) {
        next(error);
    }
};

// Middleware for admin-only routes
export const adminMiddleware = (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
): void => {
    try {
        if (!req.user) {
            throw new UnauthorizedException('Authentication required');
        }

        if (req.user.role !== 'ADMIN') {
            throw new ForbiddenException('Admin access required');
        }

        next();
    } catch (error) {
        next(error);
    }
}; 