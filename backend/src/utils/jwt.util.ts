import { sign, verify, SignOptions } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { env } from '../config/env';

const prisma = new PrismaClient();

// Generate access token
export const generateAccessToken = (userId: string): string => {
    const payload = { userId };
    const options: SignOptions = { expiresIn: '1h' }

    return sign(payload, env.jwtSecret, options);
};

// Generate refresh token
export const generateRefreshToken = async (userId: string): Promise<string> => {
    // Create token
    const refreshToken = uuidv4();

    // Calculate expiry date
    const expiryDuration = env.refreshTokenExpiry;
    const expiryDate = new Date();

    // Handle different expiry formats (e.g., '7d', '24h', etc.)
    const durationMatch = expiryDuration.match(/^(\d+)([dhms])$/);

    if (durationMatch) {
        const value = parseInt(durationMatch[1]);
        const unit = durationMatch[2];

        switch (unit) {
            case 'd':
                expiryDate.setDate(expiryDate.getDate() + value);
                break;
            case 'h':
                expiryDate.setHours(expiryDate.getHours() + value);
                break;
            case 'm':
                expiryDate.setMinutes(expiryDate.getMinutes() + value);
                break;
            case 's':
                expiryDate.setSeconds(expiryDate.getSeconds() + value);
                break;
        }
    } else {
        // Default to 7 days if format is invalid
        expiryDate.setDate(expiryDate.getDate() + 7);
    }

    // Save refresh token to database
    await prisma.refreshToken.create({
        data: {
            token: refreshToken,
            expires: expiryDate,
            userId,
        },
    });

    return refreshToken;
};

// Verify refresh token
export const verifyRefreshToken = async (token: string): Promise<string | null> => {
    try {
        // Find token in database
        const refreshToken = await prisma.refreshToken.findUnique({
            where: { token },
            include: { user: true },
        });

        // Check if token exists and is valid
        if (!refreshToken || refreshToken.isRevoked) {
            return null;
        }

        // Check if token is expired
        if (new Date() > refreshToken.expires) {
            // Mark as revoked
            await prisma.refreshToken.update({
                where: { id: refreshToken.id },
                data: { isRevoked: true },
            });
            return null;
        }

        return refreshToken.userId;
    } catch (error) {
        return null;
    }
};

// Invalidate refresh token (for logout)
export const invalidateRefreshToken = async (token: string): Promise<boolean> => {
    try {
        // Find and update token
        const refreshToken = await prisma.refreshToken.findUnique({
            where: { token },
        });

        if (!refreshToken) {
            return false;
        }

        // Mark as revoked
        await prisma.refreshToken.update({
            where: { id: refreshToken.id },
            data: { isRevoked: true },
        });

        return true;
    } catch (error) {
        return false;
    }
}; 