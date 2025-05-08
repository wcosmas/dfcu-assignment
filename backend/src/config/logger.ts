import winston from 'winston';

const { combine, timestamp, printf, colorize } = winston.format;

// Custom log format
const logFormat = printf(({ level, message, timestamp, ...meta }) => {
    return `${timestamp} ${level}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
});

// Create Winston logger
const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
    ),
    transports: [
        // Console transport
        new winston.transports.Console({
            format: combine(
                colorize(),
                timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                logFormat
            ),
        }),
        // File transport for errors
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
        }),
        // File transport for all logs
        new winston.transports.File({
            filename: 'logs/combined.log',
        }),
    ],
    exitOnError: false,
});

export default logger; 