import { z } from 'zod';

// DTO for profile update
export interface UpdateUserProfileRequestDto {
    fullName?: string;
    email?: string;
    currentPassword?: string;
    newPassword?: string;
}

// DTO for user profile response
export interface UserProfileResponseDto {
    id: string;
    username: string;
    email: string;
    fullName: string;
    accountNumber: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
} 