import { Request } from 'express';

// Define a simplified User interface based on our Prisma schema
export interface User {
    id: string;
    username: string;
    email: string;
    fullName: string;
    accountNumber: string;
    role: 'USER' | 'ADMIN';
    createdAt: Date;
    updatedAt: Date;
}

export interface RequestWithUser extends Request {
    user?: User;
} 