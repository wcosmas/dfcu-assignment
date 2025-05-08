import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

// Base schema without refinements
export const updateProfileSchema = z.object({
    fullName: z.string().min(3).max(100).optional(),
    email: z.string().email().optional(),
    currentPassword: z.string().min(8).optional(),
    newPassword: z.string().min(8)
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character')
        .optional()
});

// Custom validator middleware for password validation
export const validatePasswordUpdate = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { currentPassword, newPassword } = req.body;

    // If one password field is provided, the other must also be provided
    if ((currentPassword && !newPassword) || (!currentPassword && newPassword)) {
        return res.status(400).json({
            message: "Both current password and new password must be provided to change password",
            errors: [{
                field: "password",
                message: "Both current password and new password must be provided to change password"
            }]
        });
    }

    next();
}; 