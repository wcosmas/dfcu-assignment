import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    // Get the start time for request
    const startTime = new Date().getTime();

    // Log request details
    logger.info(`Incoming Request: [${req.method}] ${req.path}`, {
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        query: req.query,
        body: req.method !== 'GET' ? req.body : undefined,
    });

    // Override end method to log response
    const originalEnd = res.end;
    res.end = function (chunk?: any, encoding?: any): any {
        // Calculate request duration
        const endTime = new Date().getTime();
        const duration = endTime - startTime;

        // Log response
        logger.info(`Response: [${req.method}] ${req.path} >> Status: ${res.statusCode} (${duration}ms)`);

        // Call original end method
        return originalEnd.call(this, chunk, encoding);
    };

    next();
}; 