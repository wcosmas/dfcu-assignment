import { z } from 'zod';
import {
    loginSchema,
    refreshTokenSchema,
    logoutSchema,
    registerUserSchema
} from '../schemas/auth.schema';

// Infer types from Zod schemas
export type LoginRequestDto = z.infer<typeof loginSchema>;
export type RefreshTokenRequestDto = z.infer<typeof refreshTokenSchema>;
export type LogoutRequestDto = z.infer<typeof logoutSchema>;
export type RegisterUserRequestDto = z.infer<typeof registerUserSchema>;

// Response DTOs (not derived from schemas)
export interface LoginResponseDto {
    userId: string;
    username: string;
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresIn: number;
}

export interface RefreshTokenResponseDto {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresIn: number;
}

export interface LogoutResponseDto {
    message: string;
}

export interface RegisterUserResponseDto {
    userId: string;
    username: string;
    message: string;
} 