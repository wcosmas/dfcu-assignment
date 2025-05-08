import { NextFunction, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { NotFoundException, BadRequestException } from '../utils/exceptions';
import { hashPassword, comparePassword } from '../utils/password.util';
import { UpdateUserProfileRequestDto } from '../dtos/user.dto';
import { RequestWithUser } from '../interfaces/request.interface';

const prisma = new PrismaClient();

/**
 * Get user profile information
 */
export const getProfile = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            throw new BadRequestException('User ID is required');
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                email: true,
                fullName: true,
                accountNumber: true,
                role: true,
                createdAt: true,
                updatedAt: true
            }
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

/**
 * Update user profile information
 */
export const updateProfile = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = req.user?.id;
        const userData: UpdateUserProfileRequestDto = req.body;

        if (!userId) {
            throw new BadRequestException('User ID is required');
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!existingUser) {
            throw new NotFoundException('User not found');
        }

        // Prepare update data
        const updateData: any = {};

        if (userData.fullName) {
            updateData.fullName = userData.fullName;
        }

        if (userData.email) {
            // Check if email is already taken by another user
            const emailExists = await prisma.user.findFirst({
                where: {
                    email: userData.email,
                    id: { not: userId }
                }
            });

            if (emailExists) {
                throw new BadRequestException('Email already in use by another account');
            }

            updateData.email = userData.email;
        }

        // Handle password update if provided
        if (userData.currentPassword && userData.newPassword) {
            // Verify current password
            const isPasswordValid = await comparePassword(
                userData.currentPassword,
                existingUser.password
            );

            if (!isPasswordValid) {
                throw new BadRequestException('Current password is incorrect');
            }

            // Hash new password
            updateData.password = await hashPassword(userData.newPassword);
        }

        // Update user in database
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
            select: {
                id: true,
                username: true,
                email: true,
                fullName: true,
                accountNumber: true,
                role: true,
                createdAt: true,
                updatedAt: true
            }
        });

        res.status(200).json({
            message: 'Profile updated successfully',
            user: updatedUser
        });
    } catch (error) {
        next(error);
    }
}; 