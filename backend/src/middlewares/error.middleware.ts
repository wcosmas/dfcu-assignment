import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';
import { HttpException } from '../utils/exceptions';

export const errorMiddleware = (
    error: HttpException,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const status = error.status || 500;
    const message = error.message || 'Something went wrong';

    // Log the error
    logger.error(`[${req.method}] ${req.path} >> StatusCode: ${status}, Message: ${message}`, {
        stack: error.stack,
        path: req.path,
        method: req.method,
        ip: req.ip,
    });

    // Don't expose stack trace in production
    const responseData = {
        status,
        message,
        stack: process.env.NODE_ENV === 'production' ? undefined : error.stack,
    };

    res.status(status).json(responseData);
}; 