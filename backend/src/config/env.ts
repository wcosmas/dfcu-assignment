import { config } from 'dotenv';
import path from 'path';

config({ path: path.resolve(__dirname, '../../.env') });

export const env = {
    // Server
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',

    // Database
    databaseUrl: process.env.DATABASE_URL || '',

    // JWT
    jwtSecret: process.env.JWT_SECRET || 'jwt_default_secret',
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || 'refresh_default_secret',
    accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY || '15m',
    refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY || '7d',

    // Rate Limiting
    rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
    rateLimitMax: Number(process.env.RATE_LIMIT_MAX) || 100,

    // Bcrypt
    bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 12,

    // CORS
    corsOrigin: process.env.CORS_ORIGIN || '*',
}; 