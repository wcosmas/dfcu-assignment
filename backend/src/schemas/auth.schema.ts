import { z } from 'zod';

/**
 * Login schema
 */
export const loginSchema = z.object({
    username: z.string({
        required_error: "Username is required",
        invalid_type_error: "Username must be a string"
    }).min(1, "Username cannot be empty"),

    password: z.string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string"
    }).min(1, "Password cannot be empty")
});

/**
 * Refresh token schema
 */
export const refreshTokenSchema = z.object({
    refreshToken: z.string({
        required_error: "Refresh token is required",
        invalid_type_error: "Refresh token must be a string"
    }).min(1, "Refresh token cannot be empty")
});

/**
 * Logout schema
 */
export const logoutSchema = z.object({
    refreshToken: z.string({
        required_error: "Refresh token is required",
        invalid_type_error: "Refresh token must be a string"
    }).min(1, "Refresh token cannot be empty")
});

/**
 * Registration schema
 */
export const registerUserSchema = z.object({
    username: z.string({
        required_error: "Username is required",
        invalid_type_error: "Username must be a string"
    })
        .min(3, "Username must be at least 3 characters long")
        .max(50, "Username cannot exceed 50 characters")
        .trim(),

    password: z.string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string"
    })
        .min(8, "Password must be at least 8 characters long")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        ),

    email: z.string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a string"
    })
        .email("Invalid email format")
        .trim(),

    fullName: z.string({
        required_error: "Full name is required",
        invalid_type_error: "Full name must be a string"
    })
        .min(1, "Full name cannot be empty")
        .trim(),

    accountNumber: z.string({
        required_error: "Account number is required",
        invalid_type_error: "Account number must be a string"
    })
        .length(10, "Account number must be exactly 10 digits")
        .regex(/^\d{10}$/, "Account number must consist of 10 digits")
}); 