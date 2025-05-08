// User types
export interface User {
    userId: string;
    username: string;
    fullName?: string;
    email?: string;
    accountNumber?: string;
    role?: 'USER' | 'ADMIN';
}

// Auth types
export interface LoginRequest {
    username: string;
    password: string;
}

export interface AuthResponse {
    userId: string;
    username: string;
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresIn: number;
}

// Payment types
export interface PaymentRequest {
    payer: string;
    payee: string;
    amount: number;
    currency: string;
    payerReference?: string;
}

export interface PaymentResponse {
    transactionReference: string;
    message: string;
    status?: string;
    statusCode?: number;
}

export interface PaymentStatus {
    transactionReference: string;
    status: 'PENDING' | 'SUCCESSFUL' | 'FAILED';
    statusCode: 100 | 200 | 400;
    message: string;
    timestamp: string;
}

// API error type
export interface ApiError {
    message: string;
    status: number;
    errors?: Record<string, string[]>;
}

// User profile types
export interface UserProfile {
    id: string;
    username: string;
    email: string;
    fullName: string;
    accountNumber: string;
    role: string;
    createdAt: string;
    updatedAt: string;
}

export interface UpdateProfileRequest {
    fullName?: string;
    email?: string;
    currentPassword?: string;
    newPassword?: string;
} 