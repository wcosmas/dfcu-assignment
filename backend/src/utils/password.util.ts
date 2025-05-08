import bcrypt from 'bcrypt';
import { env } from '../config/env';

// Hash password
export const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(env.bcryptSaltRounds);
    return bcrypt.hash(password, salt);
};

// Compare password
export const comparePassword = async (
    password: string,
    hashedPassword: string
): Promise<boolean> => {
    return bcrypt.compare(password, hashedPassword);
}; 